import "./style/fonts.css";
import "./style/index.css";
import Bars from "./components/charts/StackedBar.svelte";
import colors from "./lib/colors.js";
import { getVictimData } from "./lib/data/victims.js";

const mainEl = document.getElementById("MK-victims_by_sex-embed");

console.log("make victim sex bars");
let bars = new Bars({
	target: mainEl,
	props: {
		colors: [colors.orange, colors["orange-light"], colors.grey],
		sourceData: getVictimData(),
		countKey: "victimGenderCounts",
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
