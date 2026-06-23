import { css, mapKeys } from "airdry/css";
import { L, levels, colors } from "./constants.js";

export default css`
:where(&) {
	${ mapKeys(colors, name => "--color-" + name) }
}
`;
