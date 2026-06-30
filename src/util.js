import { css, calc, ife } from "airdry/css";
import { toKebabCase } from "airdry/lang/util";
import { levelsChromatic } from "./index.js";

export function template (
	content,
	{ selector = "&, :host", start = "", end = "", properties = {} } = {},
) {
	return css`
		${start}
		${registerProperties(properties)}
		:where(${selector}) {
			${content}
		}
		${end}
	`;
}

const initialValues = {
	"<color>": "transparent",
	"<number>": 0,
	"<integer>": 0,
	"<percentage>": "0%",
	"<length>": "0px",
	"<angle>": "0deg",
	"<time>": "0s",
	"<image> | none": "none",
};

export function registerProperty (name, { syntax = "*", inherits = true, initial } = {}) {
	name = toKebabCase(name);
	if (Array.isArray(syntax)) {
		syntax = syntax.join(" | ");
	}
	initial ??= initialValues[syntax];

	return css`
		@property --${name} {
			syntax: "${syntax}";
			inherits: ${Boolean(inherits) + ""};
			${initial !== undefined ? `initial-value: ${initial};` : ""}
		}
	`;
}

export function registerProperties (properties) {
	return Object.entries(properties)
		.map(([name, options]) => registerProperty(name, options))
		.join("\n");
}

export function tint_if (condition, tint_true, tint_false) {
	return [..."lch"]
		.map(c =>
			ife(condition, `var(--${c}-${tint_true}, ${c})`, `var(--${c}-${tint_false}, ${c})`))
		.map(c => calc(c))
		.join(" ");
}

export function tint (color, tint) {
	return `oklch(from ${color} var(--tint-${tint}))`;
}

export function scale (name, levels = levelsChromatic) {
	// --color-core-10: oklch(from var(--color-core) var(--tint-10));
	return levels
		.map(level => `--color-${name}-${level}: ${tint(`var(--color-${name})`, level)};`)
		.join("\n");
}
