import "./style/fonts.css";
import "./style/index.css";
import Bars from "./components/charts/StackedBar.svelte";
import colors from "./colors.json";
import { victimData } from "./stores/data.js";

const mainEl = document.getElementById("MK-victims_by_sex-embed");

console.log("make bars");
let bars = new Bars({
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
