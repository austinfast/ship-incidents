import "./style/fonts.css";
import "./style/index.css";
import YearLines from "./components/charts/YearLines.svelte";
import { getIncidentData } from "./lib/data/incidents.js";

const mainEl = document.getElementById("MK-incident_year_lines-embed");
new YearLines({
	target: mainEl,
	props: {
		popupSlot: "incident-year-lines",
		incidentData: getIncidentData()
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
