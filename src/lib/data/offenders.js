import { getDataURL, getDataFromURL } from "./index.js";

let offenderData = null;

export function getOffenderData() {
	if (!offenderData) {
		offenderData = generateOffenderData();
	}
	return offenderData;
}

async function generateOffenderData() {
	const dataURL = getDataURL("offenders.json");
	const rawData = await getDataFromURL(dataURL);

	return {
		offenders: rawData.offenders,
		offenderAges: rawData.summaries.offenderAges,
		offenderGenderCounts: rawData.summaries.offenderGenderCounts,
		offenderRaceCounts: rawData.summaries.offenderRaceCounts,
		updated_at: rawData.updated_at
	}
}
