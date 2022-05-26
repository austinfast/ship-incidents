import { getDataURL, getDataFromURL } from "./index.js";

export const weaponData = getWeaponData();

async function getWeaponData() {
	console.log("get weapon data");
	const dataURL = getDataURL("weapons.json");
	const rawData = await getDataFromURL(dataURL);
	return {
		weapons: rawData
	}
}

