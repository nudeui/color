import { css, ife, calc } from "airdry/css";
import { levels, l, c, h, pad } from "./index.js";

export function tint (suffix) {
	if (typeof suffix === "number") {
		suffix = pad(suffix);
	}

	return /* css */ `var(--l-${suffix}, l) var(--c-${suffix}, c) var(--h-${suffix}, h)`;
}

export function dynamicTint (l) {
	return `${l} ${c(l)} ${h(l)}`;
}

export function defineTint (level) {
	const padLL = pad(level);
	return css`
		--l-${padLL}: ${l(level)};
		--c-${padLL}: ${c(level)};
		--h-${padLL}: ${h(level)};
		--tint-${padLL}: ${tint(level)};
	`;
}

export function tint_ife (condition, tint_true, tint_false) {
	return [..."lch"]
		.map(c =>
			ife(condition, `var(--${c}-${tint_true}, ${c})`, `var(--${c}-${tint_false}, ${c})`))
		.map(c => calc(c))
		.join(" ");
}
