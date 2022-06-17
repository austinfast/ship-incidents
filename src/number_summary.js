import "./style/fonts.css";
import "./style/index.css";
import NumberSummary from "./components/NumberSummary.svelte";
import { getIncidentData } from "./lib/data/incidents.js";
import { getVictimData } from "./lib/data/victims.js";

const mainEl = document.getElementById("MK-number_summary-embed");
new NumberSummary({
	target: mainEl,
	props: {
		incidentData: getIncidentData(),
		victimData: getVictimData()
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
