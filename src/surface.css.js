import { css, mapKeys } from "airdry/css";
import { levels } from "./index.js";
export { template } from "./util.js";

export const properties = {
	tintSurface: { inherits: false },
	colorWhite: { syntax: "<color>", initial: "white" },
};

export default css`
	--color-base: var(--color-gray);
	--color-accent: var(--color-blue);

	--is-system-dark: 0;
	--is-dark: 0;
	/* Color scheme agnostic tints */
	--tint-surface: var(--tint-100);
	${levels.map(LL => `--tint-surface-${LL}: var(--tint-${LL});`).join("\n")}

	@media (prefers-color-scheme: dark) {
		--is-system-dark: 1;
		--is-dark: 1;
		--tint-surface: var(--tint-10);
		${levels
			.map(LL => `--tint-surface-${LL}: var(--tint-${100 - Math.max(0, LL - 10)});`)
			.join("\n")}
	}

	/* Relative surface tints */
	${relativeTints(100, { gated: false })}
`;

// `--tint-surface-N` = N steps (×5) deeper than the current surface (negative = lighter).
// Style queries can only read ancestors, so each block keys off the parent surface
// `level` and re-bases the child's ladder there. The root seeds it ungated.
function relativeTints (level, { gated = true } = {}) {
	let relativeLevels = 3;
	let indices = Array.from({ length: relativeLevels * 2 + 1 }, (_, i) => i - relativeLevels);
	let declarations = indices
		.map(
			rl =>
				`--tint-surface-${rl}: var(--tint-surface-${Math.max(0, Math.min(level - rl * 5, 100))});`,
		)
		.join("\n");

	if (!gated) {
		return declarations;
	}

	return css`
		@container (style(--tint-surface: var(--tint-surface-${level}))) {
			${declarations}
		}
	`;
}

// One block per nesting level, from the root (100) down; deeper surfaces freeze at the last tint.
const maxNesting = 5;
export const end = css`
	body {
		@container style(--color-white: light-dark(black, white)) {
			--is-dark: 1;
		}
	}
	* {
		${Array.from({ length: maxNesting }, (_, i) => relativeTints(100 - i * 5)).join("\n")}
	}
`;

/*

:root {
	--tint-bg: var(--tint-100);
	--tint-bg-1-: var(--tint-95);
	--tint-bg-1: var(--tint-90);
	--tint-bg-2: var(--tint-85);
	--color-bg: var(--color-base);

	--is-dark-mode: 0;

	{% for tint in range(0, 101, 5) -%}
	--tint-canvas-{{ tint }}: var(--tint-{{ tint }});
	{% endfor -%}
}

@media (prefers-color-scheme: dark) {
	:root {
		--is-dark-mode: 1;
		{% for tint in range(0, 101, 5) -%}
		--tint-canvas-{{ 100 - tint }}: var(--tint-{{ tint }});
		{% endfor -%}
	}
}

* {
	@container style(--tint-surface: var(--tint-canvas-100)) {
		--tint-surface-5: var(--tint-canvas-95);
		--tint-surface-10: var(--tint-canvas-90);

		--tint-bg-1: var(--tint-95);
		--tint-bg-2: var(--tint-90);

		--tint-border-½: var(--tint-90);
		--tint-border-1: var(--tint-85);
		--tint-border-2: var(--tint-80);
	}
	@container style(--tint-bg: var(--tint-95)) {
		--tint-bg-1-: var(--tint-100);
		--tint-bg-1: var(--tint-90);
		--tint-bg-2: var(--tint-85);

		--tint-border-½: var(--tint-85);
		--tint-border-1: var(--tint-80);
		--tint-border-2: var(--tint-75);
	}
	@container style(--tint-bg: var(--tint-90)) {
		--tint-bg-1-: var(--tint-95);
		--tint-bg-1: var(--tint-85);
		--tint-bg-2: var(--tint-80);
	}
}
*/
