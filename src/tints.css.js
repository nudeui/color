import { css, progress, pow, vars, ref, max, or, ife, ifs, sop, map } from "airdry/css";
import { L, levels, levelsChromatic } from "./index.js";

// Curvature factors for chroma
export const chroma = {
	exp: { lighter: 2, darker: 1.2 },
};

export const hue = {
	shifts: {
		yellows: {
			band: { center: 84, extent: 27, exp: 1.5 },
			darker: { max: -43, exp: 0.4 },
			lighter: { max: 11, exp: 0.4 },
		},
	},
};

// For nicer references
const [l, c, h] = "lch".split("");
const varll = LL => `var(--l-${LL})`;

const progress_dark = LL => progress(varll(LL), l, 0);
const progress_light = LL => progress(varll(LL), l, 1);
const pow_light_dark = (LL, expL, expD) =>
	or(pow(progress_light(LL), expL), pow(progress_dark(LL), expD));

export default css`
	:where(&) {
		/* Lightnesses for each tint */
		${levels.map(
			LL => `
		--l-${LL}: ${L[LL]};
	`,
		)}

		/* Chromas for each tint */
		--c-100: 0;
		${levelsChromatic.map(
			LL =>
				`--c-${LL}: calc(c * (1 - ${or(pow(progress_light(LL), chroma.exp.lighter), pow(progress_dark(LL), chroma.exp.darker))}));`,
		)}
		--c-0: 0;

		/* Hues for each tint: near each key hue, shift toward its dark/light directions, scaled by how far the tint moves from the source toward black/white */
		${levelsChromatic.map(
			LL => `--h-${LL}: calc(h + ${Object.values(hue.shifts).map(({
				band,
				darker,
				lighter,
			}) => {
				return `clamp(0, 1 - pow(abs(h - ${band.center}) / ${band.extent}, ${band.exp}), 1)
						* ${sop(
							darker.max,
							pow(progress_dark(LL), darker.exp),
							lighter.max,
							pow(progress_light(LL), lighter.exp),
						)}`;
			})});
	`,
		)}

		/* Tints */
		--tint-core: l c h;
		--tint-100: 1 0 h;
		${levels.map(LL => `--tint-${LL}: var(--l-${LL}, l) var(--c-${LL}, c) var(--h-${LL}, h);`)}
		--tint-0: 0 0 h;
	}
`;
