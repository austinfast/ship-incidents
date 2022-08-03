import "./style/fonts.css";
import "./style/index.css";
import ChartGroup from "./components/RaceGroup.svelte";
import colors from "./lib/colors.js";
import { getVictimData } from "./lib/data/victims.js";
import { getOffenderData } from "./lib/data/offenders.js";

const mainEl = document.getElementById("MK-victims_offenders_by_race-embed");

new ChartGroup({
	target: mainEl,
	props: {
		victimData: getVictimData(),
		offenderData: getOffenderData(),
		valueKey: "count",
		victimHeadline: "Number of mass killing victims by race",
		offenderHeadline: "Number of mass killing offenders by race"
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
