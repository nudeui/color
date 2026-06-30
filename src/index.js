import { css, progress, pow, vars, ref, max, or, ife, ifs, sop, map } from "airdry/css";

export const L = {
	100: 1, // 3
	95: 0.97, // 4
	90: 0.93, // 5
	85: 0.88, // 4
	80: 0.84, // 5
	75: 0.79, // 5
	70: 0.74, // 5
	65: 0.69, // 6
	60: 0.63, // 5
	55: 0.58, // 6
	50: 0.52, // 5
	45: 0.47, // 5
	40: 0.42, // 6
	35: 0.38, // 5
	30: 0.33, // 5
	25: 0.28, // 5
	20: 0.23, // 5
	15: 0.18, // 4
	10: 0.14, // 5
	5: 0.09, // 9
	0: 0,
};

export const levels = Object.keys(L).map(Number);
export const levelsChromatic = levels.filter(level => level !== 0 && level !== 100);

export const colors = {
	yellow: "oklch(84% 0.17 85)",
	green: "oklch(65% 0.19 130)",
	cyan: "oklch(70% 0.155 205)",
	blue: "oklch(57% 0.256 257)",
	indigo: "oklch(48% 0.3 277)",
	pink: "oklch(60% 0.28 353)",
	red: "oklch(55% 0.24 20)",
	gray: "oklch(50% 0.03 270)",
};

export const hues = Object.keys(colors);

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

	if (LL in L) {
		return L[LL];
	}

	// TODO find nearest specified level instead of hardcoding 5-95
	return progress(LL, L[5], L[95]);
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
