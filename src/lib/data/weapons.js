import { getDataURL, getDataFromURL } from "./index.js";

let weaponData = null;

export function getWeaponData() {
	if (!weaponData) {
		weaponData = generateWeaponData();
	}
	return weaponData;
}

async function generateWeaponData() {
	const dataURL = getDataURL("weapons.json");
	const rawData = await getDataFromURL(dataURL);
	rawData.updated_at = new Date(rawData.updated_at);
	return rawData;
}
