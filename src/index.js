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
