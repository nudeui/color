import { css, progress, pow, vars, ref, max, or, ife, ifs, sop, map } from "airdry/css";
import { L, levels, levelsChromatic } from "./index.js";
export { template } from "./util.js";

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

// Pad numeric levels to 2 digits so the scale is unambiguous: --tint-00, --tint-05, … --tint-100.
// (Disambiguates absolute levels like --tint-surface-10 from relative offsets like --tint-surface-1.)
export const pad = LL => (typeof LL === "number" ? String(LL).padStart(2, "0") : LL);
const getL = LL => (typeof LL === "number" ? `var(--l-${pad(LL)})` : LL);
const progress_dark = LL => progress(getL(LL), "l", 0);
const progress_light = LL => progress(getL(LL), "l", 1);

export function l (LL) {
	if (LL === "core") {
		return "l";
	}
	return L[LL];
}

export function c (LL) {
	if (LL === "core") {
		return "c";
	}

	if (L[LL] <= 0 || L[LL] >= 1) {
		return 0;
	}

	let expL = pow(progress_light(LL), chroma.exp.lighter);
	let expD = pow(progress_dark(LL), chroma.exp.darker);
	return `calc(c * (1 - ${or(expL, expD)}))`;
}

export function h (LL) {
	if (LL === "core" || L[LL] <= 0 || L[LL] >= 1) {
		return "h";
	}

	let shifts = Object.values(hue.shifts).flatMap(({ band, darker, lighter }) => {
		let gate = `clamp(0, 1 - pow(abs(h - ${band.center}) / ${band.extent}, ${band.exp}), 1)`;
		let shift = sop(
			darker.max,
			pow(progress_dark(LL), darker.exp),
			lighter.max,
			pow(progress_light(LL), lighter.exp),
		);
		return [gate, shift];
	});
	return `calc(h + ${sop(...shifts)})`;
}

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
