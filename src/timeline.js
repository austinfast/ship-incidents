import "./style/fonts.css";
import "./style/index.css";
import dataManager from "./utils/data.js";
import Timeline from "./components/charts/Timeline.svelte";

let incidents = [];
const mainEl = document.getElementById("MK-timeline-embed");

// clear out html because of double loading issue
console.log("Rendering timeline");
mainEl.innerHTML = "";
let timeline = new Timeline({
	target: mainEl,
	props: {
		dataManager,
		popupSlot: "incident-timeline"
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
