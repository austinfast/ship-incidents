import "./style/fonts.css";
import "./style/index.css";
import Bars from "./components/charts/RankedBar.svelte";
import { getIncidentData } from "./lib/data/incidents.js";
import colors from "./lib/colors.js";

const mainEl = document.getElementById("MK-location_types-embed");

new Bars({
	target: mainEl,
	props: {
		chartData: getIncidentData(),
		dataKey: "locationTypes",
		color: colors.orange,
		chartLabel: "Number of mass killings by location type"
	}
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
