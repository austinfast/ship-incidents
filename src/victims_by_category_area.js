import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import CategoryAreaChart from "./components/charts/CategoryAreaChart.svelte";

let dataManager;
let incidents = [];

if (!window.dataManager) {
	dataManager = window.dataManager = new DataManager();
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
	target: document.getElementById("MK-victims_by_category_area-embed"),
	props: {
		dataManager,
		categories,
	},
});
