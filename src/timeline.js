import  "./style/fonts.css"
import "./style/index.css"
import DataManager from "./utils/data.js";
import Timeline from "./components/charts/Timeline.svelte";

let dataManager;
let incidents = [];

if (!window.dataManager) {
	dataManager = window.dataManager = new DataManager();
}

let timeline = new Timeline({
	target: document.getElementById("MK-timeline-embed"),
	props: {
		dataManager
	}
});
