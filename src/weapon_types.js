import "./style/fonts.css";
import "./style/index.css";
import WeaponWaffle from "./components/charts/WeaponWaffle.svelte";
import { getWeaponData } from "./lib/data/weapons.js";
import colors from "./lib/colors";

const mainEl = document.getElementById("MK-weapon_types-embed");
const splitBy = "weapon_type";

console.log("Rendering weapon types");
new WeaponWaffle({
	target: mainEl,
	props: {
		weaponData: getWeaponData(),
		splitBy,
		chartColor: colors.orange
	},
});
// Set up height resizer for embeds
if (window.IframeResizer) {
	const myResizer = new window.IframeResizer(mainEl, 3000);
	myResizer.watch();
}
