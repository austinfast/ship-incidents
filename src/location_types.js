import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import Bars from "./components/charts/RankedBar.svelte";

let dataManager;
const mainEl = document.getElementById("MK-location_types-embed");

if (!window.mkDataManager) {
	console.log("global dataManager NOT found by incident trends")
	dataManager = window.mkDataManager = new DataManager();
} else {
	console.log("global dataManager found by incident trends")
	dataManager = window.mkDataManager;
}

console.log("Rendering trend chart");
let locationBars = new Bars({
	target: mainEl,
	props: {
		dataManager,
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
