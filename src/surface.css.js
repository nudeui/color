import { css, map, ife } from "airdry/css";
import { c, h, pad } from "./tints.css.js";
import { L, levels } from "./index.js";
export { template } from "./util.js";

export const properties = {
	// Surface depth as a level on the tint scale; nested surfaces descend via calc(... + --level-step).
	levelSurface: { syntax: "<number>", inherits: true, initial: 100 },
	// Compared to light-dark(black, white) in the dark query below; not canvastext (Safari doesn't
	// resolve system colors in style queries, Chrome freezes them).
	colorWhite: { syntax: "<color>", initial: "white" },
	// Public 0/1 dark-mode knob, auto-set by @media + the dark query — but that query freezes at load,
	// so set it yourself on a runtime color-scheme toggle.
	isDark: { syntax: "<number>", inherits: true, initial: 0 },
};

export default css`
	--color-base: var(--color-gray);
	--color-accent: var(--color-blue);

	/* explicit (not just the @property initial) so the dark query below matches it */
	--color-white: white;
	--is-system-dark: 0;

	@media (prefers-color-scheme: dark) {
		--is-system-dark: 1;
		--is-dark: 1;
	}
`;

const offsets = [-1, 0, 1, 2, 3];

export const end = css`
	body {
		/* Catches an explicit color-scheme too, not just OS (light-dark = white only in dark = --color-white).
		   NOTE Chrome freezes it at load: a runtime toggle won't re-flip until reload. */
		@container style(--color-white: light-dark(black, white)) {
			--is-dark: 1;
		}
		--level-surface: calc(${ife("var(--is-dark)", 10, 100)});
		--level-step: calc(${ife("var(--is-dark)", 5, -5)});

		/* Absolute tints: --tint-surface-NN is level NN, swapped to its dark counterpart when --is-dark. */
		${levels.map(LL => {
			let flip = 100 - Math.max(0, LL - 10);
			let pick = comp =>
				`calc(${ife("var(--is-dark)", `var(--${comp}-${pad(flip)})`, `var(--${comp}-${pad(LL)})`)})`;
			return `--tint-surface-${pad(LL)}: ${pick("l")} ${pick("c")} ${pick("h")};`;
		})}
	}
	/* runs on every element; scope to surfaces if perf shows */
	* {
		/* Relative tints: --tint-surface is the current level, --tint-surface-N is N deeper (neg = lighter);
		   clamp keeps off-the-end offsets on-grid (off-grid → no map() match → 0 → black). */
		${offsets.map(k => {
			let sk = k === 0 ? "" : `-${k}`;
			let stash =
				k === 0
					? ""
					: `--level-surface${sk}: clamp(0, calc(var(--level-surface) + ${k} * var(--level-step)), 100);`;
			return css`
					${stash}
					--l-surface${sk}: calc(${map(`var(--level-surface${sk})`, L)});
					--tint-surface${sk}: var(--l-surface${sk}) ${c(`var(--l-surface${sk})`)} ${h(`var(--l-surface${sk})`)};
				`;
		})}

		/* parent ladder: publish this element's level for children to read */
		${levels.map(
			LL => css`
				@container style(--level-surface: ${LL}) {
					--level-surface-parent: ${LL};
				}
			`,
		)}

		/* level N steps below the parent — parent-relative, so it's safe to assign to --level-surface */
		${[1, 2, 3].map(
			n =>
				`--level-surface-parent-${n}: clamp(0, calc(var(--level-surface-parent) + ${n} * var(--level-step)), 100);`,
		)}
	}
`;
