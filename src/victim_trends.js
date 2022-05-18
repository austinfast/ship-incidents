import "./style/fonts.css";
import "./style/index.css";
import TrendArea from "./components/charts/TrendArea.svelte";

const mainEl = document.getElementById("MK-victim_trends-embed");

const yearlyVariables = [
	{
		field: "victims",
		label: "Mass killing victims",
	},
	{
		field: "mass_shooting_victims",
		label: "Mass shooting victims",
	},
	{
		field: "mass_public_shooting_victims",
		label: "Mass public shooting victims",
	},
];

let trendArea = new TrendArea({
	target: mainEl,
	props: {
		yearlyVariables,
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
