import "./style/fonts.css";
import "./style/index.css";
import DataManager from "./utils/data.js";
import TrendArea from "./components/charts/TrendArea.svelte";

let dataManager;
const yearlyVariables = [
	{
		field: "incidents",
		label: "Mass killings",
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

if (!window.mkDataManager) {
	dataManager = window.mkDataManager = new DataManager();
} else {
	dataManager = window.mkDataManager;
}

let trendArea = new TrendArea({
	target: document.getElementById("MK-incident_trends-embed"),
	props: {
		dataManager,
		yearlyVariables,
	},
});
