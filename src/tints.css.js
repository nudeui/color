import { css } from "airdry/css";
import { levels, l, c, h, pad } from "./index.js";
export { template } from "./util.js";

export function tint (suffix) {
	if (typeof suffix === "number") {
		suffix = pad(suffix);
	}

	return /* css */ `var(--l-${suffix}, l) var(--c-${suffix}, c) var(--h-${suffix}, h)`;
}

export function dynamicTint (l) {
	return `${l} ${c(l)} ${h(l)}`;
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
