import { css, progress, pow } from "./util.js";
import { L, levels, levelsChromatic } from "./constants.js";

export default css`
:where(&) {
	/* Lightnesses for each tint */
	${ levels.slice(1).map(level => `--l-${level}: ${L[level]};`) }

	/* Chromas for each tint */
	--c-100: 0;
	${ levelsChromatic.map(level => css`
	--cf-${level}: (1 - pow(progress(var(--l-${level}), l, 1), CF_EXP));
	--c-${level}: calc(c * var(--cf-${level}, 1));
	`) }
	--c-0: 0;

	/* Tints */
	--tint-core: l c h;
	${ levels.map(level => `--tint-${level}: var(--l-${level}) var(--c-${level}) h;`) }
}
`;
