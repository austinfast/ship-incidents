import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import CategoryAreaChart from "./components/charts/CategoryAreaChart.svelte";

let dataManager;
let incidents = [];

if (!window.mkDataManager) {
	dataManager = window.mkDataManager = new DataManager();
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

let chart = new CategoryAreaChart({
	target: document.getElementById("MK-incidents_by_category_area-embed"),
	props: {
		dataManager,
		categories,
	},
});
