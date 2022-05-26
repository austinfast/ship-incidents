import {
	getDataURL,
	getDataFromURL,
	countTypes,
	getAgeBins,
	getAgeScale,
} from "./index.js";

export let victimData = null;

export function getVictimData() {
	if (!victimData) {
		console.log("victim data doesn't exist, generating");
		victimData = generateVictimData();
	} else {
		console.log("victim data already exists, using copy");
	}
	return victimData;
}

async function generateVictimData() {
	console.log("get victim data");
	const dataURL = getDataURL("victims.json");
	const rawData = await getDataFromURL(dataURL);

	// count victim relationships
	const victimRelationships = getRelationshipCounts(rawData);

	const victimAgeScale = getAgeScale(rawData);
	const victimAges = getAgeBins(rawData, victimAgeScale);
	const victimGenderCounts = countTypes(rawData, "sex");
	return {
		victimRelationships,
		victimAges,
		victimAgeScale,
		victimGenderCounts,
	};
}

function getRelationshipCounts(victims) {
	return victims.reduce((allCounts, victim) => {
		if (allCounts[victim.relationshipcat]) {
			allCounts[victim.relationshipcat] += 1;
		} else {
			allCounts[victim.relationshipcat] = 1;
		}
		return allCounts;
	}, {});
}
