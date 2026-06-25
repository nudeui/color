import { round, clamp, progress, calc, ife } from "airdry/css";

export function snapToScale (x, points, { strat = "" } = {}) {
	const terms = points.slice(1).map((b, i) => {
		const a = points[i];
		return `(${b} - ${a}) * ${round(strat, clamp(0, progress(x, a, b), 1))}`;
	});
	terms.unshift(points[0]);

	return calc(terms.join(`\n${indent}+ `));
}

export function tint_if (condition, tint_true, tint_false) {
	return [..."lch"]
		.map(c =>
			ife(condition, `var(--${c}-${tint_true}, ${c})`, `var(--${c}-${tint_false}, ${c})`))
		.map(c => calc(c))
		.join(" ");
}
