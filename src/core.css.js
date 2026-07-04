import { css, gt, round, ife, calc } from "airdry/css";
import { l, l_inv } from "./index.js";
import { dynamicTint } from "./tints.css.js";
export { template } from "./util.js";

function tint_if (condition, tint_true, tint_false) {
	return [..."lch"]
		.map(c =>
			ife(condition, `var(--${c}-${tint_true}, ${c})`, `var(--${c}-${tint_false}, ${c})`))
		.map(c => calc(c))
		.join(" ");
}

export default css`
	--l-threshold: 0.7;
	--tint-text: ${tint_if(gt("l", "var(--l-threshold)"), 40, 100)};

	--l-darker: ${l(`${l_inv("l")} - 5`)};
	--l-lighter: ${l(`${l_inv("l")} + 5`)};
	--tint-darker: ${dynamicTint("var(--l-darker)")};
	--tint-lighter: ${dynamicTint("var(--l-lighter)")};
`;
