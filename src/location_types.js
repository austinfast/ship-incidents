import "./style/fonts.css";
import "./style/index.css";
import Bars from "./components/charts/RankedBar.svelte";
import { getIncidentData } from "./lib/data/incidents.js";
import colors from "./lib/colors.js";

const mainEl = document.getElementById("MK-location_types-embed");

console.log("Rendering trend chart");
let locationBars = new Bars({
	target: mainEl,
	props: {
		incidentData: getIncidentData(),
		color: colors.orange
	}
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
