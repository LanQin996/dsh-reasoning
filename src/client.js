window.__ModuleLoader__.load({
  id: 'dsh-plugin-reasoning-effort',
  factory: (require) => {
    const module = { exports: {} }
    const React = require('react')

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
.dre-chevron{color:var(--dsw-alias-label-tertiary);font-size:16px;transition:transform .15s}.dre-open .dre-chevron{transform:rotate(180deg)}
.dre-content{border-top:1px solid var(--dsw-alias-border-l2);padding:4px 16px 14px}
.dre-selectionBar{display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--dsw-alias-border-l2);font-size:12px}.dre-selectionCount{flex:1;color:var(--dsw-alias-label-secondary)}
.dre-smallButton,.dre-apply{height:28px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-secondary);padding:0 9px;font:inherit;font-size:12px;cursor:pointer}.dre-smallButton:hover:not(:disabled),.dre-apply:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}.dre-smallButton:disabled,.dre-apply:disabled{cursor:default;opacity:.45}
.dre-modelList{max-height:260px;overflow-y:auto}.dre-provider{padding-top:12px}.dre-providerName{margin:0 0 4px;font-size:13px;font-weight:600;line-height:20px}.dre-model{display:flex;align-items:center;gap:7px;min-height:30px;border-top:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary);font-size:12px}.dre-model label{display:flex;align-items:center;gap:7px;min-width:0;cursor:pointer}.dre-model input{accent-color:var(--dsw-alias-brand-primary);margin:0}.dre-modelName{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dre-batch{margin-top:12px;padding-top:12px;border-top:1px solid var(--dsw-alias-border-l2)}.dre-batchTitle{margin-bottom:7px;font-size:13px;font-weight:600;line-height:20px}.dre-levels{display:flex;flex-wrap:wrap;gap:6px 12px}.dre-level{display:inline-flex;align-items:center;gap:5px;color:var(--dsw-alias-label-primary);font-size:12px;line-height:20px;cursor:pointer}.dre-level input{accent-color:var(--dsw-alias-brand-primary);margin:0}
.dre-custom{box-sizing:border-box;width:100%;height:30px;margin-top:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);padding:0 8px;font:inherit;font-size:12px;outline:0}.dre-custom:focus{border-color:var(--dsw-alias-brand-primary)}
.dre-apply{margin-top:10px;width:100%;color:var(--dsw-alias-label-primary)}
.dre-empty,.dre-error{padding:12px 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.dre-error{color:var(--dsw-alias-state-error-primary)}
.dre-native-model-hidden{display:none!important}
.dre-side-root{position:relative;min-width:0}.dre-side-trigger{display:flex;align-items:center;gap:4px;max-width:220px;height:28px;border:0;border-radius:24px;background:transparent;color:var(--dsw-alias-label-secondary);padding:0 4px 0 8px;font:inherit;font-size:13px;font-weight:500;cursor:pointer}.dre-side-trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}.dre-side-trigger:disabled{color:var(--dsw-alias-label-dimmed);cursor:default}.dre-side-model{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dre-side-effort{color:var(--dsw-alias-label-caption);white-space:nowrap}.dre-side-menu{position:absolute;right:0;bottom:calc(100% + 8px);z-index:30;display:flex;width:490px;max-width:calc(100vw - 24px);max-height:min(390px,100vh - 96px);overflow:hidden;border:1px solid var(--dsw-alias-border-inverted);border-radius:12px;background:var(--dsw-specific-menu);box-shadow:var(--dsw-shadow-lv3);color:var(--dsw-alias-label-primary);padding:4px}.dre-side-rootPane,.dre-side-subPane{min-width:0;overflow-y:auto}.dre-side-rootPane{width:240px}.dre-side-subPane{width:240px;border-left:1px solid var(--dsw-alias-border-l2);padding-left:4px}.dre-side-cell{display:flex;align-items:center;gap:8px;width:100%;height:40px;border:0;border-radius:9px;background:transparent;color:inherit;padding:0 10px;text-align:left;font:inherit;font-size:14px;cursor:pointer}.dre-side-cell:hover,.dre-side-option:hover{background:var(--dsw-alias-interactive-bg-hover)}.dre-side-cellLabel{flex:1;min-width:0}.dre-side-cellValue{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary)}.dre-side-chevron{color:var(--dsw-alias-label-tertiary);font-size:16px}.dre-side-groupTitle{padding:6px 10px 3px;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.dre-side-option{display:flex;align-items:center;gap:8px;width:100%;min-height:38px;border:0;border-radius:9px;background:transparent;color:inherit;padding:6px 8px;text-align:left;font:inherit;cursor:pointer}.dre-side-optionCopy{display:flex;flex:1;min-width:0;flex-direction:column}.dre-side-optionName{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:20px}.dre-side-optionDescription{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px}.dre-side-check{width:18px;flex:none;text-align:center}.dre-side-empty{padding:10px;color:var(--dsw-alias-label-tertiary);font-size:13px}
`
      document.head.append(style)
    }

    const STANDARD_LEVELS = [
      ['off', '关闭'],
      ['minimal', '最低'],
      ['low', '低'],
      ['medium', '中'],
      ['high', '高'],
      ['xhigh', '超高'],
      ['max', '最大']
    ]

    function providersFrom(snapshot) {
      const providers = snapshot?.value?.providers
      return providers && typeof providers === 'object' && !Array.isArray(providers)
        ? providers
        : {}
    }

    function modelEntries(providers) {
      return Object.entries(providers).flatMap(([providerId, provider]) => {
        const models = Array.isArray(provider?.models) ? provider.models : []
        return models
          .filter((model) => model && typeof model.id === 'string')
          .map((model) => ({ providerId, provider, model, key: `${providerId}/${model.id}` }))
      })
    }

    function currentEfforts(model) {
      const value = model?.reasoningEfforts
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {}
    }

    function applyModels(settingsStore, selectedEntries, drafts) {
      const snapshot = settingsStore.getSnapshot()
      const providers = providersFrom(snapshot)
      const nextProviders = { ...providers }
      const selectedByProvider = new Map()
      for (const entry of selectedEntries) {
        if (!selectedByProvider.has(entry.providerId)) selectedByProvider.set(entry.providerId, new Map())
        selectedByProvider.get(entry.providerId).set(entry.model.id, drafts[entry.key] ?? currentEfforts(entry.model))
      }
      for (const [providerId, models] of selectedByProvider) {
        const provider = providers[providerId]
        if (!provider || !Array.isArray(provider.models)) continue
        nextProviders[providerId] = {
          ...provider,
          models: provider.models.map((model) => models.has(model.id)
            ? { ...model, reasoningEfforts: models.get(model.id) }
            : model)
        }
      }
      Promise.resolve(settingsStore.set('providers', nextProviders)).catch((error) => {
        console.error('[dsh-plugin-reasoning-effort] failed to save settings', error)
      })
    }

    const EFFORT_LABELS = {
      off: '关闭', minimal: '最低', low: '低', medium: '中',
      high: '高', xhigh: '超高', max: '最大'
    }

    function effortName(effort) {
      return EFFORT_LABELS[effort?.id] ?? effort?.name ?? effort?.id ?? '默认'
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

    function SideModelSelect({ available, directory, load, select, locked }) {
      const state = React.useSyncExternalStore(
        (listener) => directory.subscribe(listener),
        () => directory.getSnapshot(),
        () => directory.getSnapshot()
      )
      const [open, setOpen] = React.useState(false)
      const [pane, setPane] = React.useState(null)
      const rootRef = React.useRef(null)

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

      if (!available) return null
      const current = state.current
      const group = state.groups.find((entry) => entry.id === current?.provider)
      const model = group?.models.find((entry) => entry.id === current?.model)
      const reasoning = model?.reasoning
      const effort = current?.reasoningEffort ?? reasoning?.defaultEffort
      const modelLabel = model?.name ?? current?.model ?? '选择模型'
      const effortLabel = reasoning === undefined
        ? '默认'
        : effort === undefined ? '默认' : effortName({ id: effort })
      const choose = (selection) => select(selection).then((accepted) => {
        if (!accepted) return
        setOpen(false)
        setPane(null)
      })
      /* SIDE_MENU_START */
      const menu = open && React.createElement('div', {
        className: 'dre-side-menu', role: 'menu', 'aria-label': '模型和推理等级'
      },
        React.createElement('div', { className: 'dre-side-rootPane' },
          React.createElement('button', { type: 'button', className: 'dre-side-cell', onClick: () => setPane('model') },
            React.createElement('span', { className: 'dre-side-cellLabel' }, '模型'),
            React.createElement('span', { className: 'dre-side-cellValue' }, modelLabel),
            React.createElement('span', { className: 'dre-side-chevron', 'aria-hidden': true }, '>')
          ),
          reasoning !== undefined && React.createElement('button', { type: 'button', className: 'dre-side-cell', onClick: () => setPane('effort') },
            React.createElement('span', { className: 'dre-side-cellLabel' }, '推理力度'),
            React.createElement('span', { className: 'dre-side-cellValue' }, effortLabel),
            React.createElement('span', { className: 'dre-side-chevron', 'aria-hidden': true }, '>')
          )
        ),
        pane !== null && React.createElement('div', { className: 'dre-side-subPane' },
          pane === 'model' && (state.status === 'loading'
            ? React.createElement('div', { className: 'dre-side-empty' }, '正在加载模型...')
            : state.groups.map((entry) => React.createElement('div', { key: entry.id },
              React.createElement('div', { className: 'dre-side-groupTitle' }, entry.name ?? entry.id),
              entry.models.map((candidate) => React.createElement('button', {
                type: 'button', role: 'menuitemradio', 'aria-checked': current?.provider === entry.id && current?.model === candidate.id,
                className: 'dre-side-option', key: candidate.id,
                onClick: () => choose({ provider: entry.id, model: candidate.id, ...(candidate.reasoning?.defaultEffort === undefined ? {} : { reasoningEffort: candidate.reasoning.defaultEffort }) })
              },
                React.createElement('span', { className: 'dre-side-optionCopy' },
                  React.createElement('span', { className: 'dre-side-optionName' }, candidate.name ?? candidate.id)
                ),
                React.createElement('span', { className: 'dre-side-check' }, current?.provider === entry.id && current?.model === candidate.id ? '✓' : '')
              ))
            )))
          ),
          pane === 'effort' && (reasoning?.efforts?.length
            ? React.createElement(React.Fragment, null,
              reasoning.defaultEffort === undefined ? React.createElement('button', { type: 'button', className: 'dre-side-option', onClick: () => choose({ provider: current.provider, model: current.model }) },
                React.createElement('span', { className: 'dre-side-optionName' }, '默认'),
                React.createElement('span', { className: 'dre-side-check' }, effort === undefined ? '✓' : '')
              ) : null,
              reasoning.efforts.map((candidate) => React.createElement('button', {
                type: 'button', role: 'menuitemradio', 'aria-checked': effort === candidate.id,
                className: 'dre-side-option', key: candidate.id,
                onClick: () => choose({ provider: current.provider, model: current.model, reasoningEffort: candidate.id })
              },
                React.createElement('span', { className: 'dre-side-optionCopy' },
                  React.createElement('span', { className: 'dre-side-optionName' }, effortName(candidate)),
                  candidate.description ? React.createElement('span', { className: 'dre-side-optionDescription' }, candidate.description) : null
                ),
                React.createElement('span', { className: 'dre-side-check' }, effort === candidate.id ? '✓' : '')
              )))
            : React.createElement('div', { className: 'dre-side-empty' }, '未配置推理等级')
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
          React.createElement('span', { className: 'dre-side-chevron', 'aria-hidden': true }, open ? '^' : 'v')
        ),
        menu
      )
    }

    function ReasoningSettingsCard({ settingsStore }) {
      const snapshot = React.useSyncExternalStore(
        (listener) => settingsStore.subscribe(listener),
        () => settingsStore.getSnapshot(),
        () => settingsStore.getSnapshot()
      )
      const [expanded, setExpanded] = React.useState(false)
      const [selectedKeys, setSelectedKeys] = React.useState([])
      const [drafts, setDrafts] = React.useState({})
      const [customDraft, setCustomDraft] = React.useState('')
      const providers = providersFrom(snapshot)
      const entries = modelEntries(providers)
      const writable = snapshot.status === 'ready' && snapshot.writable !== false

      React.useEffect(() => {
        settingsStore.load().catch(() => {})
      }, [settingsStore])

      const selectedEntries = entries.filter((entry) => selectedKeys.includes(entry.key))
      const selectModel = (key) => {
        setCustomDraft('')
        setSelectedKeys((current) => current.includes(key)
          ? current.filter((value) => value !== key)
          : [...current, key])
      }

      const effortsFor = (entry) => drafts[entry.key] ?? currentEfforts(entry.model)
      const allHave = (level) => selectedEntries.length > 0 && selectedEntries.every((entry) =>
        Object.prototype.hasOwnProperty.call(effortsFor(entry), level))

      const toggleLevel = (level) => {
        if (!writable || selectedEntries.length === 0) return
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

      const selectAll = () => setSelectedKeys(entries.map((entry) => entry.key))
      const clearSelection = () => {
        setSelectedKeys([])
        setCustomDraft('')
      }

      const modelList = entries.map(({ providerId, provider, model, key }) => {
        const selected = selectedKeys.includes(key)
        return React.createElement('div', { className: 'dre-provider', key },
          React.createElement('div', { className: 'dre-providerName' }, provider.displayName || providerId),
          React.createElement('div', { className: 'dre-model' },
            React.createElement('label', null,
              React.createElement('input', {
                type: 'checkbox', checked: selected, disabled: !writable,
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
            React.createElement('span', { className: 'dre-title' }, '推理力度'),
            React.createElement('span', { className: 'dre-subtitle' }, '选择模型并批量配置等级')
          ),
          React.createElement('span', { className: 'dre-chevron', 'aria-hidden': true }, 'v')
        ),
        expanded && React.createElement('div', { className: 'dre-content' },
          snapshot.status === 'loading' && React.createElement('div', { className: 'dre-empty' }, '正在加载模型设置...'),
          snapshot.error && React.createElement('div', { className: 'dre-error' }, String(snapshot.error)),
          snapshot.status !== 'loading' && entries.length === 0 && React.createElement('div', { className: 'dre-empty' }, '未找到模型，请先在 llm-pi-ai 设置中添加模型。'),
          entries.length > 0 && React.createElement(React.Fragment, null,
            React.createElement('div', { className: 'dre-selectionBar' },
              React.createElement('span', { className: 'dre-selectionCount' }, `已选择 ${selectedEntries.length} 个模型`),
              React.createElement('button', { type: 'button', className: 'dre-smallButton', disabled: !writable, onClick: selectAll }, '全选'),
              React.createElement('button', { type: 'button', className: 'dre-smallButton', disabled: !writable || selectedEntries.length === 0, onClick: clearSelection }, '清除')
            ),
            React.createElement('div', { className: 'dre-modelList' }, modelList),
            React.createElement('div', { className: 'dre-batch' },
              React.createElement('div', { className: 'dre-batchTitle' }, '为选中模型应用等级'),
              React.createElement('div', { className: 'dre-levels' }, STANDARD_LEVELS.map(([id, label]) =>
                React.createElement('label', { className: 'dre-level', key: id },
                  React.createElement('input', {
                    type: 'checkbox', checked: allHave(id), disabled: !writable || selectedEntries.length === 0,
                    onChange: () => toggleLevel(id)
                  }), label
                )
              )),
              React.createElement('input', {
                className: 'dre-custom', type: 'text', disabled: !writable || selectedEntries.length === 0,
                placeholder: '自定义等级：id 或 id=wireValue', value: customValue(),
                onChange: (event) => setCustomDraft(event.target.value), onBlur: (event) => saveCustom(event.target.value)
              }),
              React.createElement('button', {
                type: 'button', className: 'dre-apply', disabled: !writable || selectedEntries.length === 0,
                onClick: () => applyModels(settingsStore, selectedEntries, drafts)
              }, '应用到选中模型')
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
