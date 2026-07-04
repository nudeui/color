import { progress, pow, or, sop, calc_interpolate } from "airdry/css";

// Tint levels: 0–100 in steps of 5.
export const levels = Array.from({ length: 21 }, (_, i) => i * 5);
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

Object.assign(l, {
	at_95: 0.97,
	get gamma () {
		// return 1.1705;
		return Math.round((100 * Math.log(1 - this.at_95)) / Math.log(1 - 0.95)) / 100;
	},
	inv: l_inv,
});

Object.assign(c, {
	exp: { lighter: 2, darker: 1.2 },
});

Object.assign(h, {
	shifts: {
		yellows: {
			band: { center: 84, extent: 27, exp: 1.5 },
			darker: { max: -43, exp: 0.4 },
			lighter: { max: 11, exp: 0.4 },
		},
	},
});

// Pad numeric levels to 2 digits so the scale is unambiguous: --tint-00, --tint-05, … --tint-100.
// (Disambiguates absolute levels like --tint-surface-10 from relative offsets like --tint-surface-1.)
export const pad = LL => (typeof LL === "number" ? String(LL).padStart(2, "0") : LL);
const getL = LL => (typeof LL === "number" ? `var(--l-${pad(LL)})` : LL);
const progress_dark = LL => progress(getL(LL), "l", 0);
const progress_light = LL => progress(getL(LL), "l", 1);

/**
 * CSS lightness for a level
 * @param {number | string} LL
 * @returns {number | string}
 */
export function l (LL) {
	if (LL === "core") {
		return "l";
	}

	if (typeof LL === "number") {
		return Math.round(100 * (1 - Math.pow(1 - LL / 100, l.gamma))) / 100;
	}

	return `calc(1 - pow(1 - ${LL}/100, ${l.gamma}))`;
}

/**
 * Inverse of {@link l}: map a lightness back to its level on the scale.
 * Snap to levels
 * @param {number | string} lightness
 * @returns {string}
 */
export function l_inv (lightness) {
	if (typeof lightness === "number") {
		return 100 * (1 - Math.pow(1 - lightness, 1 / l.gamma));
	}

	return `round((1 - pow(1 - ${lightness}, 1 / ${l.gamma})) * 100, 5)`;
}

export function c (LL) {
	if (LL === "core") {
		return "c";
	}

	if (LL <= 0 || LL >= 100) {
		return 0;
	}

	let expL = pow(progress_light(LL), c.exp.lighter);
	let expD = pow(progress_dark(LL), c.exp.darker);
	return `calc(c * (1 - ${or(expL, expD)}))`;
}

export function h (LL) {
	if (LL === "core" || LL <= 0 || LL >= 100) {
		return "h";
	}

	let shifts = Object.values(h.shifts).flatMap(({ band, darker, lighter }) => {
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
