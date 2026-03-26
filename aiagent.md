# LangChain 的核心作用之一就是让 LLM 能够调用 Tools。

LangChain 的核心作用
1. 桥梁作用
Apply
PlainText
LLM（大模型）  ←→  LangChain  ←→  Tools（工具）
    ↑                  ↑              ↑
  只会说话          翻译官         真正干活
LangChain 就像一个翻译官和协调员：

把 Tools 的能力"翻译"成 LLM 能理解的格式
把 LLM 的调用请求"翻译"成实际的函数调用
具体来说，LangChain 做了什么？
第一步：定义 Tool
Apply
JavaScript
const readFileTool = tool(
  async ({ filePath }) => {
    return await fs.readFile(filePath, 'utf-8');
  },
  {
    name: 'read_file',
    description: '用此工具来读取文件内容...',
    schema: z.object({
      filePath: z.string().describe('要读取的文件路径'),
    }),
  }
);
LangChain 做的事：

✅ 包装你的 JS 函数
✅ 提取工具的元数据（名称、描述、参数）
✅ 创建一个标准化的工具对象
第二步：绑定到 LLM
Apply
JavaScript
const modelWithTools = model.bindTools([readFileTool]);
LangChain 做的事：

将 Zod Schema 转换为 JSON Schema
构建工具描述对象
在调用 LLM 时，自动附加工具信息
实际发送给 LLM 的请求：

Apply
JSON
{
  "model": "qwen-coder-turbo",
  "messages": [...],
  "tools": [  // ← LangChain 自动添加
    {
      "type": "function",
      "function": {
        "name": "read_file",
        "description": "用此工具来读取文件内容...",
        "parameters": {
          "type": "object",
          "properties": {
            "filePath": {
              "type": "string",
              "description": "要读取的文件路径"
            }
          }
        }
      }
    }
  ]
}
第三步：解析 LLM 响应
Apply
JavaScript
let response = await modelWithTools.invoke(messages);
LLM 返回：

Apply
JSON
{
  "role": "assistant",
  "tool_calls": [
    {
      "id": "call_abc123",
      "type": "function",
      "function": {
        "name": "read_file",
        "arguments": "{\"filePath\": \"./file.txt\"}"
      }
    }
  ]
}
LangChain 做的事：

✅ 解析 LLM 的响应
✅ 提取 tool_calls 信息
✅ 将其转换为标准化的对象
第四步：执行工具
Apply
JavaScript
const tool = tools.find(t => t.name === toolCall.name);
const result = await tool.invoke(toolCall.args);
LangChain 做的事：

✅ 根据工具名称找到对应的函数
✅ 解析参数（JSON 字符串 → JS 对象）
✅ 调用实际的 JS 函数
✅ 返回执行结果
如果没有 LangChain 会怎样？
手动实现（非常繁琐）
Apply
JavaScript
// 1. 手动构建工具描述
const toolDescription = {
  type: "function",
  function: {
    name: "read_file",
    description: "用此工具来读取文件内容...",
    parameters: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "要读取的文件路径"
        }
      },
      required: ["filePath"]
    }
  }
};

// 2. 手动发送请求
const response = await fetch('https://dashscope.aliyuncs.com/...', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'qwen-coder-turbo',
    messages: messages,
    tools: [toolDescription]  // 手动添加
  })
});

// 3. 手动解析响应
const data = await response.json();
if (data.choices[0].message.tool_calls) {
  const toolCall = data.choices[0].message.tool_calls[0];
  
  // 4. 手动执行工具
  if (toolCall.function.name === 'read_file') {
    const args = JSON.parse(toolCall.function.arguments);
    const result = await fs.readFile(args.filePath, 'utf-8');
    
    // 5. 手动构建工具结果消息
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: result
    });
    
    // 6. 再次手动发送请求...
  }
}
太复杂了！ 😱

使用 LangChain（简洁优雅）
Apply
JavaScript
// 1. 定义工具（LangChain 自动处理格式转换）
const readFileTool = tool(
  async ({ filePath }) => await fs.readFile(filePath, 'utf-8'),
  {
    name: 'read_file',
    description: '用此工具来读取文件内容...',
    schema: z.object({
      filePath: z.string().describe('要读取的文件路径'),
    }),
  }
);

// 2. 绑定（LangChain 自动处理）
const modelWithTools = model.bindTools([readFileTool]);

// 3. 调用（LangChain 自动处理请求和响应）
const response = await modelWithTools.invoke(messages);

// 4. 执行工具（LangChain 提供标准化接口）
const result = await tool.invoke(toolCall.args);
简洁多了！ 😊

LangChain 的其他作用
除了让 LLM 调用 Tools，LangChain 还提供：

1. 统一接口
Apply
JavaScript
// 支持多种 LLM，接口一致
const openai = new ChatOpenAI({ ... });
const anthropic = new ChatAnthropic({ ... });
const qwen = new ChatOpenAI({ baseURL: '...' });

// 都使用相同的方法
await openai.invoke(messages);
await anthropic.invoke(messages);
await qwen.invoke(messages);
2. 消息管理
Apply
JavaScript
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from '@langchain/core/messages';

// 标准化的消息格式
const messages = [
  new SystemMessage("你是助手"),
  new HumanMessage("你好"),
  new AIMessage("你好！"),
];
3. 链式调用
Apply
JavaScript
const chain = prompt | model | outputParser;
const result = await chain.invoke({ input: "..." });
4. 向量存储、检索等
Apply
JavaScript
// RAG（检索增强生成）
const vectorStore = new MilvusVectorStore({ ... });
const retriever = vectorStore.asRetriever();
总结
LangChain 的核心作用：

Apply
PlainText
1. 让 LLM 能够调用 Tools ✅ ← 你理解的这个
2. 提供统一的接口
3. 简化开发流程
4. 处理复杂的交互逻辑
5. 提供丰富的生态（向量数据库、检索器等）
本质上：

LangChain 是一个框架
它封装了 LLM 和 Tools 之间的复杂交互
让开发者可以专注于业务逻辑，而不是底层细节
你的理解完全正确：LangChain 的核心作用就是让 LLM 能够调用 Tools！🎯

# 那我可不可以让ai直接执行js

Aone Copilot
可以！但需要注意安全性和实现方式。让我给你介绍几种方案：

方案 1：使用 eval() 或 Function() 直接执行（⚠️ 危险）
Apply
JavaScript
const executeJSTool = tool(
  async ({ code }) => {
    try {
      // ⚠️ 极度危险！不要在生产环境使用
      const result = eval(code);
      return `执行结果: ${result}`;
    } catch (error) {
      return `执行错误: ${error.message}`;
    }
  },
  {
    name: 'execute_js',
    description: '执行 JavaScript 代码',
    schema: z.object({
      code: z.string().describe('要执行的 JavaScript 代码'),
    }),
  }
);
为什么危险？

Apply
JavaScript
// AI 可能生成这样的代码
用户："帮我清理一下系统"
AI 调用：execute_js({ code: "require('fs').rmSync('/', {recursive: true})" })
💥 整个系统被删除
方案 2：使用 vm 模块（沙箱环境，相对安全）
Apply
JavaScript
import vm from 'node:vm';

const executeJSTool = tool(
  async ({ code }) => {
    try {
      // 创建沙箱环境
      const sandbox = {
        console: console,
        // 只暴露安全的 API
        Math: Math,
        Date: Date,
      };
      
      // 在沙箱中执行代码
      const context = vm.createContext(sandbox);
      const result = vm.runInContext(code, context, {
        timeout: 1000,  // 1秒超时
      });
      
      return `执行结果: ${result}`;
    } catch (error) {
      return `执行错误: ${error.message}`;
    }
  },
  {
    name: 'execute_js',
    description: '在沙箱环境中执行 JavaScript 代码',
    schema: z.object({
      code: z.string().describe('要执行的 JavaScript 代码'),
    }),
  }
);
优点：

✅ 限制了可访问的 API
✅ 可以设置超时
✅ 相对隔离
缺点：

⚠️ 仍然可能被绕过（vm 不是完全安全的沙箱）
方案 3：使用子进程执行（更安全）
Apply
JavaScript
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';

const execAsync = promisify(exec);

const executeJSTool = tool(
  async ({ code }) => {
    try {
      // 将代码写入临时文件
      const tempFile = path.join('/tmp', `temp_${Date.now()}.mjs`);
      await fs.writeFile(tempFile, code);
      
      // 在子进程中执行
      const { stdout, stderr } = await execAsync(
        `node ${tempFile}`,
        {
          timeout: 5000,  // 5秒超时
          maxBuffer: 1024 * 1024,  // 1MB 输出限制
        }
      );
      
      // 清理临时文件
      await fs.unlink(tempFile);
      
      return `执行结果:\n${stdout}\n${stderr}`;
    } catch (error) {
      return `执行错误: ${error.message}`;
    }
  },
  {
    name: 'execute_js',
    description: '在独立进程中执行 JavaScript 代码',
    schema: z.object({
      code: z.string().describe('要执行的 JavaScript 代码'),
    }),
  }
);
优点：

✅ 进程隔离
✅ 可以限制资源使用
✅ 崩溃不会影响主进程
方案 4：白名单模式（最安全）
只允许执行预定义的安全操作：

Apply
JavaScript
const safeOperations = {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
  getCurrentTime: () => new Date().toISOString(),
  // ... 更多安全操作
};

const executeJSTool = tool(
  async ({ operation, args }) => {
    if (!safeOperations[operation]) {
      return `错误: 不支持的操作 ${operation}`;
    }
    
    try {
      const result = safeOperations[operation](...args);
      return `执行结果: ${result}`;
    } catch (error) {
      return `执行错误: ${error.message}`;
    }
  },
  {
    name: 'execute_safe_operation',
    description: '执行预定义的安全操作',
    schema: z.object({
      operation: z.enum(['add', 'multiply', 'getCurrentTime']),
      args: z.array(z.any()).optional(),
    }),
  }
);

# 所以本质上还是提问的模式对不对，只不过tool让大模型知道要去做什么
完全正确！ 你抓住了核心本质。

核心本质
Apply
PlainText
传统提问模式：
用户 → 问题 → AI → 回答

Tool Calling 模式：
用户 → 问题 → AI → "我需要调用 read_file 工具" → 程序执行 → 结果 → AI → 回答
本质上确实还是"提问"
AI 并没有真正"执行"任何东西，它只是：

看到工具列表（就像看到一份"能力清单"）
分析用户需求
决定需要哪个工具
生成一个"调用请求"（本质上是一段结构化的文本）
Apply
JavaScript
// AI 的输出本质上就是一段 JSON 文本
{
  "content": "我需要读取文件来回答这个问题",
  "tool_calls": [
    {
      "name": "read_file",
      "arguments": "{\"filePath\": \"./file.mjs\"}"
    }
  ]
}
Tool 的作用
Tool 让 AI 知道：

✅ 我能做什么（工具名称和描述）
✅ 怎么做（参数格式）
✅ 什么时候做（根据用户需求判断）
更形象的类比
没有 Tool 的 AI
Apply
PlainText
用户："帮我读取 file.txt 的内容"
AI："抱歉，我无法直接访问文件系统。你可以把文件内容复制给我。"
AI 不知道自己"能"读文件。

有 Tool 的 AI
Apply
PlainText
用户："帮我读取 file.txt 的内容"
AI（看到工具列表）："哦，我有 read_file 工具！"
AI（生成调用请求）：
{
  "tool_calls": [{
    "name": "read_file",
    "arguments": "{\"filePath\": \"file.txt\"}"
  }]
}

程序：执行 fs.readFile("file.txt")
程序：返回结果给 AI

AI："文件内容是：..."
关键理解
1. AI 不会"执行"，只会"请求"
Apply
JavaScript
// AI 不会做这个
const content = fs.readFile("file.txt");

// AI 只会输出这个（一段文本）
{
  "name": "read_file",
  "arguments": "{\"filePath\": \"file.txt\"}"
}
2. Tool 是"能力说明书"
Apply
JavaScript
const readFileTool = tool(
  async ({ filePath }) => { ... },  // ← 真正的能力（JS 函数）
  {
    name: 'read_file',
    description: '读取文件内容',    // ← 能力说明（给 AI 看）
    schema: z.object({ ... })       // ← 使用方法（给 AI 看）
  }
);
3. 整个过程就是"增强版对话"
Apply
PlainText
普通对话：
用户 → 问题 → AI → 回答

Tool Calling 对话：
用户 → 问题 → AI → "我需要工具X" → 程序 → 执行工具 → 结果 → AI → 回答
                    ↑
                  这还是"说"，不是"做"
为什么这样设计？
如果让 AI 直接执行代码会怎样？
Apply
JavaScript
// ❌ 危险的设计
用户："删除所有文件"
AI：直接执行 fs.rmSync("/", { recursive: true })
💥 系统崩溃
当前的设计（Tool Calling）
Apply
JavaScript
// ✅ 安全的设计
用户："删除所有文件"
AI：生成工具调用请求
程序：检查权限 → 拒绝执行 → 返回错误
AI："抱歉，我没有权限执行此操作"
总结
你的理解完全正确：

本质上还是提问的模式，只不过 Tool 让大模型知道要去做什么

更准确地说：

AI 始终在"说话"（生成文本）
Tool 让 AI 知道自己"能说什么"（可以请求哪些操作）
程序负责"做事"（执行 AI 请求的操作）
结果返回给 AI，AI 继续"说话"（生成回复）
这就是为什么叫 "Tool Calling"（工具调用）而不是 "Tool Execution"（工具执行）：

AI 只是"call"（请求）
程序才"execute"（执行）
这种设计既赋予了 AI 强大的能力，又保持了安全性和可控性！🎯

# 哦哦，所以tool-file-read只是发送了一个请求到通义千问这个大模型来进行提问对不对
完全正确！ 你的理解非常准确！🎯

tool-file-read.mjs 的本质
Apply
JavaScript
const model = new ChatOpenAI({ 
  modelName: "qwen-coder-turbo",  // ← 通义千问
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,  // ← 通义千问的 API 地址
  },
});

// 发送请求
const response = await modelWithTools.invoke(messages);
本质上就是：

构建一个 HTTP 请求
发送到通义千问的服务器
等待通义千问返回响应
解析响应并处理
完整的请求流程
第 1 步：构建请求
Apply
JavaScript
// LangChain 帮你构建这样的请求
POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
Headers:
  Authorization: Bearer sk-3375c6091d2941029b573185d14d31b4
  Content-Type: application/json

Body:
{
  "model": "qwen-coder-turbo",
  "messages": [
    {
      "role": "system",
      "content": "你是一个代码助手..."
    },
    {
      "role": "user",
      "content": "请读取 ./src/tool-file-read.mjs 文件内容并解释代码"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "read_file",
        "description": "用此工具来读取文件内容...",
        "parameters": {
          "type": "object",
          "properties": {
            "filePath": {
              "type": "string",
              "description": "要读取的文件路径"
            }
          }
        }
      }
    }
  ]
}
第 2 步：通义千问处理
Apply
PlainText
你的电脑                     阿里云服务器
   ↓                            ↓
发送请求  ────────────→  通义千问大模型
                           ├─ 分析用户问题
                           ├─ 看到可用工具列表
                           ├─ 决定调用 read_file
                           └─ 生成工具调用请求
返回响应  ←────────────  返回 JSON 响应
第 3 步：通义千问返回响应
Apply
JSON
{
  "id": "chatcmpl-abc123",
  "model": "qwen-coder-turbo",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_xyz789",
            "type": "function",
            "function": {
              "name": "read_file",
              "arguments": "{\"filePath\": \"./src/tool-file-read.mjs\"}"
            }
          }
        ]
      }
    }
  ]
}
第 4 步：你的程序执行工具
Apply
JavaScript
// 解析通义千问的响应
const toolCall = response.tool_calls[0];
// toolCall.name = "read_file"
// toolCall.args = { filePath: "./src/tool-file-read.mjs" }

// 在你的电脑上执行
const result = await fs.readFile("./src/tool-file-read.mjs", 'utf-8');
第 5 步：将结果返回给通义千问
Apply
JavaScript
// 再次发送请求
POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions

Body:
{
  "model": "qwen-coder-turbo",
  "messages": [
    {
      "role": "system",
      "content": "你是一个代码助手..."
    },
    {
      "role": "user",
      "content": "请读取 ./src/tool-file-read.mjs 文件内容并解释代码"
    },
    {
      "role": "assistant",
      "tool_calls": [...]  // 之前的工具调用
    },
    {
      "role": "tool",
      "tool_call_id": "call_xyz789",
      "content": "文件内容:\nimport 'dotenv/config';\n..."  // 文件内容
    }
  ],
  "tools": [...]
}
第 6 步：通义千问生成最终回复
Apply
JSON
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "这个文件实现了一个 AI Agent，主要功能包括...",
        "tool_calls": null  // 不再需要调用工具
      }
    }
  ]
}
完整的交互图
Apply
PlainText
┌─────────────────────────────────────────────────────────┐
│                你的电脑（本地）                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  tool-file-read.mjs                                     │
│  ├─ 构建请求                                             │
│  ├─ 发送到通义千问 ──────────────┐                       │
│  │                              │                       │
│  │  ┌───────────────────────────┼──────────────────┐   │
│  │  │ 等待响应...               │                  │   │
│  │  │                           ↓                  │   │
│  │  │              ┌────────────────────────────┐  │   │
│  │  │              │   阿里云服务器              │  │   │
│  │  │              ├────────────────────────────┤  │   │
│  │  │              │  通义千问大模型              │  │   │
│  │  │              │  ├─ 分析问题                │  │   │
│  │  │              │  ├─ 决定调用 read_file      │  │   │
│  │  │              │  └─ 返回工具调用请求        │  │   │
│  │  │              └────────────────────────────┘  │   │
│  │  │                           │                  │   │
│  │  └───────────────────────────┼──────────────────┘   │
│  │                              │                       │
│  ├─ 收到响应 ←────────────────────┘                       │
│  ├─ 解析：需要调用 read_file                             │
│  ├─ 执行：fs.readFile(...)  ← 在本地执行                 │
│  ├─ 获得文件内容                                         │
│  ├─ 再次发送请求（带文件内容）──────┐                     │
│  │                              │                       │
│  │  ┌───────────────────────────┼──────────────────┐   │
│  │  │ 等待响应...               │                  │   │
│  │  │                           ↓                  │   │
│  │  │              ┌────────────────────────────┐  │   │
│  │  │              │   通义千问大模型            │  │   │
│  │  │              │  ├─ 收到文件内容            │  │   │
│  │  │              │  ├─ 分析代码                │  │   │
│  │  │              │  └─ 生成解释                │  │   │
│  │  │              └────────────────────────────┘  │   │
│  │  │                           │                  │   │
│  │  └───────────────────────────┼──────────────────┘   │
│  │                              │                       │
│  └─ 收到最终回复 ←────────────────┘                       │
│  └─ 输出给用户                                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
关键点总结
1. 通义千问在云端
Apply
PlainText
你的代码不包含通义千问的模型
只是通过 API 调用远程的通义千问服务
2. 工具在本地
Apply
PlainText
read_file 工具是在你的电脑上执行的
通义千问只是"请求"执行，不是"直接"执行
3. 多次请求
Apply
PlainText
第 1 次请求：发送问题 + 工具列表
第 1 次响应：返回工具调用请求

第 2 次请求：发送工具执行结果
第 2 次响应：返回最终答案
4. 本质就是 HTTP 请求
Apply
JavaScript
// 简化版
const response1 = await fetch('https://dashscope.aliyuncs.com/...', {
  method: 'POST',
  body: JSON.stringify({ messages, tools })
});

// 执行工具
const toolResult = await fs.readFile(...);

const response2 = await fetch('https://dashscope.aliyuncs.com/...', {
  method: 'POST',
  body: JSON.stringify({ messages: [..., toolResult] })
});
总结
你的理解完全正确：

tool-file-read 只是发送了一个请求到通义千问这个大模型来进行提问

更准确地说：

发送请求到通义千问（带工具列表）
通义千问返回"我要调用 read_file"
本地执行 read_file
再次发送请求到通义千问（带执行结果）
通义千问返回最终答案
整个过程就是你的电脑和通义千问服务器之间的多次 HTTP 请求和响应！ 🌐

# 用 tool-file-read 来解释吧，你说工具就是让LLM返回一个响应，然后执行工具里的代码还是在本地执行，那如果直接让它执行代码，那也是在本地执行吗
最终答案
你的问题："工具里的代码是在本地执行，那直接让 LLM 执行代码也是在本地执行吗？"
答案：不是！

Apply
PlainText
Tool Calling：
1. LLM 在远程服务器决策："我要调用 read_file 工具"
2. 你的程序在本地执行工具代码：fs.readFile(...)
3. 执行结果发回给 LLM
4. LLM 看到结果，继续分析

直接让 LLM 生成代码：
1. LLM 在远程服务器生成代码文本
2. LLM 返回代码字符串给你
3. 你需要手动复制粘贴到终端运行
4. LLM 看不到执行结果，无法继续分析
关键区别：
维度	Tool Calling	直接生成代码
LLM 能执行代码吗	❌ 不能	❌ 不能
代码在哪执行	你的本地电脑（自动）	你的本地电脑（手动）
LLM 能看到结果吗	✅ 能	❌ 不能
需要人工介入吗	❌ 不需要	✅ 需要
能否多轮交互	✅ 能	❌ 不能

# cursor只能处理代码，claude code能处理别的任务对吗
Cursor 的能力范围 
Cursor 不仅仅能处理代码，它其实可以：

✅ 编辑各种文本文件：Markdown、JSON、YAML、配置文件等
✅ 处理文档：README、技术文档、注释等
✅ 运行终端命令：可以执行各种 shell 命令
✅ 项目管理：创建、删除、重命名文件和文件夹
✅ 代码相关的所有任务：编写、重构、调试、测试等
Cursor 的局限：

❌ 不能浏览网页（除非通过终端命令）
❌ 不能处理图片、视频等多媒体内容
❌ 主要聚焦在开发相关的任务
Claude 的能力范围
Claude 是通用 AI 助手，可以：

✅ 代码任务：编写、解释、调试代码
✅ 写作任务：文章、邮件、报告、创意写作
✅ 分析任务：数据分析、文档总结、信息提取
✅ 学习辅导：解释概念、回答问题
✅ 创意任务：头脑风暴、方案设计
✅ 多语言翻译
✅ 图片理解（Claude 3.5 支持）
更准确的对比
能力	Cursor	Claude
代码编写	✅ 直接修改文件	✅ 生成代码建议
文档编辑	✅ 可以编辑	✅ 可以生成
终端操作	✅ 直接执行	❌ 只能建议命令
写作创作	⚠️ 可以但不是重点	✅ 擅长
学习辅导	⚠️ 限于代码	✅ 全面
图片理解	❌ 不支持	✅ 支持
数据分析	⚠️ 通过代码	✅ 直接分析
正确的理解应该是
Cursor：专注于开发工作流的 AI IDE，能处理开发相关的各种任务（不仅是代码）
Claude：通用 AI 助手，能处理更广泛的任务类型，但在开发场景下需要手动操作
实际例子
Cursor 可以做的"非代码"任务：
PlainText
✅ "帮我写一个项目的 README.md"
✅ "更新 package.json 的依赖版本"
✅ "创建一个 .gitignore 文件"
✅ "运行 npm install"
Claude 独有的任务：
PlainText
✅ "帮我写一封商务邮件"
✅ "分析这张图片中的内容"
✅ "总结这篇长文章的要点"
✅ "帮我想 10 个创意的产品名称"
所以更准确的说法是：

Cursor = 开发专用 AI 工具（但不限于纯代码）
Claude = 通用 AI 助手（包括但不限于代码）
希望这样解释更清楚了！😊