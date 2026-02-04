export class TextScramble {
  private _domClass: string
  private _drawInterval: null | ReturnType<typeof setInterval> = null
  private _isRunning: boolean = true
  private _nextDelay: number
  private _oneLetterTime: number
  private _removeLetterInterval: null | ReturnType<typeof setInterval> = null
  private _sentences: string[]
  private _symbolChangeTime: number
  private _symbols: string = '!<>-_\\/[]{}—=+*^?#'

  /**
   * @param domClass - DOM class to inject
   * @param sentences - Array of sentences
   * @param symbolChangeTime - Time to switch next random symbol [ms]
   * @param oneLetterTime - Time to finish letter [ms]
   * @param nextDelay - Delay before start new sentence [ms]
   */
  constructor(
    domClass: string,
    sentences: string[],
    symbolChangeTime: number,
    oneLetterTime: number,
    nextDelay: number,
  ) {
    if (!domClass || typeof domClass !== 'string') {
      throw new Error('domClass must be a non-empty string')
    }
    if (!Array.isArray(sentences) || sentences.length === 0) {
      throw new Error('sentences must be a non-empty array')
    }

    this._domClass = domClass
    this._sentences = sentences
    this._symbolChangeTime = symbolChangeTime
    this._oneLetterTime = oneLetterTime
    this._nextDelay = nextDelay

    const el = document.querySelector('.' + this._domClass)
    if (!el) {
      throw new Error(`Element with class "${this._domClass}" not found`)
    }

    this._infiniteIterOverTexts(el)
  }

  _nextArrayElementInLoop<T>(array: T[], currentIndex: number): T {
    const nextIndex = (currentIndex + 1) % array.length
    return array[nextIndex]
  }

  destroy(): void {
    this._isRunning = false

    if (this._drawInterval) {
      clearInterval(this._drawInterval)
      this._drawInterval = null
    }

    if (this._removeLetterInterval) {
      clearInterval(this._removeLetterInterval)
      this._removeLetterInterval = null
    }

    const el = document.querySelector('.' + this._domClass)
    if (el) {
      while (el.firstChild) {
        el.removeChild(el.firstChild)
      }
    }
  }

  private _delay(ms: number): Promise<void> {
    return new Promise(res => setTimeout(res, ms))
  }

  private _drawSentence(text: string, childs: HTMLElement[]): void {
    let currentLetter = 0

    this._drawInterval = setInterval(() => {
      this._fillSpanWithSymbol(childs)
    }, this._symbolChangeTime)

    this._removeLetterInterval = setInterval(() => {
      if (childs.length > 0) {
        childs[0].innerHTML = text[currentLetter]
        currentLetter += 1
        childs.shift()
      }
      if (childs.length === 0) {
        if (this._drawInterval) clearInterval(this._drawInterval)
        if (this._removeLetterInterval) clearInterval(this._removeLetterInterval)
      }
    }, this._oneLetterTime)
  }

  private _fillSpanWithSymbol(childs: HTMLElement[]): void {
    if (childs.length > 0) {
      this._randomArrayItem(childs).innerText = this._randomArrayItem(this._symbols.split(''))
    }
  }

  private async _infiniteIterOverTexts(el: Element): Promise<void> {
    let currentTextIndex = 0

    while (this._isRunning) {
      const text = this._nextArrayElementInLoop(this._sentences, currentTextIndex)
      currentTextIndex = this._sentences.indexOf(text)

      text.split('').forEach(() => {
        const child = document.createElement('span')
        el.appendChild(child)
      })

      const childs = Array.from(
        document.querySelectorAll('.' + this._domClass + ' > span'),
      ) as HTMLElement[]
      this._drawSentence(text, childs)

      await this._delay(childs.length * this._oneLetterTime + this._nextDelay)

      while (el.firstChild) {
        el.removeChild(el.firstChild)
      }
    }
  }

  private _randomArrayItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
  }
}

export default TextScramble
