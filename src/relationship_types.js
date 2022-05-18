import "./style/fonts.css";
import "./style/index.css";
import Bars from "./components/charts/RelationshipBars.svelte";

const mainEl = document.getElementById("MK-relationship_types-embed");

console.log("Rendering relatiolnship chart");
let bars = new Bars({
	target: mainEl,
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
