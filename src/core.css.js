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
