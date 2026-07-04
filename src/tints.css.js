import { css } from "airdry/css";
import { levels, l, c, h, pad } from "./index.js";
export { template } from "./util.js";

export function tint (LL) {
	return css`var(--l-${pad(LL)}, l) var(--c-${pad(LL)}, c) var(--h-${pad(LL)}, h)`;
}

export function defineTint (LL) {
	const padLL = pad(LL);
	return css`
		--l-${padLL}: ${l(LL)};
		--c-${padLL}: ${c(LL)};
		--h-${padLL}: ${h(LL)};
		--tint-${padLL}: ${tint(LL)};
	`;
}

export default css`
	/* Lightnesses for each tint */
	${defineTint("core")}

	${levels.map(LL => defineTint(LL))}
`;
