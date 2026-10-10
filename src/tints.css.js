import { css } from "airdry/css";
import { levels } from "./index.js";
export { template } from "./util.js";
import { defineTint } from "./tints.js";

export default css`
	/* Lightnesses for each tint */
	${defineTint("core")}

	${levels.map(LL => defineTint(LL))}
`;
