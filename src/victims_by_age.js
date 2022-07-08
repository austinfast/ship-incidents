import "./style/fonts.css";
import "./style/index.css";
import AgeHistogram from "./components/charts/AgeHistogram.svelte";
import colors from "./lib/colors.js";
import { getVictimData } from "./lib/data/victims.js";

const mainEl = document.getElementById("MK-victims_by_age-embed");

new AgeHistogram({
	target: mainEl,
	props: {
		sourceData: getVictimData(),
		color: colors.orange,
		ageBinKey: "victimAges",
		ageScaleKey: "victimAgeScale",
		chartLabel: "Number of victims by age"
	}
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
