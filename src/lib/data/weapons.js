import { getDataURL, getDataFromURL } from "./index.js";

let weaponData = null;

export function getWeaponData() {
	if (!weaponData) {
		console.log("weapon data doesn't exist, generating");
		weaponData = generateWeaponData();
	} else {
		console.log("weapon data already exists, using copy");
	}
	return weaponData;
}

async function generateWeaponData() {
	console.log("get weapon data");
	const dataURL = getDataURL("weapons.json");
	const rawData = await getDataFromURL(dataURL);
	return rawData;
}
