import "./style/fonts.css";
import "./style/index.css";
import ChartGroup from "./components/RaceGroup.svelte";
import colors from "./lib/colors.js";
import { getVictimData } from "./lib/data/victims.js";
import { getOffenderData } from "./lib/data/offenders.js";

const mainEl = document.getElementById("MK-victims_offenders_by_race_per_cap-embed");

new ChartGroup({
	target: mainEl,
	props: {
		victimData: getVictimData(),
		offenderData: getOffenderData(),
		valueKey: "countPerMillion",
		victimHeadline: "Victims per 1 million U.S. residents",
		offenderHeadline: "Offenders per 1 million U.S. residents"
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
