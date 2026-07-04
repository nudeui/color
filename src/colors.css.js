import { css, mapKeys } from "airdry/css";
import { colors } from "./index.js";

export default css`
	:where(&) {
		${mapKeys(colors, name => "--color-" + name)}
	}
`;
