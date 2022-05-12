import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import CategoryAreaChart from "./components/charts/CategoryAreaChart.svelte";

let dataManager;
let incidents = [];
let mainEl = document.getElementById("MK-incidents_by_category_area-embed");

if (!window.mkDataManager) {
	console.log("global dataManager NOT found by incidents by category")
	dataManager = window.mkDataManager = new DataManager();
} else {
	console.log("global dataManager found by incidents by category")
	dataManager = window.mkDataManager;
}

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

console.log("Rendering area chart");
let chart = new CategoryAreaChart({
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
