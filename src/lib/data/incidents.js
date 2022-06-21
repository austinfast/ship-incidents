import { getDataURL, getDataFromURL } from "./index.js";
import { parseDate } from "../dates.js";

// export const incidentData = getIncidentData();
let incidentData = null;

export function getIncidentData() {
	if (!incidentData) {
		console.log("incident data doesn't exist, generating");
		incidentData = generateIncidentData();
	} else {
		console.log("incident data already exists, using copy");
	}
	return incidentData;
}

async function generateIncidentData() {
	console.log("get incident data");
	const dataURL = getDataURL("incidents.json");
	const rawIncidents = await getDataFromURL(dataURL);
	// incident lookup object
	let incidentLookup = {};

	// parse real dates and add incidents to lookup for easy access
	for (var incident of rawIncidents.incidents) {
		// a real JS date
		incident.real_date = parseDate(incident.date);
		// add incident to lookup, keyed by id
		incidentLookup[incident.id] = incident;
	};

	return {
		incidents: rawIncidents.incidents,
		incidentLookup,
		yearlySummaries: rawIncidents.yearlySummaries,
		overallSummary: rawIncidents.overallSummary,
		locationTypes: rawIncidents.locationTypes,
	};
}
