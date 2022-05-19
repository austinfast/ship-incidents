import "./style/fonts.css";
import "./style/index.css";
import AgeHistogram from "./components/charts/AgeHistogram.svelte";

const mainEl = document.getElementById("MK-victims_by_age-embed");

let ageHistogram = new AgeHistogram({
	target: mainEl,
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
