import { css, calc, ife, gt } from "airdry/css";
import { l, l_inv } from "./index.js";
import { dynamicTint } from "./tints.js";

/* Tint functions for engines with @function support. Standalone: nothing here needs the
   --tint-NN variables, so this file can be loaded instead of tints.css, not just alongside it.
   Number arguments and results are untyped so they can reference the source color's channels,
   e.g. clamp(40, --tint-level(l), 60): a <number> type would reject the l keyword before it reaches oklch(from). */
export default css`
	/* Lightness (0–1) of a level (0–100) */
	@function --l(--level) {
		result: ${l("clamp(0, var(--level), 100)")};
	}

	/* Level of a lightness, snapped to the scale */
	@function --tint-level(--l) {
		result: ${l_inv("var(--l)")};
	}

	@function --tint(--color <color>, --level) returns <color> {
		--l: --l(var(--level));
		result: oklch(from var(--color) ${dynamicTint("var(--l)")});
	}

	@function --tint-lighter(--color <color>, --steps: 1) returns <color> {
		result: --tint(var(--color), --tint-level(l) + var(--steps) * 5);
	}

	@function --tint-darker(--color <color>, --steps: 1) returns <color> {
		result: --tint-lighter(var(--color), -1 * var(--steps));
	}

	/* Legible text on color: tint 40 on light colors, 100 on dark ones */
	@function --tint-text(--color <color>, --threshold: var(--l-threshold)) returns <color> {
		result: --tint(var(--color), ${calc(ife(gt("l", "var(--threshold)"), 40, 100))});
	}

	/* Base color at an absolute level, swapped to its dark counterpart when --is-dark */
	@function --tint-surface(--level, --color <color>: var(--color-base)) returns <color> {
		result: --tint(
			var(--color),
			${calc(ife("var(--is-dark)", "(100 - max(0, var(--level) - 10))", "var(--level)"))}
		);
	}
`;
