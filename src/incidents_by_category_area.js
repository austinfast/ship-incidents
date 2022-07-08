import "./style/fonts.css";
import "./style/index.css";
import CategoryAreaChart from "./components/charts/CategoryAreaChart.svelte";

let mainEl = document.getElementById("MK-incidents_by_category_area-embed");

const categories = [
	{
		field: "incidents",
		label: "All mass killings",
	},
	{
		field: "mass_shootings",
		label: "Mass shootings",
	},
	{
		field: "mass_public_shootings",
		label: "Mass public shootings",
	},
];

let chart = new CategoryAreaChart({
	target: mainEl,
	props: {
		categories,
	},
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
