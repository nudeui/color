import { css, gt, map, snapToScale } from "airdry/css";
import { tint_if } from "./util.js";
import { c, h } from "./tints.css.js";
import { L, levels } from "./index.js";
export { template } from "./util.js";

// Scale rungs as integers (lightness × 100) so map()'s exact eq matches the snapped value,
// each paired with the lightness of its darker / lighter neighbour.
const centi = levels.map(n => Math.round(L[n] * 100));
const light = levels.map(n => L[n]);
const darker = Object.fromEntries(centi.map((v, i) => [v, light[Math.max(0, i - 1)]]));
const lighter = Object.fromEntries(
	centi.map((v, i) => [v, light[Math.min(light.length - 1, i + 1)]]),
);

export default css`
	--l-threshold: 0.7;
	--tint-text: ${tint_if(gt("l", "var(--l-threshold)"), 40, 100)};

	/* Snap the color's lightness to its scale rung, then step to the neighbour — so darker /
		   lighter stay on the scale, carrying its chroma & hue curvature (not a flat lightness nudge). */
	--l-snap: calc(${snapToScale("l * 100", centi)});
	--l-darker: calc(${map("var(--l-snap)", darker)});
	--l-lighter: calc(${map("var(--l-snap)", lighter)});
	--tint-darker: var(--l-darker) ${c("var(--l-darker)")} ${h("var(--l-darker)")};
	--tint-lighter: var(--l-lighter) ${c("var(--l-lighter)")} ${h("var(--l-lighter)")};
`;
