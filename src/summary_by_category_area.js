import "./style/fonts.css";
import "./style/index.css";
import CategoryChartGroup from "./components/CategoryChartGroup.svelte";
import { getIncidentData } from "./lib/data/incidents.js";

let mainEl = document.getElementById("MK-summary_by_category_area-embed");

let chart = new CategoryChartGroup({
	target: mainEl,
	props: {
		incidentData: getIncidentData(),
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
