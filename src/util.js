export const fn = new Proxy({}, {
	get (target, name) {
		if (name in target) {
			return target[name];
		}

		target[name] = function (...args) {
			// Drop only absent/empty args (e.g. an unset `strat`); keep meaningful falsy values like 0.
			return `${name}(${args.filter(arg => arg !== "" && arg != null).join(', ')})`;
		}

		return target[name];
	}
});

export const { round, clamp, pow, calc } = fn;

// Change to emit actual progress() once FF implements
export function progress (x, min, max) {
	let ret = `(${x} - ${min}) / (${max} - ${min})`;

	if (x.startsWith("no-clamp")) {
		x = x.replace("no-clamp", "");
		return ret;
	}

	return clamp(0, ret, 1);
}

/**
 * Builds a string via property access.
 * The returned proxy coerces to its accumulated string in any string context.
 * @param {string} str - The initial string to start with, e.g. `--` for CSS variables.
 * @param {string} sep - The separator to use between parts, e.g. `-` for CSS variables.
 * @returns {string} A proxy that reads as `str` and extends it on property access.
 */
function concatenator (str, sep) {
	return new Proxy({}, {
		get (target, name) {
			// Coercion to string (template literals, concatenation, String()) yields the name so far.
			if (name === Symbol.toPrimitive || name === "toString" || name === "valueOf") {
				return () => str;
			}

			if (name in String.prototype) {
				return str[name].bind(str);
			}

			// Any other property access extends the chain, skipping the separator after the leading `--`.
			return concatenator(str + (str.endsWith(sep) ? "" : sep) + name, sep);
		},
	});
}

export const vars = concatenator("--", "-");

export function ref (name, fallback) {
	fallback = fallback !== undefined ? `, ${fallback}` : '';
	return `var(${name}${fallback})`;
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
		let value = values[i - 1];

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
