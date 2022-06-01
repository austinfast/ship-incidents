import "./style/fonts.css";
import "./style/index.css";
import AgeHistogram from "./components/charts/AgeHistogram.svelte";
import { getOffenderData } from "./lib/data/offenders.js";
import colors from "./lib/colors.js";

const mainEl = document.getElementById("MK-offenders_by_age-embed");

console.log("render offenders by age");
let ageHistogram = new AgeHistogram({
	target: mainEl,
	props: {
		color: colors.blue,
		sourceData: getOffenderData(),
		ageBinKey: "offenderAges",
		ageScaleKey: "offenderAgeScale",
	}
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
