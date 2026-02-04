<div align="center">

# Text scramble effect

![](https://img.shields.io/npm/v/@twistezo/text-scramble?style=flat-square&color=9cf)
![](https://img.shields.io/npm/dt/@twistezo/text-scramble?style=flat-square&color=9cf)
![](https://img.shields.io/npm/l/@twistezo/text-scramble?style=flat-square&color=yellow)

</div>

- TypeScript support
- lightweight
- ESM and CJS support

## Examples

- [Local examples](./examples/)

## Setup

```bash
npm install @twistezo/text-scramble
```

## Usage

### HTML

```html
<div class="scramble">
  <span class="scramble__blinker">_</span>
  <span class="scramble__text"></span>
</div>
```

### SCSS

```scss
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

### JavaScript

```ts
import TextScramble from '@twistezo/text-scramble'

const scramble = new TextScramble(
  'scramble__text',
  ['Lorem ipsum 1', 'Lorem ipsum 2', 'Lorem ipsum 3'],
  5,
  100,
  1500,
)

// To stop the animation and cleanup:
scramble.destroy()
```

### `TextScramble` constructor arguments

```ts
/**
 * @param domClass - DOM class to inject
 * @param sentences - Array of sentences
 * @param symbolChangeTime - Time to switch next random symbol [ms]
 * @param oneLetterTime - Time to finish letter [ms]
 * @param nextDelay - Delay before start new sentence [ms]
 */
```

### Methods

- `destroy()` - stops the animation, clears intervals and removes DOM children

## Development

```
bun run example     # run examples
bun run build       # build all formats

bun run test        # run all tests
bun run lint        # check lint
bun run lint:fix    # fix lint & format
bun run typecheck   # check types

bunx npm login      # login to npm
bun publish         # publish to npm
```
