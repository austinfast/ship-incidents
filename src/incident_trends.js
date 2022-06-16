import "./style/fonts.css";
import "./style/index.css";
import TrendBars from "./components/charts/TrendBars.svelte";
import { getIncidentData } from "./lib/data/incidents.js";

const mainEl = document.getElementById("MK-incident_trends-embed");
// const yearlyVariables = [
// 	{
// 		field: "incidents",
// 		label: "Mass killings",
// 	},
// 	{
// 		field: "mass_shootings",
// 		label: "Mass shootings",
// 	},
// 	{
// 		field: "mass_public_shootings",
// 		label: "Mass public shootings",
// 	},
// ];

const yearlyVariables = [
	{
		field: "mass_public_shootings",
		label: "Public mass shootings",
	},
	{
		field: "non_public_mass_shootings",
		label: "Non-public mass shootings",
	},
	{
		field: "non_shooting_mass_killings",
		label: "Non-shooting mass killings",
	},
];

console.log("Rendering trend chart");
let trendBars = new TrendBars({
	target: mainEl,
	props: {
		yearlyVariables,
		incidentData: getIncidentData()
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
