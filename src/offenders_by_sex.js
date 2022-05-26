import "./style/fonts.css";
import "./style/index.css";
import Bars from "./components/charts/StackedBar.svelte";
import colors from "./lib/colors.js";
import { offenderData } from "./lib/data/offenders.js";

const mainEl = document.getElementById("MK-offenders_by_sex-embed");

console.log("make offenders sex bars");
let bars = new Bars({
	target: mainEl,
	props: {
		colors: [colors.blue, colors["blue-light"], colors.grey],
		sourceData: offenderData,
		countKey: "offenderGenderCounts",
	}
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
