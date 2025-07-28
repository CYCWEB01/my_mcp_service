import { FastMCP } from "fastmcp";
import { z } from "zod";
import axios from "axios";
import fs from "fs";
import path from "path";
import 'dotenv/config';
// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// FastMCP 服务器
const mcpServer = new FastMCP({
  name: "My Server",
  version: "1.0.0",
});

// 原有的加法工具
mcpServer.addTool({
  name: "add",
  description: "Add two numbers",
  parameters: z.object({
    a: z.number(),
    b: z.number(),
  }),
  execute: async (args) => {
    return String(args.a + args.b);
  },
});

// DeepSeek 聊天工具
mcpServer.addTool({
  name: "deepseek_chat",
  description: "使用Bach进行对话",
  parameters: z.object({
    message: z.string().describe("用户输入的消息"),
    system_prompt: z.string().optional(), // 不再设置 default，后续逻辑动态赋值
    model: z.string().optional().default("deepseek-chat").describe("使用的模型名称"),
    temperature: z.number().optional().default(0.7).describe("生成文本的随机性，0-1之间"),
    max_tokens: z.number().optional().default(1000).describe("最大生成token数"),
  }),
  execute: async (args) => {
    try {
      const messages = [];
      let systemPrompt = args.system_prompt;
      // 如果未传 system_prompt，则从 prompts.json 读取 frontend_architect 模板
      if (!systemPrompt) {
        const promptsPath = path.join(process.cwd(), 'prompts.json');
        const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
        if (promptsData.prompts && promptsData.prompts.frontend_architect && promptsData.prompts.frontend_architect.content) {
          systemPrompt = promptsData.prompts.frontend_architect.content;
        }
      }
      // 添加系统提示词
      if (systemPrompt) {
        messages.push({
          role: "system",
          content: systemPrompt
        });
      }
      // 添加用户消息
      messages.push({
        role: "user",
        content: args.message
      });
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: args.model,
          messages: messages,
          temperature: args.temperature,
          max_tokens: args.max_tokens,
        },
        {
          headers: {
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const aiResponse = response.data.choices[0].message.content;
      return `DeepSeek AI 回复: ${aiResponse}`;
    } catch (error) {
      console.error("DeepSeek API 调用失败:", error.response?.data || error.message);
      return `错误: ${error.response?.data?.error?.message || error.message}`;
    }
  },
});

// 获取提示词模板工具
mcpServer.addTool({
  name: "get_prompts",
  description: "获取可用的提示词模板列表",
  parameters: z.object({
    template: z.string().optional().describe("特定模板名称，如果不提供则返回所有模板"),
  }),
  execute: async (args) => {
    try {
      const promptsPath = path.join(process.cwd(), 'prompts.json');
      const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
      
      if (args.template) {
        if (promptsData.prompts[args.template]) {
          return JSON.stringify({
            template: args.template,
            ...promptsData.prompts[args.template]
          }, null, 2);
        } else {
          return `错误: 未找到模板 "${args.template}"`;
        }
      } else {
        const templates = Object.keys(promptsData.prompts).map(key => ({
          key: key,
          name: promptsData.prompts[key].name,
          description: promptsData.prompts[key].description
        }));
        return `可用的提示词模板:\n${JSON.stringify(templates, null, 2)}`;
      }
    } catch (error) {
      console.error("读取提示词模板失败:", error.message);
      return `错误: ${error.message}`;
    }
  },
});

// 代码片段提问工具
mcpServer.addTool({
  name: "code_selection_ask",
  description: "基于选中代码片段和问题进行AI智能问答",
  parameters: z.object({
    code: z.string().describe("选中的代码片段"),
    question: z.string().describe("用户的问题"),
    system_prompt: z.string().optional(),
    model: z.string().optional().default("deepseek-chat"),
    temperature: z.number().optional().default(0.7),
    max_tokens: z.number().optional().default(1000),
  }),
  execute: async (args) => {
    // 拼接带代码上下文的提问
    const message = `请基于以下代码片段回答问题：\n\n${args.code}\n\n问题：${args.question}`;
    // 复用 deepseek_chat 的 system_prompt 逻辑
    let systemPrompt = args.system_prompt;
    if (!systemPrompt) {
      const promptsPath = path.join(process.cwd(), 'prompts.json');
      const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
      if (promptsData.prompts && promptsData.prompts.frontend_architect && promptsData.prompts.frontend_architect.content) {
        systemPrompt = promptsData.prompts.frontend_architect.content;
      }
    }
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: message });
    try {
      const response = await axios.post(
        DEEPSEEK_API_URL,
        {
          model: args.model,
          messages: messages,
          temperature: args.temperature,
          max_tokens: args.max_tokens,
        },
        {
          headers: {
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const aiResponse = response.data.choices[0].message.content;
      return `DeepSeek AI 回复: ${aiResponse}`;
    } catch (error) {
      console.error("DeepSeek API 调用失败:", error.response?.data || error.message);
      return `错误: ${error.response?.data?.error?.message || error.message}`;
    }
  },
});

// 启动 FastMCP 服务器
console.log('🚀 启动 MCP 服务器...');

mcpServer.start({
  transportType: "httpStream",
  httpStream: {
    port: 4001,
  },
});

console.log('✅ MCP 服务器已启动在端口 4001');
console.log('📡 端点: http://localhost:4001/mcp');
console.log('🤖 DeepSeek AI 工具已集成，请设置 DEEPSEEK_API_KEY 环境变量');