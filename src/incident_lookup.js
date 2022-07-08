import "./style/fonts.css";
import "./style/index.css";
import Table from "./components/IncidentLookupTable.svelte";
import { getIncidentData } from "./lib/data/incidents.js";

const mainEl = document.getElementById("MK-incident_lookup-embed");
new Table({
	target: mainEl,
	props: {
		popupSlot: "incident-timeline",
		incidentData: getIncidentData()
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
