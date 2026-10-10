# Nude Color

## CSS functions

In engines that support [CSS custom functions](https://developer.mozilla.org/en-US/docs/Web/CSS/@function) (`@function`), every tint is also available as a function. Colors are returned as `oklch()`, with chroma and hue adjusted the same way as the `--tint-NN` variables.

| Function                                             | Returns                                                                               |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `--tint(color, level)`                               | `color` at `level` (0–100) on the tint scale                                          |
| `--tint-lighter(color, steps = 1)`                   | `color` moved `steps` levels up the scale                                             |
| `--tint-darker(color, steps = 1)`                    | `color` moved `steps` levels down the scale                                           |
| `--tint-text(color, threshold = var(--l-threshold))` | Legible text on `color`: tint 40 if its lightness exceeds `threshold`, else tint 100  |
| `--tint-surface(level, color = var(--color-base))`   | `color` at an absolute `level`, swapped to its dark counterpart when `--is-dark` is 1 |
| `--l(level)`                                         | Lightness (0–1) of a level                                                            |
| `--tint-level(l)`                                    | Level of a lightness, snapped to the scale                                            |

```css
background: --tint(var(--color-blue), 90);
border-color: --tint-darker(var(--color), 2);
color: --tint-text(var(--color));
background: --tint-surface(95);
```

Levels need not be on the scale, and can be derived from the source color's own channels, since they are resolved inside a relative color:

```css
background: --tint(var(--color), 42.5);
background: --tint(var(--color), max(30, --tint-level(l) - 15));
```
