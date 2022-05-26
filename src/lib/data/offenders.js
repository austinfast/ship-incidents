import { getDataURL, getDataFromURL, countTypes, getAgeBins, getAgeScale} from "./index.js";

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
