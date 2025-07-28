# DeepSeek AI 集成设置指南

## 1. 获取 DeepSeek API 密钥

1. 访问 [DeepSeek 平台](https://platform.deepseek.com/)
2. 注册或登录您的账户
3. 在控制台中创建新的API密钥
4. 复制您的API密钥

## 2. 设置环境变量

### Windows PowerShell:
```powershell
$env:DEEPSEEK_API_KEY="your-api-key-here"
```

### Windows CMD:
```cmd
set DEEPSEEK_API_KEY=your-api-key-here
```

### Linux/Mac:
```bash
export DEEPSEEK_API_KEY="your-api-key-here"
```

## 3. 安装依赖

```bash
npm install
```

## 4. 启动服务器

```bash
npm run start:basic
```

## 5. 使用 DeepSeek 工具

服务器启动后，您可以使用以下MCP工具：

### deepseek_chat
- **描述**: 使用DeepSeek AI进行对话
- **参数**:
  - `message` (必需): 用户输入的消息
  - `system_prompt` (可选): 系统提示词，定义AI的行为和角色，默认为通用助手提示词
  - `model` (可选): 使用的模型名称，默认为 "deepseek-chat"
  - `temperature` (可选): 生成文本的随机性，0-1之间，默认为 0.7
  - `max_tokens` (可选): 最大生成token数，默认为 1000

### get_prompts
- **描述**: 获取可用的提示词模板列表
- **参数**:
  - `template` (可选): 特定模板名称，如果不提供则返回所有模板

## 6. 示例用法

### 基本对话
通过MCP客户端调用：
```json
{
  "name": "deepseek_chat",
  "arguments": {
    "message": "你好，请介绍一下你自己",
    "temperature": 0.8,
    "max_tokens": 500
  }
}
```

### 使用前端架构师提示词
```json
{
  "name": "deepseek_chat",
  "arguments": {
    "message": "请分析以下Vue组件代码并提供优化建议：[您的代码]",
    "system_prompt": "你是一位资深前端架构师，专注于JavaScript和Vue项目的代码质量优化...",
    "temperature": 0.3,
    "max_tokens": 2000
  }
}
```

### 获取提示词模板
```json
{
  "name": "get_prompts",
  "arguments": {}
}
```

### 获取特定模板
```json
{
  "name": "get_prompts",
  "arguments": {
    "template": "coder"
  }
}
```

## 7. 故障排除

- 确保API密钥正确设置
- 检查网络连接
- 查看控制台错误信息
- 确保API密钥有足够的配额

## 8. 支持的模型

- deepseek-chat (默认)
- deepseek-coder
- 其他DeepSeek提供的模型

## 9. 提示词模板

系统提供了专业的前端架构师提示词模板：

- **frontend_architect**: 前端架构师 - 专业的前端代码质量优化和Vue项目重构专家

该模板专门用于：
- 深度扫描JavaScript和Vue代码
- 识别性能缺陷、可维护性问题、Vue反模式、JS坏味道
- 自动检测Vue版本并提供版本兼容的重构方案
- 生成完整可运行的重构代码片段

您可以使用 `get_prompts` 工具查看模板详情。 