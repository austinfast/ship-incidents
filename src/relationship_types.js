import "./style/fonts.css";
import "./style/index.css";
import Bars from "./components/charts/RelationshipBars.svelte";
import { getVictimData } from "./lib/data/victims.js";

const mainEl = document.getElementById("MK-relationship_types-embed");

console.log("Rendering relationship chart");
let bars = new Bars({
	target: mainEl,
	props: {
		victimData: getVictimData()
	}
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
