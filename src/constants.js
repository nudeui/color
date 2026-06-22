export const L = {
	100: 1,
	95: 0.97,
	90: 0.93,
	85: 0.87,
	80: 0.84,
	75: 0.79,
	70: 0.74,
	65: 0.69,
	60: 0.63,
	55: 0.58,
	50: 0.52,
	45: 0.47,
	40: 0.42,
	35: 0.38,
	30: 0.33,
	25: 0.28,
	20: 0.23,
	15: 0.18,
	10: 0.14,
	5: 0.09,
	0: 0,
};

export const levels = Object.keys(L).map(Number);
export const levelsChromatic = levels.filter(level => level !== 0 && level !== 100);

export const colors = {
	yellow: "oklch(84% 0.17 85)",
	green: "oklch(65% 0.19 130)",
	cyan: "oklch(70% 0.155 205)",
	blue: "oklch(55% 0.23 255)",
	indigo: "oklch(52% 0.178 268)",
	pink: "oklch(60% 0.28 355)",
	red: "oklch(59% 0.21 20)",
	gray: "oklch(50% 0.03 270)",
}
