import "./style/fonts.css";
import "./style/index.css";
import WeaponWaffle from "./components/charts/WeaponWaffle.svelte";
import { getWeaponData } from "./lib/data/weapons.js";
import colors from "./lib/colors.js";

const mainEl = document.getElementById("MK-gun_types-embed");
const splitBy = "gun_class";

const typeLabels = {
	"HG": "Handguns",
	"LG": "Long guns",
	"UG": "Unknown guns",
};

new WeaponWaffle({
	target: mainEl,
	props: {
		weaponData: getWeaponData(),
		splitBy,
		chartColor: colors.blue,
		labels: typeLabels,
		dataFilter: [splitBy, ["HG", "LG", "UG"]],
		chartLabel: "Types of guns used in mass killings"
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
