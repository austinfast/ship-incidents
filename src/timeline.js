import "./style/fonts.css";
import "./style/index.css";
import Timeline from "./components/charts/Timeline.svelte";
import { getIncidentData } from "./stores/data.js";

const mainEl = document.getElementById("MK-timeline-embed");
getIncidentData();
console.log("Rendering timeline");
let timeline = new Timeline({
	target: mainEl,
	props: {
		popupSlot: "incident-timeline"
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
