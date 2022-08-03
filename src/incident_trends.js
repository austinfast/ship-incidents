import "./style/fonts.css";
import "./style/index.css";
import TrendBars from "./components/charts/TrendBars.svelte";
import { getIncidentData } from "./lib/data/incidents.js";

const mainEl = document.getElementById("MK-incident_trends-embed");

const yearlyVariables = [
	{
		field: "mass_public_shootings",
		label: "Public fatal shootings",
	},
	{
		field: "non_public_mass_shootings",
		label: "Non-public fatal shootings",
	},
	{
		field: "non_shooting_mass_killings",
		label: "Other mass killings",
	},
];

new TrendBars({
	target: mainEl,
	props: {
		yearlyVariables,
		incidentData: getIncidentData(),
		chartLabel: "Number of mass killings year by year"
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
