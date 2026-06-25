import { css, gt, ife } from "airdry/css";
import { tint_if } from "./util.js";

export default css`
	:where(&) {
		--l-threshold: 0.7;
		--tint-text: ${tint_if(gt("l", "var(--l-threshold)"), 40, 100)};
	}
`;
