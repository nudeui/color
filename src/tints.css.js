import { css } from "airdry/css";
import { levels, l, l_inv } from "./index.js";
export { template } from "./util.js";
import { defineTint, dynamicTint } from "./tints.js";

export default css`
	/* Lightnesses for each tint */
	${defineTint("core")}

	${levels.map(LL => defineTint(LL))}
`;

export const end = css`
	/* Functions for engines with CSS functions.
	   Number arguments and results are untyped so they can reference the source color's channels,
	   e.g. clamp(.4, l, .6): a <number> type would reject the l keyword before it reaches oklch(from). */

	/* Lightness (0–1) of a level (0–100) */
	@function --l(--level) {
		result: ${l("clamp(0, var(--level), 100)")};
	}

	/* Level of a lightness, snapped to the scale */
	@function --level(--l) {
		result: ${l_inv("var(--l)")};
	}

	@function --tint(--color <color>, --l) returns <color> {
		result: oklch(from var(--color) ${dynamicTint("var(--l)")});
	}

	@function --tint-level(--color <color>, --level) returns <color> {
		result: --tint(var(--color), --l(var(--level)));
	}

	@function --tint-lighter(--color <color>, --steps: 1) returns <color> {
		result: --tint-level(var(--color), --level(l) + var(--steps) * 5);
	}

	@function --tint-darker(--color <color>, --steps: 1) returns <color> {
		result: --tint-lighter(var(--color), -1 * var(--steps));
	}
`;
