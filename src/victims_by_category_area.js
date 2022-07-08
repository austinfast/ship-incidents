import "./style/fonts.css";
import "./style/index.css";
import dataManager from "./lib/data.js";
import CategoryAreaChart from "./components/charts/CategoryAreaChart.svelte";

const mainEl = document.getElementById("MK-victims_by_category_area-embed");

const categories = [
	{
		field: "victims",
		label: "Victims of mass killings",
	},
	{
		field: "mass_shooting_victims",
		label: "Victims of mass shootings",
	},
	{
		field: "mass_public_shooting_victims",
		label: "Victims of mass public shootings",
	},
];

new CategoryAreaChart({
	target: mainEl,
	props: {
		dataManager,
		categories,
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
