import html from "airdry/html";
import { colors, levelsChromatic, hues } from "./src/index.js";

export { template } from "airdry/html";

export const head = `<link rel="stylesheet" href="demo.css" />`;
export const title = "Nude color demo";

const callout = ({ hue, buttons }, ...contents) => {
	return html`
		<article class="callout" style="${hue ? `--color: var(--color-${hue})` : ""}">
			<h3>${hue ?? "Callout"}</h3>
			${hue ? html`<p>Color: <code>var(--color-${hue})</code></p>` : ""}
			${contents.join("\n")}
			${buttons
				? html`<footer>
						<button>Primary</button>
						<button class="outline">Secondary</button>
						<button class="tinted">Tinted</button>
					</footer>`
				: ""}
		</article>
	`;
};

export default html`
	<label>
		<input
			type="checkbox"
			id="invert-color-scheme"
			onchange="localStorage.invertColorScheme = this.checked"
		/>
		Invert color scheme
	</label>
	<script>
		// Restore persisted dark mode state right away to avoid a flash
		{
			let control = document.getElementById("invert-color-scheme");
			if (localStorage.invertColorScheme === "true") {
				control.checked = true;
			}
		}
	</script>
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
						${levelsChromatic.map(level => ({
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
		${hues.map(hue =>
			callout(
				{ hue, buttons: true },
				"This is a callout",
				callout({}, "Nested callout 1", callout({ buttons: true }, "Nested callout 2")),
			))}
	</div>
`;
