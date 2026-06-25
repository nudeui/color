import { round, clamp, progress, calc, ife } from "airdry/css";

export function snapToScale (x, points, { strat = "" } = {}) {
	const terms = points.slice(1).map((b, i) => {
		const a = points[i];
		return `(${b} - ${a}) * ${round(strat, clamp(0, progress(x, a, b), 1))}`;
	});
	terms.unshift(points[0]);

	return calc(terms.join(`\n${indent}+ `));
}
