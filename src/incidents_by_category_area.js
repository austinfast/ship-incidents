import  "./style/fonts.css"
import "./style/index.css"
import DataManager from "./utils/data.js";
// import Timeline from "./components/charts/Timeline.svelte";
import CategoryAreaChart from "./components/charts/CategoryAreaChart.svelte";

let dataManager;
let incidents = [];

if (!window.dataManager) {
	dataManager = window.dataManager = new DataManager();
}

let chart = new CategoryAreaChart({
	target: document.getElementById("main"),
	props: {
		dataManager
	}
});
