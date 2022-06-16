import { getDataURL, getDataFromURL } from "./index.js";

let offenderData = null;

export function getOffenderData() {
	if (!offenderData) {
		console.log("offender data doesn't exist, generating");
		offenderData = generateOffenderData();
	} else {
		console.log("offender data already exists, using copy");
	}
	return offenderData;
}

async function generateOffenderData() {
	console.log("get offender data");
	const dataURL = getDataURL("offenders.json");
	const rawData = await getDataFromURL(dataURL);

	// offender age bins
	//@TODO remove this and do it on the back end

	// offender sex
	//@TODO remove this and do it on the back end
	return {
		offenders: rawData.offenders,
		offenderAges: rawData.summaries.offenderAges,
		offenderGenderCounts: rawData.summaries.offenderGenderCounts,
		offenderRaceCounts: rawData.summaries.offenderRaceCounts,
		updated_at: rawData.updated_at
	}
}
