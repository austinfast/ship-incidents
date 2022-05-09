import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import TrendArea from "./components/charts/TrendArea.svelte";

let dataManager;
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

if (!window.mkDataManager) {
	dataManager = window.mkDataManager = new DataManager();
} else {
	dataManager = window.mkDataManager;
}

let trendArea = new TrendArea({
	target: document.getElementById("MK-victim_trends-embed"),
	props: {
		dataManager,
		yearlyVariables,
	},
});
