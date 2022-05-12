import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import Timeline from "./components/charts/Timeline.svelte";

let dataManager;
let incidents = [];
const mainEl = document.getElementById("MK-timeline-embed");

if (!window.mkDataManager) {
	console.log("global dataManager NOT found by timeline")
	dataManager = window.mkDataManager = new DataManager();
} else {
	console.log("global dataManager found by timeline")
	dataManager = window.mkDataManager;
}

// clear out html because of double loading issue
console.log("Rendering timeline");
mainEl.innerHTML = "";
let timeline = new Timeline({
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
