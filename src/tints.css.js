import { css, progress, pow, vars, ref, max, or, ife, ifs, sop, map } from "airdry/css";
import { levels, l, c, h } from "./index.js";
export { template, pad } from "./util.js";

// Curvature factors for chroma
export const chroma = {
	exp: { lighter: 2, darker: 1.2 },
};

export const hue = {
	shifts: {
		yellows: {
			band: { center: 84, extent: 27, exp: 1.5 },
			darker: { max: -43, exp: 0.4 },
			lighter: { max: 11, exp: 0.4 },
		},
	},
};

export function tint (LL) {
	return css`var(--l-${pad(LL)}, l) var(--c-${pad(LL)}, c) var(--h-${pad(LL)}, h)`;
}

export function defineTint (LL) {
	return css`
		--l-${pad(LL)}: ${l(LL)};
		--c-${pad(LL)}: ${c(LL)};
		--h-${pad(LL)}: ${h(LL)};
		--tint-${pad(LL)}: ${tint(LL)};
	`;
}

export default css`
	/* Lightnesses for each tint */
	${defineTint("core")}

	${levels.map(LL => defineTint(LL))}
`;
