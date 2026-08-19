interface DshModuleDefinition {
  id: string
  factory: (require: DshRequire) => unknown
}

interface DshWindow extends Window {
  __ModuleLoader__: {
    load(definition: DshModuleDefinition): void
  }
}

type DshRequire = (id: string) => any
type UnknownRecord = Record<string, any>
type ReasoningEfforts = Record<string, string>
type InputModality = 'text' | 'image'

interface ModelConfig extends UnknownRecord {
  id: string
  name?: string
  reasoningEfforts?: ReasoningEfforts | false
  input?: InputModality[]
}

interface ProviderConfig extends UnknownRecord {
  displayName?: string
  models?: ModelConfig[]
}

interface SettingsSnapshot {
  status?: string
  writable?: boolean
  error?: unknown
  value?: { providers?: Record<string, ProviderConfig> }
}

interface SettingsStore {
  getSnapshot(): SettingsSnapshot
  subscribe(listener: () => void): () => void
  load(): Promise<unknown>
  set(key: string, value: unknown): unknown
}

interface ModelSelection {
  provider: string
  model: string
  reasoningEffort?: string
}

interface ReasoningOption {
  id: string
  name?: string
  description?: string
}

interface ModelReasoning {
  efforts: ReasoningOption[]
  defaultEffort?: string
}

interface DirectoryModel {
  id: string
  name?: string
  reasoning?: ModelReasoning
}

interface DirectoryGroup {
  id: string
  name?: string
  models: DirectoryModel[]
}

interface ModelDirectorySnapshot {
  status: string
  current?: ModelSelection
  groups: DirectoryGroup[]
}

interface ModelDirectory {
  subscribe(listener: () => void): () => void
  getSnapshot(): ModelDirectorySnapshot
  load(): Promise<unknown>
  select(selection: ModelSelection): Promise<unknown>
  store: UnknownRecord
}

interface SideModelSelectProps {
  available: boolean
  directory: ModelDirectory
  load(): Promise<unknown>
  select(selection: ModelSelection): Promise<boolean>
  locked: boolean
}

interface ReasoningSettingsCardProps {
  settingsStore: SettingsStore
}

interface PluginContext {
  effect(cleanup: () => void): void
  settingsScope: { bind(options: { namespace: string }): SettingsStore }
  modelDirectories: { directoryFor(sessionId: string): ModelDirectory }
  sessions: { subagentAddress(sessionId: string): unknown }
  slots: {
    inject(name: string, factory: () => unknown): void
    register(options: UnknownRecord, component: unknown): unknown
  }
}

interface PluginExports {
  inject: string[]
  apply(ctx: PluginContext): void
}

interface ReactRuntime {
  createElement(...args: any[]): any
  Fragment: any
  useSyncExternalStore<T>(subscribe: (listener: () => void) => () => void, getSnapshot: () => T, getServerSnapshot: () => T): T
  useState(initialValue: any): [any, (value: any) => void]
  useRef<T>(initialValue: T): { current: T }
  useEffect(effect: () => void | (() => void | undefined), dependencies?: readonly unknown[]): void
  useLayoutEffect(effect: () => void | (() => void | undefined), dependencies?: readonly unknown[]): void
}

(window as unknown as DshWindow).__ModuleLoader__.load({
  id: 'dsh-plugin-reasoning-effort',
  factory: (require) => {
    const module: { exports: PluginExports } = { exports: {} as PluginExports }
    const React: ReactRuntime = require('react')

    const STYLE_ID = 'dsh-plugin-reasoning-effort-settings-style'
    if (document.getElementById(STYLE_ID) === null) {
      const style = document.createElement('style')
      style.id = STYLE_ID
      style.textContent = `
.dre-card{box-sizing:border-box;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);overflow:hidden}
.dre-header{appearance:none;width:100%;display:flex;align-items:center;gap:12px;border:0;background:transparent;color:inherit;padding:14px 16px;text-align:left;font:inherit;cursor:pointer}
.dre-header:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dre-headText{display:flex;flex:1;min-width:0;flex-direction:column;gap:3px}
.dre-title{font-size:15px;font-weight:600;line-height:22px}
.dre-subtitle{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.dre-chevron{display:inline-flex;align-items:center;justify-content:center;flex:none;width:14px;height:14px;color:var(--dsw-alias-label-tertiary)}
.dre-content{border-top:1px solid var(--dsw-alias-border-l2);padding:4px 16px 14px}
.dre-selectionBar{display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--dsw-alias-border-l2);font-size:12px}.dre-selectionCount{flex:1;color:var(--dsw-alias-label-secondary)}
.dre-smallButton,.dre-apply{height:28px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);padding:0 9px;font:inherit;font-size:12px;cursor:pointer}.dre-smallButton:hover:not(:disabled),.dre-apply:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dre-smallButton:disabled,.dre-apply:disabled{cursor:default;opacity:.45}
.dre-modelList{max-height:260px;overflow-y:auto}.dre-provider{padding-top:12px}.dre-providerName{margin:0 0 4px;font-size:13px;font-weight:600;line-height:20px}.dre-model{display:flex;align-items:center;gap:7px;min-height:30px;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-size:12px}.dre-model label{display:flex;align-items:center;gap:7px;min-width:0;cursor:pointer}.dre-model input{accent-color:var(--dsw-alias-brand-primary);margin:0}.dre-modelName{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dre-batch{margin-top:12px;padding-top:12px;border-top:1px solid var(--dsw-alias-border-l2)}.dre-batchTitle{margin-bottom:7px;font-size:13px;font-weight:600;line-height:20px}.dre-levels{display:flex;flex-wrap:wrap;gap:6px 12px}.dre-level{display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-label-primary);font-size:12px;line-height:20px;cursor:pointer}.dre-level input{accent-color:var(--dsw-alias-brand-primary);margin:0}
.dre-custom{box-sizing:border-box;width:100%;height:30px;margin-top:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:0 8px;font:inherit;font-size:12px;outline:0}.dre-custom:focus{border-color:var(--dsw-alias-brand-primary)}
.dre-apply{margin-top:10px;width:100%;color:var(--dsw-alias-label-primary)}
.dre-applyStatus{min-height:18px;margin-top:6px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;text-align:center}.dre-applyStatusSuccess{color:var(--dsw-alias-state-success-primary,#238636)}.dre-applyStatusError{color:var(--dsw-alias-state-error-primary)}
.dre-empty,.dre-error{padding:12px 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.dre-error{color:var(--dsw-alias-state-error-primary)}
.dre-native-model-hidden{display:none!important}
.dre-side-root{position:relative;min-width:0}
.dre-side-trigger{box-sizing:border-box;display:flex;align-items:center;gap:4px;width:164px;min-width:164px;max-width:164px;height:28px;border:0;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);padding:0 4px 0 8px;font:inherit;font-size:13px;font-weight:500;cursor:pointer}
.dre-side-trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dre-side-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}
.dre-side-model{min-width:0;flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dre-side-effort{flex:none;color:var(--dsw-alias-label-caption);white-space:nowrap}
.dre-side-menu{position:absolute;right:0;bottom:calc(100% + 8px);z-index:30;display:flex;width:min(360px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:min(390px,100vh - 96px);overflow:hidden;border:1px solid var(--dsw-alias-border-inverted);border-radius:12px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);padding:4px}
.dre-side-menuHasPane{width:min(736px,calc(100vw - 24px))}
.dre-side-rootPane,.dre-side-subPane{box-sizing:border-box;min-width:0;overflow-y:auto}
.dre-side-rootPane{width:auto;flex:1 1 auto}
.dre-side-subPane{width:auto;flex:1 1 0;border-left:1px solid var(--dsw-alias-border-l2);padding-left:4px}
.dre-side-menuHasPane .dre-side-rootPane{width:306px;min-width:306px;max-width:306px;flex:0 0 306px}
.dre-side-cell{display:flex;align-items:center;gap:8px;width:100%;height:40px;border:0;border-radius:9px;background:transparent;color:inherit;padding:0 10px;text-align:left;font:inherit;font-size:14px;cursor:pointer}
.dre-side-cell:hover,.dre-side-option:hover{background:var(--dsw-alias-interactive-bg-hover)}
.dre-side-cellLabel{flex:1;min-width:0}
.dre-side-cellValue{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}
.dre-side-chevron{display:inline-flex;align-items:center;justify-content:center;flex:none;width:16px;height:16px;color:var(--dsw-alias-label-tertiary);font-size:0;line-height:0}
.dre-side-chevron::before{box-sizing:border-box;width:7px;height:7px;border-top:1.5px solid currentColor;border-right:1.5px solid currentColor;content:'';transform:rotate(45deg)}
.dre-side-chevron[data-direction='down']::before{transform:rotate(135deg)}
.dre-side-chevron[data-direction='up']::before{transform:rotate(-45deg)}
.dre-side-groupTitle{padding:6px 10px 3px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dre-side-option{display:flex;align-items:center;gap:8px;width:100%;min-height:38px;border:0;border-radius:9px;background:transparent;color:inherit;padding:6px 8px;text-align:left;font:inherit;cursor:pointer}
.dre-side-optionCopy{display:flex;flex:1;min-width:0;flex-direction:column}
.dre-side-optionName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:20px}
.dre-side-optionDescription{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}
.dre-side-check{width:18px;flex:none;text-align:center}
.dre-side-empty{padding:10px;color:var(--dsw-alias-label-tertiary);font-size:13px}
/* Keep the two-pane selector stable against host flex/button rules. */
.dre-side-menu{box-sizing:border-box;flex-wrap:nowrap;align-items:stretch}
.dre-side-rootPane,.dre-side-subPane{box-sizing:border-box;display:block!important}
.dre-side-menuHasPane .dre-side-rootPane{display:block!important;flex:0 0 306px;min-width:306px;max-width:306px}
.dre-side-menu{z-index:1000}
.dre-side-menu{right:-56px}
.dre-side-menuHasPane .dre-side-rootPane{flex-basis:250px;min-width:250px;max-width:250px}
.dre-side-optionList{display:block;width:100%;min-width:0;max-width:100%}
.dre-side-menuHasPane .dre-side-subPane{width:0;min-width:0;max-width:none;flex:1 1 0}
.dre-side-menuHasPane .dre-side-subPane{flex-grow:1;flex-shrink:0;flex-basis:0!important}
.dre-side-menuHasPane .dre-side-subPane{width:calc(100% - 250px)!important;max-width:calc(100% - 250px);flex:0 0 calc(100% - 250px)!important}
.dre-side-menuHasPane .dre-side-subPane>.dre-side-option{width:100%;min-width:0;max-width:100%;flex:0 0 auto}
.dre-side-menuHasPane{display:grid;width:max-content;max-width:calc(100vw - 24px);grid-template-columns:250px minmax(240px,max-content)}
.dre-side-menuHasPane .dre-side-rootPane{width:250px!important;min-width:250px;max-width:250px}
.dre-side-menuHasPane .dre-side-subPane{width:auto!important;min-width:0;max-width:calc(100vw - 274px);flex:none!important}
.dre-side-menuHasPane .dre-side-optionList{width:auto;min-width:240px;max-width:100%}
.dre-side-menuHasPane .dre-side-option{width:100%;min-width:240px;max-width:100%}
.dre-side-menuHasPane{display:flex;align-items:flex-start;gap:8px;width:max-content;background:transparent;border:0;box-shadow:none;padding:0;overflow:visible}
.dre-side-menuHasPane .dre-side-rootPane,.dre-side-menuHasPane .dre-side-subPane{align-self:flex-start;border:1px solid var(--dsw-alias-border-inverted);border-radius:12px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3)}
.dre-side-menuHasPane .dre-side-rootPane{height:max-content;overflow:visible;padding:4px}
.dre-side-menuHasPane .dre-side-subPane{height:max-content;max-height:min(390px,100vh - 96px);overflow-y:auto;padding:4px}
.dre-side-menuHasPane{width:min(736px,calc(100vw - 24px))}
.dre-side-menu{width:max-content;max-width:calc(100vw - 24px);overflow:visible}
.dre-side-menu:not(.dre-side-menuHasPane){width:max-content}
.dre-side-menuHasPane{display:flex;align-items:flex-start;gap:8px;width:max-content;max-width:calc(100vw - 24px);left:auto;right:-56px}
.dre-side-menuHasPane .dre-side-rootPane{width:max-content!important;min-width:0;max-width:calc(100vw - 24px);flex:0 0 auto}
.dre-side-menuHasPane .dre-side-subPane{width:max-content!important;min-width:0;max-width:calc(100vw - 24px);flex:0 0 auto}
.dre-side-menuHasPane .dre-side-cell{width:max-content;min-width:0;max-width:100%}
.dre-side-menuHasPane .dre-side-optionList,.dre-side-menuHasPane .dre-side-subPane>div{width:max-content;min-width:0;max-width:100%}
.dre-side-menuHasPane .dre-side-option{width:max-content;min-width:0;max-width:100%}
.dre-side-menuHasPane .dre-side-optionCopy{flex:0 0 auto}
.dre-side-menu{left:-170px;right:auto}
.dre-side-menuHasPane{left:-170px;right:auto}
.dre-side-menu:not(.dre-side-menuHasPane){left:auto;right:0}
.dre-side-menuHasPane .dre-side-subPane{min-width:250px}
.dre-side-menuHasPane .dre-side-optionList,.dre-side-menuHasPane .dre-side-subPane>div{width:100%;min-width:0}
.dre-side-menuHasPane .dre-side-option{width:100%;min-width:0}
.dre-side-menuHasPane .dre-side-optionCopy{flex:1;min-width:0}
.dre-side-menuHasPane{left:auto;right:0;width:max-content!important;display:block;overflow:visible}
.dre-side-menuHasPane .dre-side-rootPane{width:max-content!important;max-width:calc(100vw - 24px)}
.dre-side-menuHasPane .dre-side-subPane{position:absolute;left:calc(100% + 8px);top:0;width:250px!important;min-width:250px;max-width:calc(100vw - 24px);height:max-content}
.dre-nativeChevron{display:inline-flex;align-items:center;justify-content:center;flex:none;width:14px;height:14px;color:var(--dsw-alias-label-tertiary);transform:rotate(0);transform-origin:center}.dre-nativeChevronRight{transform:rotate(-90deg)}.dre-nativeChevronUp{transform:rotate(180deg)}.dre-nativeChevronAnimated{transition:transform .12s}.dre-nativeChevron svg,.dre-side-check svg{display:block;flex:none}
.dre-side-chevron::before{display:none}.dre-side-check{display:inline-flex;align-items:center;justify-content:center;width:18px;height:16px;flex:none;color:var(--dsw-alias-label-primary);font-size:0;line-height:0}
@media (prefers-reduced-motion:reduce){.dre-nativeChevronAnimated{transition:none}}
.dre-side-cellDisabled{color:var(--dsw-alias-label-tertiary);cursor:default}.dre-side-cellDisabled:hover{background:transparent}
.dre-side-cell,.dre-side-option{box-sizing:border-box;display:flex!important;flex:0 0 auto;flex-direction:row}
.dre-side-cellActive{background:var(--dsw-alias-interactive-bg-hover)}
.dre-side-groupTitle,.dre-side-empty{display:block}
@media (max-width:560px){.dre-side-menu{width:min(338px,calc(100vw - 24px));right:0}.dre-side-menuHasPane{right:0}.dre-side-menuHasPane .dre-side-rootPane{flex:1 1 auto;min-width:0;max-width:none;width:auto}.dre-side-menuHasPane .dre-side-subPane{display:none!important}}
.dre-side-menuHasPane{right:0}
.dre-side-menuHasPane .dre-side-cell{width:100%!important;min-width:0;max-width:none}
.dre-side-menuHasPane .dre-side-cellActive{background:transparent!important}
.dre-side-menuPaneLeft .dre-side-subPane{left:auto;right:calc(100% + 8px)}
.dre-side-menuPaneUp .dre-side-subPane{top:auto;bottom:0}
.dre-capability{margin-top:12px;padding-top:12px;border-top:1px solid var(--dsw-alias-border-l2)}.dre-capabilityTitle{margin-bottom:7px;font-size:13px;font-weight:600;line-height:20px}.dre-capabilityOptions{display:flex;flex-wrap:wrap;gap:6px 12px}.dre-capabilityOption{display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-label-primary);font-size:12px;line-height:20px;cursor:pointer}.dre-capabilityOption input{accent-color:var(--dsw-alias-brand-primary);margin:0}.dre-capabilityHint{margin-top:6px;color:var(--dsw-alias-label-tertiary);font-size:11px;line-height:16px}
`
      document.head.append(style)
    }

    const STANDARD_LEVELS: ReadonlyArray<readonly [string, string]> = [
      ['off', '关闭'],
      ['minimal', '最低'],
      ['low', '低'],
      ['medium', '中'],
      ['high', '高'],
      ['xhigh', '超高'],
      ['max', '最大']
    ]

    function providersFrom(snapshot: SettingsSnapshot): Record<string, ProviderConfig> {
      const providers = snapshot?.value?.providers
      return providers && typeof providers === 'object' && !Array.isArray(providers)
        ? providers
        : {}
    }

    function modelEntries(providers: Record<string, ProviderConfig>): Array<{ providerId: string; provider: ProviderConfig; model: ModelConfig; key: string }> {
      return Object.entries(providers).flatMap(([providerId, provider]) => {
        const models = Array.isArray(provider?.models) ? provider.models : []
        return models
          .filter((model) => model && typeof model.id === 'string')
          .map((model) => ({ providerId, provider, model, key: `${providerId}/${model.id}` }))
      })
    }

    function currentEfforts(model: ModelConfig | undefined): ReasoningEfforts {
      const value = model?.reasoningEfforts
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
    }

    function currentInput(model: ModelConfig | undefined): InputModality[] | undefined {
      const value = model?.input
      return Array.isArray(value) && value.every((modality) => modality === 'text' || modality === 'image')
        ? value
        : undefined
    }

    function effectiveInput(model: ModelConfig | undefined): InputModality[] {
      return currentInput(model) ?? ['text']
    }

    function applyModels(settingsStore: SettingsStore, selectedEntries: Array<{ providerId: string; model: ModelConfig; key: string }>, drafts: Record<string, ReasoningEfforts>, inputDrafts: Record<string, InputModality[]>): Promise<void> {
      const snapshot = settingsStore.getSnapshot()
      const providers = providersFrom(snapshot)
      const nextProviders = { ...providers }
      const selectedByProvider = new Map<string, Map<string, { efforts?: ReasoningEfforts; input?: InputModality[] }>>()
      for (const entry of selectedEntries) {
        if (!selectedByProvider.has(entry.providerId)) selectedByProvider.set(entry.providerId, new Map())
        selectedByProvider.get(entry.providerId)?.set(entry.model.id, {
          efforts: drafts[entry.key],
          input: inputDrafts[entry.key]
        })
      }
      for (const [providerId, models] of selectedByProvider) {
        const provider = providers[providerId]
        if (!provider || !Array.isArray(provider.models)) continue
        nextProviders[providerId] = {
          ...provider,
          models: provider.models.map((model) => {
            const draft = models.get(model.id)
            if (!draft) return model
            return {
              ...model,
              ...(draft.efforts === undefined ? {} : { reasoningEfforts: draft.efforts }),
              ...(draft.input === undefined ? {} : { input: draft.input })
            }
          })
        }
      }
      return Promise.resolve(settingsStore.set('providers', nextProviders)).then(() => undefined)
    }

    const EFFORT_LABELS: Record<string, string> = {
      off: '关闭', minimal: '最低', low: '低', medium: '中',
      high: '高', xhigh: '超高', max: '最大'
    }

    function effortName(effort: { id?: string; name?: string } | undefined): string {
      return (effort?.id ? EFFORT_LABELS[effort.id] : undefined) ?? effort?.name ?? effort?.id ?? '默认'
    }

    function hideNativeModelSelector() {
      const hide = () => document.querySelectorAll('button[aria-label^="选择模型"],button[aria-label^="Select model"]')
        .forEach((button) => {
          if (!button.classList.contains('dre-side-trigger')) button.parentElement?.classList.add('dre-native-model-hidden')
        })
      hide()
      const observer = new MutationObserver(hide)
      observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-label'] })
      return () => observer.disconnect()
    }

    function NativeChevron({ direction = 'down', animated = false, className = '' }: { direction?: 'down' | 'right' | 'up'; animated?: boolean; className?: string }) {
      return React.createElement('span', {
        className: `dre-nativeChevron${direction === 'right' ? ' dre-nativeChevronRight' : ''}${direction === 'up' ? ' dre-nativeChevronUp' : ''}${animated ? ' dre-nativeChevronAnimated' : ''}${className ? ` ${className}` : ''}`,
        'aria-hidden': true
      },
        React.createElement('svg', { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none' },
          React.createElement('path', {
            d: 'M11.8486 5.5L11.4238 5.92383L8.69727 8.65137C8.44157 8.90706 8.21562 9.13382 8.01172 9.29785C7.79912 9.46883 7.55595 9.61756 7.25 9.66602C7.08435 9.69222 6.91565 9.69222 6.75 9.66602C6.44405 9.61756 6.20088 9.46883 5.98828 9.29785C5.78438 9.13382 5.55843 8.90706 5.30273 8.65137L2.57617 5.92383L2.15137 5.5L3 4.65137L3.42383 5.07617L6.15137 7.80273C6.42595 8.07732 6.59876 8.24849 6.74023 8.3623C6.87291 8.46904 6.92272 8.47813 6.9375 8.48047C6.97895 8.48703 7.02105 8.48703 7.0625 8.48047C7.07728 8.47813 7.12709 8.46904 7.25977 8.3623C7.40124 8.24849 7.57405 8.07732 7.84863 7.80273L10.5762 5.07617L11 4.65137L11.8486 5.5Z',
            fill: 'currentColor'
          })
        )
      )
    }

    function NativeCheck({ selected }: { selected: boolean }) {
      return React.createElement('span', { className: 'dre-side-check', 'aria-hidden': true },
        selected && React.createElement('svg', { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' },
          React.createElement('path', {
            d: 'M15.0498 3.92579L8.49512 12.3818C8.25774 12.6881 8.04517 12.9645 7.84668 13.1689C7.63957 13.3823 7.38732 13.5841 7.04492 13.6719C6.86373 13.7183 6.6757 13.7346 6.48926 13.7197C6.13666 13.6915 5.8528 13.5355 5.6123 13.3604C5.38201 13.1926 5.12573 12.9567 4.83984 12.6953L1.03125 9.21289L1.96875 8.1875L5.77734 11.6699C6.08684 11.9529 6.27773 12.1249 6.43066 12.2363C6.50183 12.2882 6.54699 12.3135 6.57324 12.3252C6.58525 12.3305 6.59269 12.3322 6.5957 12.333C6.59802 12.3336 6.59961 12.334 6.59961 12.334C6.63317 12.3367 6.66758 12.3335 6.7002 12.3252C6.7002 12.3252 6.70211 12.3251 6.7041 12.3242C6.70698 12.3229 6.71348 12.319 6.72461 12.3115C6.74849 12.2956 6.78843 12.2642 6.84961 12.2012C6.98138 12.0654 7.13957 11.8628 7.39648 11.5313L13.9502 3.07422L15.0498 3.92579Z',
            fill: 'currentColor'
          })
        )
      )
    }

    function SideModelSelect({ available, directory, load, select, locked }: SideModelSelectProps) {
      const state = React.useSyncExternalStore(
        (listener) => directory.subscribe(listener),
        () => directory.getSnapshot(),
        () => directory.getSnapshot()
      )
      const [open, setOpen] = React.useState(false)
      const [pane, setPane] = React.useState(null)
      const [paneSide, setPaneSide] = React.useState('right')
      const [paneVertical, setPaneVertical] = React.useState('down')
      const [paneMaxHeight, setPaneMaxHeight] = React.useState(null)
      const rootRef = React.useRef<Element | null>(null)

      React.useEffect(() => {
        if (available) load()
      }, [available, load])
      React.useEffect(() => {
        if (!open) return undefined
        const closeOutside = (event) => {
          if (!rootRef.current?.contains(event.target)) {
            setOpen(false)
            setPane(null)
          }
        }
        document.addEventListener('mousedown', closeOutside)
        return () => document.removeEventListener('mousedown', closeOutside)
      }, [open])

      React.useLayoutEffect(() => {
        if (!open || pane === null) {
          setPaneSide('right')
          setPaneVertical('down')
          setPaneMaxHeight(null)
          return undefined
        }
        const updatePanePlacement = () => {
          const root = rootRef.current
          const rootPane = root?.querySelector('.dre-side-rootPane')
          const subPane = root?.querySelector('.dre-side-subPane')
          if (!rootPane || !subPane) return
          const rootRect = rootPane.getBoundingClientRect()
          const subWidth = subPane.getBoundingClientRect().width || 250
          const edge = 8
          const gap = 8
          const rightFits = rootRect.right + gap + subWidth <= window.innerWidth - edge
          const contentHeight = Math.min(subPane.scrollHeight, 390)
          const downSpace = Math.max(0, window.innerHeight - edge - rootRect.top)
          const upSpace = Math.max(0, rootRect.bottom - edge)
          const vertical = contentHeight <= downSpace || downSpace >= upSpace ? 'down' : 'up'
          const availableHeight = vertical === 'down' ? downSpace : upSpace
          setPaneSide(rightFits ? 'right' : 'left')
          setPaneVertical(vertical)
          setPaneMaxHeight(Math.max(1, Math.floor(Math.min(contentHeight, availableHeight))))
        }
        updatePanePlacement()
        window.addEventListener('resize', updatePanePlacement)
        const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(updatePanePlacement) : null
        if (observer) {
          const observedRoot = rootRef.current
          const observedSubPane = observedRoot?.querySelector('.dre-side-subPane')
          if (observedRoot) observer.observe(observedRoot)
          if (observedSubPane) observer.observe(observedSubPane)
        }
        return () => {
          window.removeEventListener('resize', updatePanePlacement)
          observer?.disconnect()
        }
      }, [open, pane])

      if (!available) return null
      const current = state.current ?? { provider: '', model: '' }
      const group = state.groups.find((entry) => entry.id === current.provider)
      const model = group?.models.find((entry) => entry.id === current?.model)
      const reasoning = model?.reasoning ?? { efforts: [] }
      const reasoningAvailable = reasoning.efforts.length > 0
      const effort = current?.reasoningEffort ?? reasoning?.defaultEffort
      const modelLabel = model?.name ?? current?.model ?? '选择模型'
      const showProviderHeaders = state.groups.length > 1
      const effortLabel = !reasoningAvailable
        ? '不可用'
        : effort === undefined ? '默认' : effortName({ id: effort })
      const choose = (selection) => select(selection).then((accepted) => {
        if (!accepted) return
        setOpen(false)
        setPane(null)
      })
      const effortOptions = reasoningAvailable
        ? [
            reasoning.defaultEffort === undefined ? React.createElement('button', {
              type: 'button',
              className: 'dre-side-option',
              onClick: () => choose({ provider: current.provider, model: current.model })
            },
              React.createElement('span', { className: 'dre-side-optionName' }, '默认'),
              React.createElement(NativeCheck, { selected: effort === undefined })
            ) : null,
            ...reasoning.efforts.map((candidate) => React.createElement('button', {
              type: 'button',
              role: 'menuitemradio',
              'aria-checked': effort === candidate.id,
              className: 'dre-side-option',
              key: candidate.id,
              onClick: () => choose({ provider: current.provider, model: current.model, reasoningEffort: candidate.id })
            },
              React.createElement('span', { className: 'dre-side-optionCopy' },
                React.createElement('span', { className: 'dre-side-optionName' }, effortName(candidate)),
                candidate.description ? React.createElement('span', { className: 'dre-side-optionDescription' }, candidate.description) : null
              ),
              React.createElement(NativeCheck, { selected: effort === candidate.id })
            ))
          ].filter(Boolean)
        : React.createElement('div', { className: 'dre-side-empty' }, '未配置推理等级')
      const modelOptions = state.status === 'loading'
        ? React.createElement('div', { className: 'dre-side-empty' }, '正在加载模型...')
        : state.groups.map((entry) => React.createElement('div', { key: entry.id },
          showProviderHeaders && React.createElement('div', { className: 'dre-side-groupTitle' }, entry.name ?? entry.id),
          entry.models.map((candidate) => React.createElement('button', {
            type: 'button', role: 'menuitemradio', 'aria-checked': current?.provider === entry.id && current?.model === candidate.id,
            className: 'dre-side-option', key: candidate.id,
            onClick: () => choose({ provider: entry.id, model: candidate.id, ...(candidate.reasoning?.defaultEffort === undefined ? {} : { reasoningEffort: candidate.reasoning.defaultEffort }) })
          },
            React.createElement('span', { className: 'dre-side-optionCopy' },
              React.createElement('span', { className: 'dre-side-optionName' }, candidate.name ?? candidate.id)
            ),
            React.createElement(NativeCheck, { selected: current?.provider === entry.id && current?.model === candidate.id })
          ))
        ))
      /* SIDE_MENU_START */
      const menu = open && React.createElement('div', {
        className: `dre-side-menu${pane !== null ? ' dre-side-menuHasPane' : ''}${pane !== null && paneSide === 'left' ? ' dre-side-menuPaneLeft' : ''}${pane !== null && paneVertical === 'up' ? ' dre-side-menuPaneUp' : ''}`, role: 'menu', 'aria-label': '模型和推理等级'
      },
        React.createElement('div', { className: 'dre-side-rootPane' },
          React.createElement('button', { type: 'button', className: `dre-side-cell${pane === 'model' ? ' dre-side-cellActive' : ''}`, onClick: () => setPane('model') },
            React.createElement('span', { className: 'dre-side-cellLabel' }, '模型'),
            React.createElement('span', { className: 'dre-side-cellValue' }, modelLabel),
            React.createElement('span', { className: 'dre-side-chevron' },
              React.createElement(NativeChevron, { direction: 'right' })
            )
          ),
          React.createElement('button', { type: 'button', disabled: !reasoningAvailable, className: `dre-side-cell${pane === 'effort' ? ' dre-side-cellActive' : ''}${!reasoningAvailable ? ' dre-side-cellDisabled' : ''}`, onClick: () => reasoningAvailable && setPane('effort') },
            React.createElement('span', { className: 'dre-side-cellLabel' }, '推理力度'),
            React.createElement('span', { className: 'dre-side-cellValue' }, effortLabel),
            React.createElement('span', { className: 'dre-side-chevron' },
              reasoningAvailable && React.createElement(NativeChevron, { direction: 'right' })
            )
          ),
        ),
        pane !== null && React.createElement('div', { className: 'dre-side-subPane', style: paneMaxHeight === null ? undefined : { maxHeight: `${paneMaxHeight}px` } },
          pane === 'model' && modelOptions,
          pane === 'effort' && React.createElement('div', { className: 'dre-side-optionList' }, effortOptions)
        )
      )
      /* SIDE_MENU_END */

      return React.createElement('div', { className: 'dre-side-root', ref: rootRef },
        React.createElement('button', {
          type: 'button', className: 'dre-side-trigger', disabled: locked || state.status === 'selecting',
          'aria-label': `选择模型，当前为${modelLabel}，推理力度为${effortLabel}`,
          'aria-expanded': open, onClick: () => { setOpen((value) => !value); setPane(null); load() }
        },
          React.createElement('span', { className: 'dre-side-model' }, modelLabel),
          React.createElement('span', { className: 'dre-side-effort' }, effortLabel),
          React.createElement(NativeChevron, { direction: open ? 'up' : 'down', animated: true })
        ),
        menu
      )
    }

    function ReasoningSettingsCard({ settingsStore }: ReasoningSettingsCardProps) {
      const snapshot = React.useSyncExternalStore(
        (listener) => settingsStore.subscribe(listener),
        () => settingsStore.getSnapshot(),
        () => settingsStore.getSnapshot()
      )
      const [expanded, setExpanded] = React.useState(false)
      const [selectedKeys, setSelectedKeys] = React.useState([])
      const [drafts, setDrafts] = React.useState({})
      const [inputDrafts, setInputDrafts] = React.useState({})
      const [customDraft, setCustomDraft] = React.useState('')
      const [applyState, setApplyState] = React.useState('idle')
      const [appliedCount, setAppliedCount] = React.useState(0)
      const providers = providersFrom(snapshot)
      const entries = modelEntries(providers)
      const writable = snapshot.status === 'ready' && snapshot.writable !== false

      React.useEffect(() => {
        settingsStore.load().catch(() => {})
      }, [settingsStore])

      const selectedEntries = entries.filter((entry) => selectedKeys.includes(entry.key))
      const resetApplyState = () => {
        if (applyState !== 'saving') setApplyState('idle')
      }
      const selectModel = (key) => {
        resetApplyState()
        setCustomDraft('')
        setSelectedKeys((current) => current.includes(key)
          ? current.filter((value) => value !== key)
          : [...current, key])
      }

      const effortsFor = (entry) => drafts[entry.key] ?? currentEfforts(entry.model)
      const inputFor = (entry) => inputDrafts[entry.key] ?? effectiveInput(entry.model)
      const allHave = (level) => selectedEntries.length > 0 && selectedEntries.every((entry) =>
        Object.prototype.hasOwnProperty.call(effortsFor(entry), level))
      const allHaveInput = (modality: InputModality) => selectedEntries.length > 0 && selectedEntries.every((entry) =>
        inputFor(entry).includes(modality))

      const toggleInput = (modality: InputModality) => {
        if (!writable || selectedEntries.length === 0) return
        resetApplyState()
        const enabled = allHaveInput(modality)
        setInputDrafts((current) => {
          const next = { ...current }
          for (const entry of selectedEntries) {
            const input = [...(next[entry.key] ?? effectiveInput(entry.model))]
            const index = input.indexOf(modality)
            if (enabled && index >= 0) input.splice(index, 1)
            if (!enabled && index < 0) input.push(modality)
            next[entry.key] = input
          }
          return next
        })
      }

      const toggleLevel = (level) => {
        if (!writable || selectedEntries.length === 0) return
        resetApplyState()
        const enabled = allHave(level)
        setDrafts((current) => {
          const next = { ...current }
          for (const entry of selectedEntries) {
            const efforts = { ...(next[entry.key] ?? currentEfforts(entry.model)) }
            if (enabled) delete efforts[level]
            else efforts[level] = level
            next[entry.key] = efforts
          }
          return next
        })
      }

      const customValue = () => {
        if (customDraft !== '') return customDraft
        if (selectedEntries.length === 0) return ''
        const values = selectedEntries.map((entry) => Object.entries(effortsFor(entry))
          .filter(([id]) => !STANDARD_LEVELS.some(([standard]) => standard === id))
          .map(([id, wireValue]) => wireValue === id ? id : `${id}=${wireValue}`)
          .join(', '))
        return values.every((value) => value === values[0]) ? values[0] : ''
      }

      const saveCustom = (value) => {
        if (!writable || selectedEntries.length === 0) return
        resetApplyState()
        setDrafts((current) => {
          const next = { ...current }
          for (const entry of selectedEntries) {
            const efforts = { ...(next[entry.key] ?? currentEfforts(entry.model)) }
            for (const id of Object.keys(efforts)) {
              if (!STANDARD_LEVELS.some(([standard]) => standard === id)) delete efforts[id]
            }
            for (const item of value.split(',').map((part) => part.trim()).filter(Boolean)) {
              const separator = item.indexOf('=')
              const id = (separator < 0 ? item : item.slice(0, separator)).trim()
              const wireValue = (separator < 0 ? item : item.slice(separator + 1)).trim()
              if (id && wireValue) efforts[id] = wireValue
            }
            next[entry.key] = efforts
          }
          return next
        })
        setCustomDraft(value)
      }

      const selectAll = () => {
        resetApplyState()
        setSelectedKeys(entries.map((entry) => entry.key))
      }
      const clearSelection = () => {
        resetApplyState()
        setSelectedKeys([])
        setCustomDraft('')
      }

      const applySelectedModels = async () => {
        if (!writable || selectedEntries.length === 0 || applyState === 'saving') return
        const count = selectedEntries.length
        setApplyState('saving')
        try {
          await applyModels(settingsStore, selectedEntries, drafts, inputDrafts)
          setAppliedCount(count)
          setApplyState('success')
        } catch (error) {
          console.error('[dsh-plugin-reasoning-effort] failed to save settings', error)
          setApplyState('error')
        }
      }

      const applyStatus = applyState === 'saving'
        ? '正在保存模型设置...'
        : applyState === 'success'
          ? `已应用到 ${appliedCount} 个模型`
          : applyState === 'error'
            ? '应用失败，请重试'
            : ''

      const modelList = entries.map(({ providerId, provider, model, key }) => {
        const selected = selectedKeys.includes(key)
        return React.createElement('div', { className: 'dre-provider', key },
          React.createElement('div', { className: 'dre-providerName' }, provider.displayName || providerId),
          React.createElement('div', { className: 'dre-model' },
            React.createElement('label', null,
              React.createElement('input', {
                type: 'checkbox', checked: selected, disabled: !writable || applyState === 'saving',
                onChange: () => selectModel(key)
              }),
              React.createElement('span', { className: 'dre-modelName' }, model.name || model.id)
            )
          )
        )
      })

      return React.createElement('section', { className: `dre-card${expanded ? ' dre-open' : ''}` },
        React.createElement('button', {
          type: 'button', className: 'dre-header', 'aria-expanded': expanded,
          onClick: () => setExpanded((value) => !value)
        },
          React.createElement('span', { className: 'dre-headText' },
            React.createElement('span', { className: 'dre-title' }, '模型能力'),
            React.createElement('span', { className: 'dre-subtitle' }, '选择模型并配置输入能力和推理等级')
          ),
          React.createElement(NativeChevron, { direction: expanded ? 'up' : 'down', animated: true, className: 'dre-chevron' })
        ),
        expanded && React.createElement('div', { className: 'dre-content' },
          snapshot.status === 'loading' && React.createElement('div', { className: 'dre-empty' }, '正在加载模型设置...'),
          snapshot.error && React.createElement('div', { className: 'dre-error' }, String(snapshot.error)),
          snapshot.status !== 'loading' && entries.length === 0 && React.createElement('div', { className: 'dre-empty' }, '未找到模型，请先在 llm-pi-ai 设置中添加模型。'),
          entries.length > 0 && React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'dre-selectionBar' },
              React.createElement('span', { className: 'dre-selectionCount' }, `已选择 ${selectedEntries.length} 个模型`),
              React.createElement('button', { type: 'button', className: 'dre-smallButton', disabled: !writable || applyState === 'saving', onClick: selectAll }, '全选'),
              React.createElement('button', { type: 'button', className: 'dre-smallButton', disabled: !writable || selectedEntries.length === 0 || applyState === 'saving', onClick: clearSelection }, '清除')
            ),
            React.createElement('div', { className: 'dre-modelList' }, modelList),
            React.createElement('div', { className: 'dre-capability' },
              React.createElement('div', { className: 'dre-capabilityTitle' }, '输入能力'),
              React.createElement('div', { className: 'dre-capabilityOptions' },
                ([['text', '文本'], ['image', '图片']] as const).map(([id, label]) =>
                  React.createElement('label', { className: 'dre-capabilityOption', key: id },
                    React.createElement('input', {
                      type: 'checkbox', checked: allHaveInput(id), disabled: !writable || selectedEntries.length === 0 || applyState === 'saving',
                      onChange: () => toggleInput(id)
                    }), label
                  )
                )
              ),
              React.createElement('div', { className: 'dre-capabilityHint' }, '图片附件只会发送给声明支持图片输入的模型。')
            ),
            React.createElement('div', { className: 'dre-batch' },
              React.createElement('div', { className: 'dre-batchTitle' }, '为选中模型应用等级'),
              React.createElement('div', { className: 'dre-levels' }, STANDARD_LEVELS.map(([id, label]) =>
                React.createElement('label', { className: 'dre-level', key: id },
                  React.createElement('input', {
                    type: 'checkbox', checked: allHave(id), disabled: !writable || selectedEntries.length === 0 || applyState === 'saving',
                    onChange: () => toggleLevel(id)
                  }), label
                )
              )),
              React.createElement('input', {
                className: 'dre-custom', type: 'text', disabled: !writable || selectedEntries.length === 0 || applyState === 'saving',
                placeholder: '自定义等级：id 或 id=wireValue', value: customValue(),
                onChange: (event) => { resetApplyState(); setCustomDraft(event.target.value) }, onBlur: (event) => saveCustom(event.target.value)
              }),
              React.createElement('button', {
                type: 'button', className: 'dre-apply', disabled: !writable || selectedEntries.length === 0 || applyState === 'saving',
                onClick: applySelectedModels
              }, applyState === 'saving' ? '正在应用...' : applyState === 'success' ? '已应用' : '应用到选中模型'),
              React.createElement('div', {
                className: `dre-applyStatus${applyState === 'success' ? ' dre-applyStatusSuccess' : ''}${applyState === 'error' ? ' dre-applyStatusError' : ''}`,
                role: 'status', 'aria-live': 'polite'
              }, applyStatus)
            )
          )
        )
      )
    }

    module.exports = {
      inject: ['settingsScope', 'modelDirectories', 'sessions', 'slots'],
      apply(ctx) {
        ctx.effect(hideNativeModelSelector)
        const settingsStore = ctx.settingsScope.bind({ namespace: 'llm-pi-ai' })
        settingsStore.load().catch(() => {})
        ctx.slots.inject('conversation.input.model', () => ctx.slots.register({
          name: 'conversation.input.model',
          id: 'reasoning-effort-side-model',
          priority: -100,
          order: -100,
          inject: (sessionId) => {
            const directory = ctx.modelDirectories.directoryFor(sessionId)
            const available = ctx.sessions.subagentAddress(sessionId) === undefined
            return {
              available,
              directory: directory.store,
              load: () => directory.load().catch(() => {}),
              select: (selection) => available
                ? directory.select(selection).then(() => true, () => false)
                : Promise.resolve(false),
              locked: false
            }
          }
        }, SideModelSelect))
        ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
          name: 'settings.plugin.item',
          key: 'llm-pi-ai',
          order: 25,
          inject: () => ({ settingsStore })
        }, ReasoningSettingsCard))
      }
    }
    return module.exports
  }
})
