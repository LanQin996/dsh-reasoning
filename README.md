# dsh-reasoning

[![DSH Plugin](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4f7cff)](https://github.com/topics/dsh-plugin)
[![GitHub repository](https://img.shields.io/badge/source-GitHub-181717?logo=github)](https://github.com/LanQin996/dsh-reasoning)
[![License: GPL-3.0-only](https://img.shields.io/badge/license-GPL--3.0--only-blue.svg)](LICENSE)

[English](README.md) | [简体中文](README.zh-CN.md)

A community DeepSeek Harness Web plugin for configuring model capabilities.
It adds a settings card for assigning input modalities and reasoning levels to one or more models and
keeps model selection in the DSH conversation composer. The model popup opens
side-by-side, so the Model and Reasoning rows remain visible while their options
are being browsed.

This is an independent community plugin. It is not an official DeepSeek product
and does not imply DeepSeek endorsement.

## Highlights

- **Per-model configuration** — Configure input modalities and reasoning levels
  independently for every model exposed by each provider.
- **Image input support** — Mark models that accept image attachments through the
  model-level `input` field (`text` and `image`).
- **Bulk editing** — Select several models at once, then apply standard levels
  (`Off`, `Minimal`, `Low`, `Medium`, `High`, `Extra high`, `Max`) in one step.
- **Custom wire values** — Add provider-specific levels with `id` when the
  identifier is also the wire value, or `id=wireValue` when it differs.
- **Native composer integration** — The plugin uses DSH's model directory and
  selection APIs instead of adding a second composer control.
- **Side-opening model menu** — Browse models and reasoning levels without
  losing the current selection context.
- **Provider-aware persistence** — Changes are written to
  `llm-pi-ai.providers.<provider>.models[].reasoningEfforts` and
  `llm-pi-ai.providers.<provider>.models[].input`, allowing DSH and the provider
  integration to validate and send the configured values.
- **No fabricated defaults** — Models without configured levels show no fake
  reasoning menu.

## Install

Install the precompiled package from npm into the DSH Web profile:

```bash
dsh plugin --profile web add dsh-plugin-reasoning-effort
```

The npm package already contains the JavaScript runtime generated from the TypeScript
source, so pnpm does not need to run dependency build scripts during installation.

Restart the DSH Web profile after installation so the Host and Client plugin
graph is rebuilt.

To install a local checkout while developing:

```bash
git clone https://github.com/LanQin996/dsh-reasoning.git
cd dsh-reasoning
npm install
npm run build
dsh plugin --profile web add file:.
```

To remove the plugin:

```bash
dsh plugin --profile web remove dsh-plugin-reasoning-effort
```

## Use

After restarting DSH Web, open the model selector in the conversation composer.
The popup keeps the current **Model** and **Reasoning** rows on the left; choose
the corresponding list on the right. The Reasoning row is shown only when the
selected model has configured levels.

## Settings

Open:

```text
Settings -> Plugins -> Plugin configuration -> Reasoning Effort
```

Expand the card and select one or more models:

- **Input capabilities** — Toggle `Text` and `Image` for the selected models. Image
  attachments are only sent to models whose `input` includes `image`.
- **Standard levels** — Toggle the reasoning levels supported by the selected models.
- **Custom levels** — Enter comma-separated values such as
  `balanced, thorough=high_reasoning`.
- **Apply** — Save both capability and reasoning drafts for all selected models.

The card reads the existing `llm-pi-ai` provider settings and writes model-level
`input` and `reasoningEfforts` fields. An unset `input` keeps the provider or
installed catalog behavior until you explicitly configure it.

## Local patch loading

For a checkout that should be loaded directly by a DSH installation, use the
included `cordis.patch.yml`:

```powershell
dsh web --patch C:/path/to/dsh-reasoning/cordis.patch.yml
```

The patch inserts the plugin with the id `dsh-reasoning-effort`.

## Development

The repository contains the TypeScript Host entrypoint and browser-side client in
`src/index.ts` and `src/client.ts`. TypeScript is compiled into the runtime files in
`dist/` before the plugin is loaded:

```bash
npm install
npm run typecheck
npm run build
```

`npm pack` and `npm publish` run the `prepack` hook, which type-checks and compiles
the TypeScript source into `dist/`. Installing the published package does not execute
that build hook and is compatible with pnpm v10 without an `allowBuilds` entry.

The client expects the DSH Web runtime and peer packages declared in
`package.json`. When testing locally, load it through the patch command above
inside a DSH installation that provides those packages.

## Scope and privacy

The plugin does not add a telemetry client, credential flow, or background
network service. It reads the active DSH model directory and `llm-pi-ai` settings,
then persists only the configured `input` and `reasoningEfforts` values through the
DSH settings store.

## License

Copyright (C) 2026 LanQin.

This project is licensed under the [GNU General Public License v3.0](LICENSE)
(`GPL-3.0-only`).
