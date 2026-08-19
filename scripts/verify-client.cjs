const assert = require('node:assert/strict')
const fs = require('node:fs')
const vm = require('node:vm')

const source = fs.readFileSync('dist/client.js', 'utf8')
assert(!source.includes('line truncated to 2000 chars'))
assert(source.includes('.dre-side-option{display:flex'))

let definition
const documentStub = {
  getElementById: () => null,
  createElement: () => ({}),
  head: { append: () => {} }
}

function createHookRunner() {
  const state = []
  let cursor = 0
  const React = {
    Fragment: Symbol('Fragment'),
    createElement(type, props, ...children) {
      return { type, props: props ?? {}, children }
    },
    useSyncExternalStore(_subscribe, getSnapshot) {
      return getSnapshot()
    },
    useState(initialValue) {
      const index = cursor++
      if (!(index in state)) state[index] = initialValue
      return [state[index], (value) => {
        state[index] = typeof value === 'function' ? value(state[index]) : value
      }]
    },
    useRef(initialValue) {
      return { current: initialValue }
    },
    useEffect() {},
    useLayoutEffect() {}
  }
  return {
    React,
    render(Component, props) {
      cursor = 0
      return Component(props)
    }
  }
}

function descendants(node, result = []) {
  if (node == null || node === false || typeof node !== 'object') return result
  if (Array.isArray(node)) {
    for (const child of node) descendants(child, result)
    return result
  }
  result.push(node)
  descendants(node.children, result)
  return result
}

function textOf(node) {
  if (node == null || node === false) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  return textOf(node.children)
}

function byClass(tree, className) {
  return descendants(tree).find((node) => String(node.props?.className ?? '').split(' ').includes(className))
}

function deferred() {
  let resolve
  let reject
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise
    reject = rejectPromise
  })
  return { promise, resolve, reject }
}

async function main() {
const runner = createHookRunner()
vm.runInNewContext(source, {
  window: { __ModuleLoader__: { load: (value) => { definition = value } } },
  document: documentStub,
  console,
  Promise,
  Map,
  Set
})
assert.equal(definition?.id, 'dsh-plugin-reasoning-effort')

const plugin = definition.factory((id) => {
  assert.equal(id, 'react')
  return runner.React
})

let saveResult = Promise.resolve()
let savedKey
let savedValue
const settingsStore = {
  getSnapshot: () => ({
    status: 'ready',
    writable: true,
    value: {
      providers: {
        test: {
          displayName: 'Test provider',
          models: [{ id: 'model-1', name: 'Model One' }]
        }
      }
    }
  }),
  subscribe: () => () => {},
  load: () => Promise.resolve(),
  set: (key, value) => {
    savedKey = key
    savedValue = value
    return saveResult
  }
}

let SettingsCard
plugin.apply({
  effect() {},
  settingsScope: { bind: () => settingsStore },
  modelDirectories: { directoryFor: () => ({}) },
  sessions: { subagentAddress: () => undefined },
  slots: {
    inject(_name, factory) { factory() },
    register(options, component) {
      if (options.name === 'settings.plugin.item') SettingsCard = component
      return component
    }
  }
})
assert.equal(typeof SettingsCard, 'function')

const render = () => runner.render(SettingsCard, { settingsStore })
let tree = render()
byClass(tree, 'dre-header').props.onClick()
tree = render()
const modelCheckbox = descendants(tree).find((node) => node.type === 'input' && node.props.type === 'checkbox')
assert(modelCheckbox)
modelCheckbox.props.onChange()
tree = render()

let pending = deferred()
saveResult = pending.promise
let applyButton = byClass(tree, 'dre-apply')
const savePromise = applyButton.props.onClick()
tree = render()
applyButton = byClass(tree, 'dre-apply')
assert.equal(applyButton.props.disabled, true)
assert.equal(textOf(applyButton), '正在应用...')
assert.equal(textOf(byClass(tree, 'dre-applyStatus')), '正在保存模型设置...')
assert.equal(savedKey, 'providers')
assert.equal(savedValue.test.models[0].id, 'model-1')
pending.resolve()
await savePromise
tree = render()
assert.equal(textOf(byClass(tree, 'dre-apply')), '已应用')
assert.equal(textOf(byClass(tree, 'dre-applyStatus')), '已应用到 1 个模型')
assert.equal(byClass(tree, 'dre-applyStatus').props.role, 'status')
assert.equal(byClass(tree, 'dre-applyStatus').props['aria-live'], 'polite')

const checkboxes = descendants(tree).filter((node) => node.type === 'input' && node.props.type === 'checkbox')
checkboxes[1].props.onChange()
tree = render()
assert.equal(textOf(byClass(tree, 'dre-applyStatus')), '')

saveResult = Promise.reject(new Error('save failed'))
const originalError = console.error
console.error = () => {}
await byClass(tree, 'dre-apply').props.onClick()
console.error = originalError
tree = render()
assert.equal(textOf(byClass(tree, 'dre-applyStatus')), '应用失败，请重试')
assert(String(byClass(tree, 'dre-applyStatus').props.className).includes('dre-applyStatusError'))

console.log('client registration, styles, and apply feedback verified')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
