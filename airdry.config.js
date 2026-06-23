export default [
	// Compile the CSS token modules out into dist/, carrying plain stylesheets along.
	{ input: "src", output: "dist", copy: "**/*.css" },
	// Build the demo page in place from index.html.js, importing the same
	// constants.js as the CSS. Skip src/ and dist/ — the first build owns them.
	{ input: ".", exclude: ["src", "dist"] },
];
