import "./style/fonts.css";
import "./style/index.css";
import TrendArea from "./components/charts/TrendArea.svelte";

const mainEl = document.getElementById("MK-incident_trends-embed");
const yearlyVariables = [
	{
		field: "incidents",
		label: "Mass killings",
	},
	{
		field: "mass_shootings",
		label: "Mass shootings",
	},
	{
		field: "mass_public_shootings",
		label: "Mass public shootings",
	},
];

console.log("Rendering trend chart");
let trendArea = new TrendArea({
	target: mainEl,
	props: {
		yearlyVariables,
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
