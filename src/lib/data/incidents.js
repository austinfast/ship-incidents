import { getDataURL, getDataFromURL, countTypes } from "./index.js";
import { parseDate, yearFromStringDate } from "../dates.js";

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

	// set parse and set a few additional variables for each incident
	rawIncidents.incidents.forEach((incident) => {
		// a real JS date
		incident.real_date = parseDate(incident.date);

		// a string version of just the year
		incident.year = incident.date ? yearFromStringDate(incident.date) : null;
		incidentLookup[incident.id] = incident;
	});
	// format yearly summary data
	const yearlySummaries = formatYearlySummaries(rawIncidents.incidents);

	// format overall summary data
	const overallSummary = formatOverallSummary(yearlySummaries);

	// count location types
	const locationTypes = countTypes(rawIncidents.incidents, "location_type");

	return {
		incidents: rawIncidents.incidents,
		incidentLookup,
		yearlySummaries,
		overallSummary,
		locationTypes,
	};
}
/*
 * Summarizes various high level statistics for each year of data
 */
function formatYearlySummaries(rawIncidents) {
	let yearsData = [];
	let years = getAllYears(rawIncidents);
	years.forEach((year) => {
		if (year == "null") {
			return;
		}
		let incidents = rawIncidents.filter((d) => d.year == year);
		let yearSummary = incidents.reduce(
			(yearInfo, incident) => {
				return Object.assign(yearInfo, {
					victims: yearInfo.victims + incident.victims,
					mass_shooting_victims:
						incident.metaType == "mass_shooting" ||
						incident.metaType == "mass_public_shooting"
							? yearInfo.mass_shooting_victims + incident.victims
							: yearInfo.mass_shooting_victims,
					non_public_mass_shooting_victims:
						incident.metaType == "mass_shooting"
							? yearInfo.non_public_mass_shooting_victims + incident.victims
							: yearInfo.non_public_mass_shooting_victims,
					mass_public_shooting_victims:
						incident.metaType == "mass_public_shooting"
							? yearInfo.mass_public_shooting_victims + incident.victims
							: yearInfo.mass_public_shooting_victims,
					numinjured: yearInfo.numinjured + incident.numinjured,
					incidents: yearInfo.incidents + 1,
					incidents_family:
						incident.type == "Family"
							? yearInfo.incidents_family + 1
							: yearInfo.incidents_family,
					incidents_public:
						incident.type == "Public"
							? yearInfo.incidents_public + 1
							: yearInfo.incidents_public,
					incidents_felony:
						incident.type == "Felony"
							? yearInfo.incidents_felony + 1
							: yearInfo.incidents_felony,
					incidents_other:
						incident.type == "Other" || incident.type == "Unsolved"
							? yearInfo.incidents_other + 1
							: yearInfo.incidents_other,
					mass_shootings:
						incident.metaType == "mass_shooting" ||
						incident.metaType == "mass_public_shooting"
							? yearInfo.mass_shootings + 1
							: yearInfo.mass_shootings,
					non_public_mass_shootings:
						incident.metaType == "mass_shooting"
							? yearInfo.non_public_mass_shootings + 1
							: yearInfo.non_public_mass_shootings,
					mass_public_shootings:
						incident.metaType == "mass_public_shooting"
							? yearInfo.mass_public_shootings + 1
							: yearInfo.mass_public_shootings,
					non_shooting_mass_killings:
						incident.metaType == "mass_killing"
							? yearInfo.non_shooting_mass_killings + 1
							: yearInfo.non_shooting_mass_killings,
					non_shooting_mass_killing_victims:
						incident.metaType == "mass_killing"
							? yearInfo.non_shooting_mass_killing_victims + incident.victims
							: yearInfo.non_shooting_mass_killing_victims,
				});
			},
			{
				year,
				year_date: parseDate(year + "-1-1"),
				victims: 0,
				numinjured: 0,
				incidents: 0,
				mass_public_shootings: 0,
				mass_public_shooting_victims: 0,
				mass_shootings: 0,
				mass_shooting_victims: 0,
				non_public_mass_shootings: 0,
				non_public_mass_shooting_victims: 0,
				non_shooting_mass_killings: 0,
				non_shooting_mass_killing_victims: 0,
				incidents_family: 0,
				incidents_public: 0,
				incidents_felony: 0,
				incidents_other: 0,
			}
		);
		yearsData.push(yearSummary);
	});
	return yearsData;
}

function getAllYears(rawIncidents) {
	return Array.from(new Set(rawIncidents.map((d) => d.year))).sort(
		(a, b) => parseInt(a) - parseInt(b)
	);
}
/*
 * Summarizes various high level statistics across all years
 */
function formatOverallSummary(yearly_summaries) {
	const summary = {
		victims: 0,
		mass_shooting_victims: 0,
		mass_public_shooting_victims: 0,
		numinjured: 0,
		incidents: 0,
		mass_shootings: 0,
		mass_public_shootings: 0,
		incidents_family: 0,
		incidents_public: 0,
		incidents_felony: 0,
		incidents_other: 0,
	};
	yearly_summaries.forEach((yearlyData) => {
		summary.victims += yearlyData.victims;
		summary.mass_shooting_victims += yearlyData.mass_shooting_victims;
		summary.mass_public_shooting_victims += yearlyData.mass_public_shooting_victims;
		summary.numinjured += yearlyData.numinjured;
		summary.incidents += yearlyData.incidents;
		summary.mass_shootings += yearlyData.mass_shootings;
		summary.mass_public_shootings += yearlyData.mass_public_shootings;
		summary.incidents_family += yearlyData.incidents_family;
		summary.incidents_public += yearlyData.incidents_public;
		summary.incidents_felony += yearlyData.incidents_felony;
		summary.incidents_other += yearlyData.incidents_other;
	});
	return summary;
}
