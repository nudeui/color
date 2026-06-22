import { css } from "./util.js";
import { L, levels, colors } from "./constants.js";

export default `
:where(&) {
	${
		Object.entries(colors).map(([name, color])=> `--color-${name}: ${color};`)
	}
}
`;
