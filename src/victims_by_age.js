import "./style/fonts.css";
import "./style/index.css";
import AgeHistogram from "./components/charts/AgeHistogram.svelte";
import colors from "./colors.json";
import { victimData } from "./stores/data.js";

const mainEl = document.getElementById("MK-victims_by_age-embed");

// @TODO i wonder if this is a better pattern for fetching data than doing inside the components.
// on one hand you lose the store magic, on the other its easier to pass different data to the same component when reusing charts
// nah this is not working well, its rendering a 2nd chart when the promise fullfils
console.log("render victims by age");
let ageHistogram = new AgeHistogram({
	target: mainEl,
	props: {
		color: colors.orange,
		sourceData: victimData,
	}
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
