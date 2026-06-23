import html from "../airdry/src/languages/html/index.js";
import { colors, levelsChromatic, hues } from "./src/constants.js";

export default html`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Test</title>
			<link rel="stylesheet" href="demo.css" />
		</head>
		<body>
			<label>
				<input type="checkbox" />
				Dark mode
			</label>
			<table>
				<thead>
					<tr>
						<th>Hue</th>
						<th>Key</th>
						${levelsChromatic.map(level => html`<th>${level}</th>`)}
					</tr>
				</thead>
				<tbody>
					${hues.map(
						hue => html`
							<tr style="--color: var(--color-${hue})">
								<th>${hue}</th>
								<th class="swatch"></th>
								${levelsChromatic.map(level =>
									({
										tag: "td",
										class: "swatch",
										style: `--tint: var(--tint-${level})`,
									}))}
							</tr>
						`,
					)}
				</tbody>
			</table>
			<div class="callouts">
				${hues.map(
					hue => html`
						<article class="callout" style="--color: var(--color-${hue})">
							<h3>${hue}</h3>
							<p>Color: <code>var(--color-${hue})</code></p>
							<footer>
								<button>Primary</button>
								<button class="outline">Secondary</button>
							</footer>
						</article>
					`,
				)}
			</div>
		</body>
	</html>
`;
