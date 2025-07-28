# MCP + DeepSeek AI 集成服务器

本项目是一个基于 Node.js 的 FastMCP 协议服务器，集成 DeepSeek AI 智能对话与代码分析能力。

---

## 功能概览
- 🛠️ **MCP 协议服务**：通过 FastMCP 提供工具调用能力
- 🤖 **DeepSeek AI 工具**：支持智能对话、代码诊断与重构建议

---

## 快速开始

### 1. 获取 DeepSeek API 密钥
1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册或登录账户，创建 API 密钥
3. 复制 API 密钥

### 2. 配置环境变量
- Windows PowerShell:
  ```powershell
  $env:DEEPSEEK_API_KEY="your-api-key-here"
  ```
- Windows CMD:
  ```cmd
  set DEEPSEEK_API_KEY=your-api-key-here
  ```
- Linux/Mac:
  ```bash
  export DEEPSEEK_API_KEY="your-api-key-here"
  ```

### 3. 安装依赖
```bash
npm install
```

### 4. 启动服务器
```bash
npm start
```

---

## 服务端口
- **MCP 服务**: http://localhost:4001/mcp

---

## 内置 MCP 工具

### 1. `add`
- **描述**: 计算两个数字的和
- **参数**: `a` (数字), `b` (数字)
- **返回**: 结果字符串

### 2. `deepseek_chat`
- **描述**: 调用 DeepSeek AI 进行智能对话或代码分析
- **参数**：
  - `message` (必需): 用户输入内容
  - `system_prompt` (可选): 系统提示词，定义AI角色
  - `model` (可选): 模型名称，默认 deepseek-chat
  - `temperature` (可选): 随机性，默认 0.7
  - `max_tokens` (可选): 最大生成token数，默认 1000
- **返回**: AI 回复内容

### 3. `get_prompts`
- **描述**: 获取可用的AI提示词模板
- **参数**: `template` (可选): 模板名称
- **返回**: 模板详情或全部列表

---

## AI 提示词模板

### `frontend_architect`
- **名称**: 前端架构师
- **描述**: 专业的前端代码质量优化和Vue项目重构专家
- **内容摘要**:
  - 深度扫描JavaScript和Vue代码，识别性能缺陷、可维护性问题、Vue反模式、JS坏味道
  - 自动检测Vue版本并提供版本兼容的重构方案
  - 生成完整可运行的重构代码片段

---

## 故障排查
- 检查 DEEPSEEK_API_KEY 是否正确设置
- 检查网络连接
- 查看控制台日志获取详细错误信息
- 端口冲突可修改 server.js 中端口号

---

## 技术栈
- Node.js
- FastMCP
- DeepSeek AI
- Zod
- Axios
- dotenv

---

## 许可证
ISC 