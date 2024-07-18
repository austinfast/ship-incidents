/*
//import { getDataURL, getDataFromURL } from "./index.js";
import { parseDate } from "../dates.js";
import rawIncidents from "./casualties.json"; // Import JSON file

//	let incidents = rawIncidents.casualties
//	console.log("data:", incidents);


// export const incidentData = getIncidentData();
let incidentData = null;

export function getIncidentData() {
	//if (!incidentData) {
		incidentData = generateIncidentData();
	//} else {
	//}
	return incidentData;
}

async function generateIncidentData() {
	//const dataURL = getDataURL("incidents.json");
	//const rawIncidents = await getDataFromURL(dataURL);
	// incident lookup object
	///let incidentLookup = {};

	// parse real dates and add incidents to lookup for easy access
	for (var incident of rawIncidents.casualties) {
		// a real JS date
		incident.real_date = parseDate(incident.date);
		// add incident to lookup, keyed by id
	///	incidentLookup[incident.id] = incident;
	};
	//let incidents = rawIncidents.casualties
	//console.log("data:", incidents);

	return {
		incidents: rawIncidents.casualties,//rawIncidents.incidents,
		//incidentLookup,
		//yearlySummaries: rawIncidents.yearlySummaries,
		//overallSummary: rawIncidents.overallSummary,
		//locationTypes: rawIncidents.locationTypes,
		//updated_at: new Date(rawIncidents.updated_at)
	};
	console.log (incidents);
}
*/

import { parseDate } from "../dates.js";
import rawIncidents from "./casualties.json"; // Import JSON file

let incidentData = null;

export function getIncidentData() {
  if (!incidentData) {
    incidentData = generateIncidentData();
  }
  return incidentData;
}

async function generateIncidentData() {
  const incidents = rawIncidents.casualties.map(incident => ({
    ...incident,
    real_date: parseDate(incident.date) // Assuming parseDate correctly parses the date
  }));

  return {
    incidents,
    // Add other data if needed
  };
}


