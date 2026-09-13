# Nude Color


## CSS functions

In engines that support [CSS custom functions](https://developer.mozilla.org/en-US/docs/Web/CSS/@function) (`@function`), every tint is also available as a function. Colors are returned as `oklch()`, with chroma and hue adjusted the same way as the `--tint-NN` variables.

| Function | Returns |
|---|---|
| `--tint(color, l)` | `color` at OKLCH lightness `l` (0–1) |
| `--tint-level(color, level)` | `color` at `level` (0–100) on the tint scale |
| `--tint-lighter(color, steps = 1)` | `color` moved `steps` levels up the scale |
| `--tint-darker(color, steps = 1)` | `color` moved `steps` levels down the scale |
| `--tint-text(color, threshold = var(--l-threshold))` | Legible text on `color`: tint 40 if its lightness exceeds `threshold`, else tint 100 |
| `--tint-surface(level, color = var(--color-base))` | `color` at an absolute `level`, swapped to its dark counterpart when `--is-dark` is 1 |
| `--l(level)` | Lightness of a level |
| `--level(l)` | Level of a lightness, snapped to the scale |

```css
background: --tint-level(var(--color-blue), 90);
border-color: --tint-darker(var(--color), 2);
color: --tint-text(var(--color));
background: --tint-surface(95);
```

Lightness and level arguments can be derived from the source color's own channels, since they are resolved inside a relative color:

```css
background: --tint(var(--color), clamp(0.4, l, 0.6));
background: --tint-level(var(--color), max(30, --level(l) - 15));
```
