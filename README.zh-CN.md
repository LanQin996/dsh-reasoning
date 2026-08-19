# dsh-reasoning

[![DSH Plugin](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4f7cff)](https://github.com/topics/dsh-plugin)
[![GitHub repository](https://img.shields.io/badge/source-GitHub-181717?logo=github)](https://github.com/LanQin996/dsh-reasoning)
[![License: LGPL-3.0-only](https://img.shields.io/badge/license-LGPL--3.0--only-blue.svg)](LICENSE)

[English](README.md) | [简体中文](README.zh-CN.md)

面向 DeepSeek Harness Web 的社区插件，用于配置模型能力。它提供设置卡片，
可为一个或多个模型配置输入类型和推理等级，同时保留 DSH 对话编辑器原生的
模型选择入口。模型弹窗采用左右并排布局，浏览选项时仍能看到 Model 和
Reasoning 两行。

这是独立的社区插件，不是 DeepSeek 官方产品，也不代表 DeepSeek 的认可或背书。

## 功能

- **按模型配置**：为每个 provider 暴露的模型独立配置输入类型和推理等级。
- **图片输入支持**：为支持图片附件的模型设置模型级 `input` 字段（`text` 和
  `image`）。
- **批量编辑**：一次选择多个模型，批量应用 `Off`、`Minimal`、`Low`、
  `Medium`、`High`、`Extra high`、`Max` 等标准等级。
- **自定义 wire value**：使用 `id` 表示标识符和 wire value 相同，使用
  `id=wireValue` 表示两者不同。
- **原生编辑器集成**：使用 DSH 的模型目录和选择 API，不额外添加第二个模型控件。
- **侧开模型菜单**：模型和推理等级列表并排展开，不丢失当前选择上下文。
- **按 provider 持久化**：写入
  `llm-pi-ai.providers.<provider>.models[].reasoningEfforts` 和
  `llm-pi-ai.providers.<provider>.models[].input`，供 DSH 和 provider 集成校验并
  发送配置值。
- **不伪造默认值**：没有配置等级的模型不会显示虚假的推理菜单。

## 安装

从 npm 安装已预编译的包到 DSH Web profile：

```bash
dsh plugin --profile web add dsh-plugin-reasoning-effort
```

npm 包已经包含由 TypeScript 源码生成的 JavaScript 运行文件，因此 pnpm 安装时
不需要执行依赖构建脚本。

安装后重启 DSH Web profile，使 Host 和 Client 插件图重新构建。

开发本地 checkout 时，可以使用：

```bash
git clone https://github.com/LanQin996/dsh-reasoning.git
cd dsh-reasoning
npm install
npm run build
dsh plugin --profile web add file:.
```

卸载命令：

```bash
dsh plugin --profile web remove dsh-plugin-reasoning-effort
```

## 使用

重启 DSH Web 后，打开对话编辑器中的模型选择器。弹窗左侧保留当前的
**Model** 和 **Reasoning** 行，右侧显示对应列表。只有选中的模型配置了推理等级，
才会显示 Reasoning 行。

## 设置

打开：

```text
设置 -> 插件 -> 插件配置 -> Reasoning Effort
```

展开卡片，选择一个或多个模型，然后配置模型能力：

- **输入能力**：为所选模型切换 `文本` 和 `图片`。只有 `input` 包含 `image` 的模型
  才会接收图片附件。
- **标准等级**：切换所选模型支持的推理等级。
- **自定义等级**：输入逗号分隔的值，例如 `balanced, thorough=high_reasoning`。
- **应用**：将输入能力和推理等级草稿保存到全部已选模型。

卡片读取现有的 `llm-pi-ai` provider 设置，并写入模型级 `input` 与
`reasoningEfforts`。未设置 `input` 时，会继续使用 provider 或已安装模型目录的能力，
直到你显式配置它。

## 本地 patch 加载

如果需要让 DSH 安装直接加载当前 checkout，可使用仓库内的
`cordis.patch.yml`：

```powershell
dsh web --patch C:/path/to/dsh-reasoning/cordis.patch.yml
```

该 patch 会以 `dsh-reasoning-effort` id 插入插件。

## 开发

Host 入口和浏览器端 Client 分别位于 TypeScript 文件 `src/index.ts` 与 `src/client.ts`。
项目使用 TypeScript 编译到运行时所需的 `dist/` 文件：

```bash
npm install
npm run typecheck
npm run build
```

执行 `npm pack` 或 `npm publish` 时，`prepack` 会先进行类型检查并把 TypeScript
源码编译到 `dist/`。安装已发布的 npm 包不会执行这个构建钩子，因此兼容 pnpm v10，
也不需要配置 `allowBuilds`。

Client 依赖 `package.json` 中声明的 DSH Web runtime 和 peer packages。进行本地测试时，
请在提供这些依赖的 DSH 安装中使用上面的 patch 命令加载。

## 范围与隐私

插件不添加遥测客户端、凭据流程或后台网络服务。它读取当前 DSH 模型目录和
`llm-pi-ai` 设置，并只通过 DSH settings store 持久化配置的 `input` 与
`reasoningEfforts` 值。

## 许可证

Copyright (C) 2026 LanQin。

本项目使用 [GNU Lesser General Public License v3.0](LICENSE)（`LGPL-3.0-only`）授权。
