import { getDataURL, getDataFromURL } from "./index.js";

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
	//@TODO move this to back end
	const victimRelationships = getRelationshipCounts(rawData.victims);

	return {
		victimRelationships: victimRelationships,
		victimAges: rawData.summaries.victimAges,
		victimGenderCounts: rawData.summaries.victimGenderCounts,
		totalVictims: rawData.victims.length,
		updated_at: rawData.updated_at
	};
}

//@TODO move this to back end
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
