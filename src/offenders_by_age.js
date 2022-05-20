import "./style/fonts.css";
import "./style/index.css";
import AgeHistogram from "./components/charts/AgeHistogram.svelte";
// TODO should be fetching offenders, oncee that data exists here
import { victimData, getVictimData } from "./stores/data.js";
import colors from "./colors.json";

const mainEl = document.getElementById("MK-victims_by_age-embed");

// @TODO switch this to offenders
victimData.subscribe((val) => {
	if (!val) {
		getVictimData();
	} else {
		let ageHistogram = new AgeHistogram({
			target: mainEl,
			props: {
				color: colors.blue,
				sourceData: val,
			}
		});
	}
});

// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
