import { round, clamp, progress, calc, ife, sop } from "airdry/css";

export function snapToScale (x, points, { strat = "" } = {}) {
	const terms = points.flatMap((b, i) => {
		if (i === 0) {
			return b;
		}
		const a = points[i - 1];
		return [`${b} - ${a}`, round(strat, progress(x, a, b))];
	});

	return sop(terms);
}

export function tint_if (condition, tint_true, tint_false) {
	return [..."lch"]
		.map(c =>
			ife(condition, `var(--${c}-${tint_true}, ${c})`, `var(--${c}-${tint_false}, ${c})`))
		.map(c => calc(c))
		.join(" ");
}
