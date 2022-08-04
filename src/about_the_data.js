import About from "./components/AboutData.svelte";
const name = "about_the_data";
const mainEl = document.getElementById(`MK-${name}-embed`);
new About({
	target: mainEl,
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
