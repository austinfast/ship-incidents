import "./style/fonts.css";
import "./style/index.css";
import YearLines from "./components/charts/YearLines.svelte";
import { getIncidentData } from "./lib/data/incidents.js";
import { getParameterByName } from "./lib/params.js";

const nobuttonsParam = getParameterByName("nobuttons");
const metricParam = getParameterByName("metric");

const mainEl = document.getElementById("MK-incident_year_lines-embed");
new YearLines({
	target: mainEl,
	props: {
		popupSlot: "incident-year-lines",
		incidentData: getIncidentData(),
		nobuttons: nobuttonsParam == "true",
		metric: metricParam
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
