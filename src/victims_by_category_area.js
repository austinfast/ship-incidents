import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import CategoryAreaChart from "./components/charts/CategoryAreaChart.svelte";

let dataManager;
let incidents = [];
const mainEl = document.getElementById("MK-victims_by_category_area-embed");

if (!window.mkDataManager) {
	dataManager = window.mkDataManager = new DataManager();
} else {
	dataManager = window.mkDataManager;
}

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
