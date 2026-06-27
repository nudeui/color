import { css, map } from "airdry/css";
import { c, h, pad } from "./tints.css.js";
import { L, levels } from "./index.js";
export { template } from "./util.js";

export const properties = {
	// Surface depth as a plain number (the "level" on the tint scale). Inherits so wrappers carry
	// it down; a nested surface descends in level space via `calc(... + var(--step))`.
	levelSurface: { syntax: "<number>", inherits: true, initial: 100 },
	colorWhite: { syntax: "<color>", initial: "white" },
};

// `--step` is a step in LEVEL space, not lightness: −5 in light mode, +5 in dark, so "deeper"
// means darker on light and lighter on dark. The level → lightness map uses the real tint scale,
// and c/h follow from that lightness (reusing the tints.css recipes), so we never tabulate c/h.
const offsets = [-1, 0, 1, 2, 3];
function relativeTints () {
	return offsets
		.map(k => {
			let name = k === 0 ? "--tint-surface" : `--tint-surface-${k}`;
			// clamp so offsets past the ends of the scale stay at the nearest tint, not off-grid
			// (an off-grid level has no `map()` match and would resolve to 0 → black).
			let level = `clamp(0, var(--level-surface) + ${k} * var(--step), 100)`;
			let lightness = `--l-surface-${k}`;
			return css`
				${lightness}: calc(${map(level, L)});
				${name}: var(${lightness}) ${c(`var(${lightness})`)} ${h(`var(${lightness})`)};
			`;
		})
		.join("\n");
}

// Absolute, mode-flipped surface tints: `--tint-surface-NN` is the tint at level NN, flipped in
// dark mode so high-contrast roles (text, etc.) stay readable regardless of surface. Padded to 2
// digits to stay distinct from the relative offsets above (`--tint-surface-10` ≠ `--tint-surface-1`).
function absoluteTints ({ dark = false } = {}) {
	return levels
		.map(LL => {
			let from = dark ? 100 - Math.max(0, LL - 10) : LL;
			return `--tint-surface-${pad(LL)}: var(--tint-${pad(from)});`;
		})
		.join("\n");
}

// Maintain `--level-surface-parent` = the nearest surface ancestor's level, via one container style
// query per level. The query condition is the one ancestor-read that escapes the custom-property
// dependency cycle, so a nested surface can then descend with
// `--level-surface: calc(var(--level-surface-parent) + var(--step))`.
function parentLadder () {
	return levels
		.map(
			LL => css`
				@container style(--level-surface: ${LL}) {
					--level-surface-parent: ${LL};
				}
			`,
		)
		.join("\n");
}

export default css`
	--color-base: var(--color-gray);
	--color-accent: var(--color-blue);

	--is-system-dark: 0;
	--is-dark: 0;
	--level-surface: 100;
	--step: -5;
	${absoluteTints()}

	@media (prefers-color-scheme: dark) {
		--is-system-dark: 1;
		--is-dark: 1;
		--level-surface: 10;
		--step: 5;
		${absoluteTints({ dark: true })}
	}
`;

export const end = css`
	body {
		@container style(--color-white: light-dark(black, white)) {
			--is-dark: 1;
		}
	}
	/* NOTE relative tints + ladder run on every element; scope to surfaces if it ever shows up in perf. */
	* {
		${relativeTints()}
		${parentLadder()}
	}
`;
