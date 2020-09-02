# Text scramble effect

## Install

```
npm install @twistezo/text-scramble

or

yarn add @twistezo/text-scramble
```

## Usage

```html
<!-- HTML file -->
<div class="scramble">
  <span class="scramble__blinker">_</span>
  <span class="scramble__text"></span>
</div>
```

```scss
// SCSS file
.scramble {
  &__blinker {
    animation: blinker 0.5s cubic-bezier(0.5, 0, 1, 1) infinite alternate;
    @keyframes blinker {
      to {
        opacity: 0;
      }
    }
  }

  &__text {
  }
}
```

```js
// JavaScript file
import TextScramble from '@twistezo/text-scramble'

new TextScramble(
  'scramble__text',
  ['Lorem ipsum 1', 'Lorem ipsum 2', 'Lorem ipsum 3'],
  5,
  100,
  1500
)
```

`TextScramble` constructor arguments:

```js
/**
 * @param {string} domClass - DOM class to inject
 * @param {String[]} sentences - Array of sentences
 * @param {number} symbolChangeTime - Time to switch next random symbol [ms]
 * @param {number} oneLetterTime - Time to finish letter [ms]
 * @param {number} nextDelay - Delay beofre start new sentence [ms]
 */
```
