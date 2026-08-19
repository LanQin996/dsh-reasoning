# DSH Reasoning Effort

Adds a configuration card for model reasoning capabilities in DSH. The plugin
does not add a second composer control. DSH's native model menu remains the
only place where users choose a reasoning level.

The model popup uses a side-opening layout: the Model and Reasoning rows stay
visible on the left while the selected list opens on the right.

Open `Settings > Plugins > Plugin configuration > Reasoning Effort`, then
select one or more models, then enable the levels supported by those models.
Changes are written to the
`llm-pi-ai.providers.<provider>.models[].reasoningEfforts` setting, so DSH can
validate the choice and send the configured wire value to the provider.

The card includes the standard levels (`Off`, `Minimal`, `Low`, `Medium`,
`High`, `Extra high`, `Max`) and a comma-separated field for custom levels.
Use `id` when the wire value is the same, or `id=wireValue` when it differs.
Models without any configured levels are not given a fake fallback menu.

## Local loading

Run this from a DSH installation:

```powershell
dsh web --patch C:/Users/xjf000/Desktop/dsh-reasoning/cordis.patch.yml
```
