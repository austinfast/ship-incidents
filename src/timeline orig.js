import "./style/fonts.css";
import "./style/index.css";
import Timeline from "./components/charts/Timeline.svelte";
import { getIncidentData } from "./lib/data/incidents.js";
import { getParameterByName } from "./lib/params.js";

const nobuttonsParam = getParameterByName("nobuttons");

const name = "timeline";
const mainEl = document.getElementById(`MK-${name}-embed`);
new Timeline({
	target: mainEl,
	props: {
		popupSlot: "incident-timeline",
		incidentData: getIncidentData(),
		nobuttons: nobuttonsParam == "true"
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
