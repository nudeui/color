# Nude Color


## `--tint()` function

In engines that support [CSS custom functions](https://developer.mozilla.org/en-US/docs/Web/CSS/@function) (`@function`), `--tint(color, l)` returns the tint of `color` at OKLCH lightness `l` (0–1), with chroma and hue adjusted the same way as the `--tint-NN` variables:

```css
background: --tint(var(--color-blue), 0.9);
background: --tint(var(--color-blue), var(--l-40)); /* same as oklch(from var(--color-blue) var(--tint-40)) */
```

`l` can be derived from the source color's own channels, since it is resolved inside a relative color:

```css
background: --tint(var(--color), clamp(0.4, l, 0.6));
color: --tint(var(--color), calc(l / 2));
```
