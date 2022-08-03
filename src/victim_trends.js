import "./style/fonts.css";
import "./style/index.css";
import TrendBars from "./components/charts/TrendBars.svelte";
import { getIncidentData } from "./lib/data/incidents.js";

const mainEl = document.getElementById("MK-victim_trends-embed");
const yearlyVariables = [
	{
		field: "mass_public_shooting_victims",
		label: "Public fatal shooting victims",
	},
	{
		field: "non_public_mass_shooting_victims",
		label: "Non-public fatal shooting victims",
	},
	{
		field: "non_shooting_mass_killing_victims",
		label: "Other mass killing victims",
	},
];

new TrendBars({
	target: mainEl,
	props: {
		yearlyVariables,
		incidentData: getIncidentData(),
		chartLabel: "Number of mass killing victims year by year"
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
