import "./style/fonts.css";
import "./style/index.css";
import Map from "./components/charts/IncidentMap.svelte";
import { getIncidentData } from "./lib/data/incidents.js";

const mainEl = document.getElementById("MK-incident_map-embed");
new Map({
	target: mainEl,
	props: {
		popupSlot: "incident-map",
		incidentData: getIncidentData()
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
