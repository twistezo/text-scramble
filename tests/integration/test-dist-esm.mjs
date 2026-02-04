import { JSDOM } from 'jsdom'

// Setup DOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body><div class="scramble__text"></div></body></html>')
global.document = dom.window.document

const { default: DefaultExport, TextScramble } = await import('../../dist/esm/index.mjs')

let allPassed = true

// Test 1: Named export works
try {
  const scramble = new TextScramble('scramble__text', ['Hello', 'World'], 5, 100, 1500)
  console.log('named-export:', scramble instanceof TextScramble)
  if (!(scramble instanceof TextScramble)) allPassed = false
  scramble.destroy()
} catch (e) {
  console.log('named-export: fail -', String(e))
  allPassed = false
}

// Test 2: Default export works
try {
  const scramble = new DefaultExport('scramble__text', ['Test'], 5, 100, 1500)
  console.log('default-export:', scramble instanceof DefaultExport)
  if (!(scramble instanceof DefaultExport)) allPassed = false
  scramble.destroy()
} catch (e) {
  console.log('default-export: fail -', String(e))
  allPassed = false
}

// Test 3: Constructor accepts all 5 arguments (backward compatibility)
try {
  const scramble = new TextScramble('scramble__text', ['A', 'B', 'C'], 10, 200, 3000)
  const isValid =
    scramble._symbolChangeTime === 10 &&
    scramble._oneLetterTime === 200 &&
    scramble._nextDelay === 3000
  console.log('constructor-args:', isValid)
  if (!isValid) allPassed = false
  scramble.destroy()
} catch (e) {
  console.log('constructor-args: fail -', String(e))
  allPassed = false
}

// Test 4: destroy() method exists and works
try {
  const scramble = new TextScramble('scramble__text', ['Test'], 5, 100, 1500)
  scramble.destroy()
  const destroyed = scramble._isRunning === false
  console.log('destroy-method:', destroyed)
  if (!destroyed) allPassed = false
} catch (e) {
  console.log('destroy-method: fail -', String(e))
  allPassed = false
}

// Test 5: Validation throws on empty domClass
try {
  new TextScramble('', ['Test'], 5, 100, 1500)
  console.log('validation-domClass: fail')
  allPassed = false
} catch (e) {
  const passed = String(e).includes('domClass must be a non-empty string')
  console.log('validation-domClass:', passed)
  if (!passed) allPassed = false
}

// Test 6: Validation throws on empty sentences
try {
  new TextScramble('scramble__text', [], 5, 100, 1500)
  console.log('validation-sentences: fail')
  allPassed = false
} catch (e) {
  const passed = String(e).includes('sentences must be a non-empty array')
  console.log('validation-sentences:', passed)
  if (!passed) allPassed = false
}

// Test 7: Validation throws when DOM element not found
try {
  new TextScramble('nonexistent-class', ['Test'], 5, 100, 1500)
  console.log('validation-dom: fail')
  allPassed = false
} catch (e) {
  const passed = String(e).includes('not found')
  console.log('validation-dom:', passed)
  if (!passed) allPassed = false
}

console.log('---')
console.log('ESM integration tests:', allPassed ? 'PASSED' : 'FAILED')

process.exit(allPassed ? 0 : 1)
