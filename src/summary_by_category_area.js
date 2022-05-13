import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import CategoryChartGroup from "./components/CategoryChartGroup.svelte";

let dataManager;
let incidents = [];
let mainEl = document.getElementById("MK-summary_by_category_area-embed");

if (!window.mkDataManager) {
	dataManager = window.mkDataManager = new DataManager();
} else {
	dataManager = window.mkDataManager;
}

let chart = new CategoryChartGroup({
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
