import { colors, levelsChromatic } from "./src/constants.js";

const hues = Object.keys(colors);

export default `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Test</title>
	<link rel="stylesheet" href="demo.css">
</head>
<body>
	<label>
		<input type="checkbox">
		Dark mode
	</label>
	<table>
		<thead>
			<tr>
				<th>Hue</th>
				<th>Key</th>
				${levelsChromatic.map(level => `<th>${level}</th>`).join("")}
			</tr>
		</thead>
		<tbody>
			${hues
				.map(
					hue => `
				<tr style="--color: var(--color-${hue})">
					<th>${hue}</th>
					<th class="swatch"></th>
					${levelsChromatic.map(level => `<td class="swatch" style="--tint: var(--tint-${level})"></td>`).join("")}
				</tr>`,
				)
				.join("")}
		</tbody>
	</table>
	<div class="callouts">
		${hues.map(
				hue => `
			<article class="callout" style="--color: var(--color-${hue})">
				<h3>${hue}</h3>
				<p>Color: <code>var(--color-${hue})</code></p>
				<footer>
					<button>Primary</button>
					<button class="outline">Secondary</button>
				</footer>
			</article>`,
			)
			.join("")}
	</div>
</body>
</html>
`;
