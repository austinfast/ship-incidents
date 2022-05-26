import { getDataURL, getDataFromURL, countTypes, getAgeBins, getAgeScale} from "./index.js";

export const offenderData = getOffenderData();

async function getOffenderData() {
	console.log("get offender data");
	const dataURL = getDataURL("offenders.json");
	const rawData = await getDataFromURL(dataURL);
	// clean offenders
	const cleanedOffenders = cleanOffenders(rawData);

	// offender age bins
	const offenderAgeScale = getAgeScale(cleanedOffenders);
	const offenderAges = getAgeBins(cleanedOffenders, offenderAgeScale);

	// offender sex
	const offenderGenderCounts = countTypes(cleanedOffenders, "sex");
	return {
		offenders: cleanedOffenders,
		offenderAgeScale,
		offenderAges,
		offenderGenderCounts
	}
}

function cleanOffenders(rawOffenders) {
	return rawOffenders.map((offender) => {
		let cleanOffender = Object.assign({}, offender);
		// replace empty and null sex fields with "Unknown"
		if (cleanOffender.sex == "" || cleanOffender.sex == null) {
			cleanOffender.sex = "Unknown";
		}
		return cleanOffender;
	});
}
