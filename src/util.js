import { round, clamp, progress, calc } from "./fn.js";

export function snapToScale(x, points, { strat = '', indent = "\t" } = {}) {
	const terms = points.slice(1).map((b, i) => {
		const a = points[i];
		return `(${b} - ${a}) * ${round(strat, clamp(0, progress(x, a, b), 1) )}`;
	});
	terms.unshift(points[0]);

	return calc(terms.join(`\n${indent}+ `));
}
