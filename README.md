# dsh-reasoning

[![DSH Plugin](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4f7cff)](https://github.com/topics/dsh-plugin)
[![GitHub repository](https://img.shields.io/badge/source-GitHub-181717?logo=github)](https://github.com/LanQin996/dsh-reasoning)

[English](README.md) | [简体中文](README.zh-CN.md)

A community DeepSeek Harness Web plugin for configuring model reasoning effort.
It adds a settings card for assigning reasoning levels to one or more models and
keeps model selection in the DSH conversation composer. The model popup opens
side-by-side, so the Model and Reasoning rows remain visible while their options
are being browsed.

This is an independent community plugin. It is not an official DeepSeek product
and does not imply DeepSeek endorsement.

## Highlights

- **Per-model configuration** — Configure reasoning levels independently for
  every model exposed by each provider.
- **Bulk editing** — Select several models at once, then apply standard levels
  (`Off`, `Minimal`, `Low`, `Medium`, `High`, `Extra high`, `Max`) in one step.
- **Custom wire values** — Add provider-specific levels with `id` when the
  identifier is also the wire value, or `id=wireValue` when it differs.
- **Native composer integration** — The plugin uses DSH's model directory and
  selection APIs instead of adding a second composer control.
- **Side-opening model menu** — Browse models and reasoning levels without
  losing the current selection context.
- **Provider-aware persistence** — Changes are written to
  `llm-pi-ai.providers.<provider>.models[].reasoningEfforts`, allowing DSH and
  the provider integration to validate and send the configured value.
- **No fabricated defaults** — Models without configured levels show no fake
  reasoning menu.

## Install

Install the GitHub source package into the DSH Web profile:

```bash
dsh plugin --profile web add github:LanQin996/dsh-reasoning#main
```

Restart the DSH Web profile after installation so the Host and Client plugin
graph is rebuilt.

To install a local checkout while developing:

```bash
git clone https://github.com/LanQin996/dsh-reasoning.git
dsh plugin --profile web add file:./dsh-reasoning
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

Expand the card, select one or more models, and configure the levels to expose:

- **Standard levels** — Toggle the levels supported by the selected models.
- **Custom levels** — Enter comma-separated values such as
  `balanced, thorough=high_reasoning`.
- **Apply** — Save the draft levels for all selected models.

The card reads the existing `llm-pi-ai` provider settings. It does not create a
fallback menu for a model whose `reasoningEfforts` object is empty or missing.

## Local patch loading

For a checkout that should be loaded directly by a DSH installation, use the
included `cordis.patch.yml`:

```powershell
dsh web --patch C:/path/to/dsh-reasoning/cordis.patch.yml
```

The patch inserts the plugin with the id `dsh-reasoning-effort`.

## Development

The repository contains the Host entrypoint and the browser-side client in
`src/index.js` and `src/client.js`. The package currently has no build or test
script; changes can be checked with Node's syntax validator:

```bash
node --check src/index.js
node --check src/client.js
```

The client expects the DSH Web runtime and peer packages declared in
`package.json`. When testing locally, load it through the patch command above
inside a DSH installation that provides those packages.

## Scope and privacy

The plugin does not add a telemetry client, credential flow, or background
network service. It reads the active DSH model directory and `llm-pi-ai` settings,
then persists only the configured `reasoningEfforts` values through the DSH
settings store.

## License

No license has been declared for this repository. Until a license is added, the
source should be treated as available for inspection but not automatically
granted for redistribution or modification.
