import { css, progress, pow, vars, ref } from "airdry/css";
import { L, levels, levelsChromatic } from "./constants.js";

const CF_EXP = 1.5;

export default css`
:where(&) {
	/* Lightnesses for each tint */
	${ levels.slice(1).map(level => `--l-${level}: ${L[level]};`) }

	/* Chromas for each tint */
	--c-100: 0;
	${ levelsChromatic.map(level => {
		let factor = `(1 - (${ pow(progress(`var(--l-${level})`, 'l', 1), CF_EXP) }))`;
		return `--c-${level}: calc(c * ${factor});`}) }
	--c-0: 0;

	/* Tints */
	--tint-core: l c h;
	${ levels.map(level => `--tint-${level}: var(--l-${level}) var(--c-${level}) h;`) }
}
`;
