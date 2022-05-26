import { getDataURL, getDataFromURL, countTypes, getAgeBins, getAgeScale } from "./index.js";

export const victimData = getVictimData();

async function getVictimData() {
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
