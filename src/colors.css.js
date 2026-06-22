import { css, prefixKeys } from "./util.js";
import { L, levels, colors } from "./constants.js";

export default css`
:where(&) {
	${ prefixKeys("--color-", colors) }
}
`;
