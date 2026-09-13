import { css } from "airdry/css";
import { levels } from "./index.js";
export { template } from "./util.js";
import { defineTint, dynamicTint } from "./tints.js";

export default css`
	/* Lightnesses for each tint */
	${defineTint("core")}

	${levels.map(LL => defineTint(LL))}
`;

export const end = css`
	/* --tint(color, l): the tint of color at lightness l (0–1), for engines with CSS functions.
	   --l is untyped so it can reference the source color's channels, e.g. clamp(.4, l, .6):
	   a <number> type would reject the l keyword before it reaches the oklch(from) below. */
	@function --tint(--color <color>, --l) returns <color> {
		result: oklch(from var(--color) ${dynamicTint("var(--l)")});
	}
`;
