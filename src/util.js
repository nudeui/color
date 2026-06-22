export const fn = new Proxy({}, {
	get (target, name) {
		if (name in target) {
			return target[name];
		}

		target[name] = function (...args) {
			return `${name}(${args.filter(Boolean).join(', ')})`;
		}

		return target[name];
	}
});

export const { progress, round, clamp, pow, calc } = fn;

export function progress (x, min, max) {
	let ret = (x - min) / (max - min);

	if (x.startsWith("no-clamp")) {
		x = x.replace("no-clamp", "");
		return ret;
	}

	return clamp(0, ret, 1);
}

export function v (name, fallback) {
	fallback = fallback ? `, ${fallback}` : '';
	return `var(--${name}${fallback})`;
}


export function snapToScale(x, points, { strat = '', indent = "\t" } = {}) {
	const terms = points.slice(1).map((b, i) => {
		const a = points[i];
		return `(${b} - ${a}) * ${round(strat, clamp(0, progress(x, a, b), 1) )}`;
	});
	terms.unshift(points[0]);
	return `calc(${ terms.join(`\n${indent}+ `) })`;
}

export function css (strings, ...values) {
	return strings.reduce((acc, str, i) => {
		const value = values[i - 1];

		if (value === undefined || value === null) {
			value = "";
		}
		else if (Array.isArray(value)) {
			value = value.join("\n");
		}
		else if (typeof value === "object") {
			value = Object.entries(value).map(([k, v]) => `${k}: ${v};`).join("\n");
		}

		return acc + value + str;
	});
}

export function objectMap (obj, fn) {
	return Object.fromEntries(Object.entries(obj).map(fn));
}

export function prefixKeys (prefix, values) {
	return objectMap(values, ([k, v]) => [`${prefix}${k}`, v]);
}
