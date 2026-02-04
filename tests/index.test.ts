import { afterEach, beforeEach, describe, expect, test } from 'bun:test'

import TextScramble from '../src/index'

describe('TextScramble', () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement('div')
    container.className = 'scramble__text'
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('constructor - backward compatibility', () => {
    test('should accept 5 positional arguments like original API', () => {
      // Original usage: new TextScramble(domClass, sentences, symbolChangeTime, oneLetterTime, nextDelay)
      const scramble = new TextScramble('scramble__text', ['Hello', 'World'], 5, 100, 1500)
      expect(scramble).toBeInstanceOf(TextScramble)
      scramble.destroy()
    })

    test('should work with single sentence array', () => {
      const scramble = new TextScramble('scramble__text', ['Single'], 5, 100, 1500)
      expect(scramble).toBeInstanceOf(TextScramble)
      scramble.destroy()
    })

    test('should work with many sentences', () => {
      const sentences = ['First', 'Second', 'Third', 'Fourth', 'Fifth']
      const scramble = new TextScramble('scramble__text', sentences, 5, 100, 1500)
      expect(scramble).toBeInstanceOf(TextScramble)
      scramble.destroy()
    })
  })

  describe('constructor validation', () => {
    test('should throw error when domClass is empty', () => {
      expect(() => {
        new TextScramble('', ['test'], 5, 100, 1500)
      }).toThrow('domClass must be a non-empty string')
    })

    test('should throw error when domClass is not a string', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new TextScramble(123, ['test'], 5, 100, 1500)
      }).toThrow('domClass must be a non-empty string')
    })

    test('should throw error when sentences is not an array', () => {
      expect(() => {
        // @ts-expect-error Testing invalid input
        new TextScramble('scramble__text', 'not an array', 5, 100, 1500)
      }).toThrow('sentences must be a non-empty array')
    })

    test('should throw error when sentences is empty array', () => {
      expect(() => {
        new TextScramble('scramble__text', [], 5, 100, 1500)
      }).toThrow('sentences must be a non-empty array')
    })

    test('should throw error when DOM element not found', () => {
      document.body.innerHTML = ''
      expect(() => {
        new TextScramble('nonexistent', ['test'], 5, 100, 1500)
      }).toThrow('Element with class "nonexistent" not found')
    })
  })

  describe('_nextArrayElementInLoop - sentence cycling', () => {
    let scramble: TextScramble

    beforeEach(() => {
      scramble = new TextScramble('scramble__text', ['test'], 5, 100, 1500)
    })

    afterEach(() => {
      scramble.destroy()
    })

    test('should cycle through sentences in order', () => {
      const sentences = ['First', 'Second', 'Third']

      // Starting from index 0, next should be 'Second' (index 1)
      expect(scramble._nextArrayElementInLoop(sentences, 0)).toBe('Second')

      // From index 1, next should be 'Third' (index 2)
      expect(scramble._nextArrayElementInLoop(sentences, 1)).toBe('Third')

      // From index 2, should wrap to 'First' (index 0)
      expect(scramble._nextArrayElementInLoop(sentences, 2)).toBe('First')
    })

    test('should handle single element array', () => {
      const sentences = ['Only']
      expect(scramble._nextArrayElementInLoop(sentences, 0)).toBe('Only')
    })

    test('should handle two element array', () => {
      const sentences = ['A', 'B']
      expect(scramble._nextArrayElementInLoop(sentences, 0)).toBe('B')
      expect(scramble._nextArrayElementInLoop(sentences, 1)).toBe('A')
    })
  })

  describe('destroy', () => {
    test('should stop the animation loop', () => {
      const scramble = new TextScramble('scramble__text', ['Hello'], 5, 100, 1500)

      expect(scramble['_isRunning']).toBe(true)
      scramble.destroy()
      expect(scramble['_isRunning']).toBe(false)
    })

    test('should clear all intervals', () => {
      const scramble = new TextScramble('scramble__text', ['Hello'], 5, 100, 1500)

      scramble.destroy()

      expect(scramble['_drawInterval']).toBeNull()
      expect(scramble['_removeLetterInterval']).toBeNull()
    })

    test('should remove all created span elements from DOM', () => {
      const scramble = new TextScramble('scramble__text', ['Hello'], 5, 100, 1500)

      scramble.destroy()

      expect(container.children.length).toBe(0)
    })

    test('should be safe to call multiple times', () => {
      const scramble = new TextScramble('scramble__text', ['Hello'], 5, 100, 1500)

      scramble.destroy()
      scramble.destroy()
      scramble.destroy()

      expect(scramble['_isRunning']).toBe(false)
    })
  })

  describe('animation behavior', () => {
    test('should create one span element per letter in sentence', async () => {
      const scramble = new TextScramble('scramble__text', ['Hi'], 5, 100, 1500)

      // Wait for spans to be created
      await new Promise(resolve => setTimeout(resolve, 10))

      // "Hi" has 2 letters, so 2 spans
      expect(container.children.length).toBe(2)

      scramble.destroy()
    })

    test('should create spans for longer sentences', async () => {
      const scramble = new TextScramble('scramble__text', ['Hello World'], 5, 100, 1500)

      await new Promise(resolve => setTimeout(resolve, 10))

      // "Hello World" has 11 characters including space
      expect(container.children.length).toBe(11)

      scramble.destroy()
    })

    test('should fill spans with random symbols from symbol set', async () => {
      const scramble = new TextScramble('scramble__text', ['ABC'], 5, 100, 1500)
      const symbols = '!<>-_\\/[]{}—=+*^?#'

      await new Promise(resolve => setTimeout(resolve, 20))

      const spans = container.querySelectorAll('span')
      let hasSymbolOrLetter = false

      spans.forEach(span => {
        const text = span.textContent || ''
        // Should contain either a symbol or a letter from the sentence
        if (symbols.includes(text) || 'ABC'.includes(text) || text === '') {
          hasSymbolOrLetter = true
        }
      })

      expect(hasSymbolOrLetter).toBe(true)

      scramble.destroy()
    })

    test('should eventually reveal letters of the sentence', async () => {
      const sentence = 'Hi'
      const scramble = new TextScramble('scramble__text', [sentence], 5, 50, 5000)

      // Wait for first letter to be revealed (oneLetterTime = 50ms)
      await new Promise(resolve => setTimeout(resolve, 60))

      const spans = container.querySelectorAll('span')
      // First letter should be revealed
      expect(spans[0].textContent).toBe('H')

      scramble.destroy()
    })
  })

  describe('default export compatibility', () => {
    test('should be importable as default export', async () => {
      const { default: DefaultTextScramble } = await import('../src/index')
      expect(DefaultTextScramble).toBe(TextScramble)
    })

    test('should be importable as named export', async () => {
      const { TextScramble: NamedTextScramble } = await import('../src/index')
      expect(NamedTextScramble).toBe(TextScramble)
    })
  })
})
