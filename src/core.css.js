import { css, gt, round, ife, calc } from "airdry/css";
import { l, l_inv } from "./index.js";
import { dynamicTint, tint_ife } from "./tints.js";
export { template } from "./util.js";

export default css`
	--l-threshold: 0.7;
	--tint-text: ${tint_ife(gt("l", "var(--l-threshold)"), 40, 100)};

	--l-darker: ${l(`${l_inv("l")} - 5`)};
	--l-lighter: ${l(`${l_inv("l")} + 5`)};
	--tint-darker: ${dynamicTint("var(--l-darker)")};
	--tint-lighter: ${dynamicTint("var(--l-lighter)")};
`;

export const end = css`
	/* Legible text on color: tint 40 on light colors, 100 on dark ones */
	@function --tint-text(--color <color>, --threshold: var(--l-threshold)) returns <color> {
		result: --tint(var(--color), ${calc(ife(gt("l", "var(--threshold)"), 40, 100))});
	}
`;
