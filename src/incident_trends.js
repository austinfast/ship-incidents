import  "./style/fonts.css"
import "./style/index.css"
import DataManager from "./utils/data.js";
import Timeline from "./components/charts/TrendArea.svelte";

let dataManager;
let incidents = [];

if (!window.mkDataManager) {
	dataManager = window.mkDataManager = new DataManager();
}

let timeline = new Timeline({
	target: document.getElementById("MK-incident_trends-embed"),
	props: {
		dataManager
	}
});
