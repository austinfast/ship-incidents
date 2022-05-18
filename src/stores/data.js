import { writable } from "svelte/store";
import { urlFor } from "../utils/urls.js";
import { parseDate, yearFromStringDate } from "../utils/dates.js";

const cache = new Map();
export const incidentData = writable(null);
export const victimData = writable(null);

export async function getIncidentData() {
	console.log("get incident data");
	incidentData.set(new Promise(() => {}));
	const dataURL = getDataURL("incidents.json");
	const rawIncidents = await getDataFromURL(dataURL);
	// incident lookup object
	let incidentLookup = {};

	// set parse and set a few additional variables for each incident
	rawIncidents.forEach((incident) => {
		// a real JS date
		incident.real_date = parseDate(incident.date);

		// a string version of just the year
		incident.year = incident.date ? yearFromStringDate(incident.date) : null;
		incidentLookup[incident.id] = incident;
	});
	// format yearly summary data
	const yearlySummaries = formatYearlySummaries(rawIncidents);

	// format overall summary data
	const overallSummary = formatOverallSummary(yearlySummaries);

	// count location types
	const locationTypes = countTypes(rawIncidents, "location_type");
	incidentData.set(
		Promise.resolve({
			incidents: rawIncidents,
			incidentLookup,
			yearlySummaries,
			overallSummary,
			locationTypes,
		})
	);
	return incidentData;
}

export async function getVictimData() {
	console.log("get victim data");
	victimData.set(new Promise(() => {}));
	const dataURL = getDataURL("victims.json");
	const rawData = await getDataFromURL(dataURL);
	// count victim relationships
	const victimRelationships = getRelationshipCounts(rawData);
	victimData.set(
		Promise.resolve({
			victimRelationships,
		})
	);
	return victimData;
}

function getDataURL(filename) {
	// function to determine the correct URL path for data files. Currently only returns relative path.
	if (process.env.MK_DATA_ROOT) {
		return `${process.env.MK_DATA_ROOT}/${filename}`;
	}
	let url = "data/" + filename;
	return urlFor(url);
}

// function that returns data for a corresponding URL, either from cache or fetch()
async function getDataFromURL(url) {
	if (cache.has(url)) {
		console.log("data cached for " + url);
		return cache.get(url);
	}
	console.log("fetching fresh from server " + url);
	const resp = await fetch(url);
	const data = await resp.json();
	cache.set(url, data);
	return data;
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
					mass_public_shootings:
						incident.metaType == "mass_public_shooting"
							? yearInfo.mass_public_shootings + 1
							: yearInfo.mass_public_shootings,
				});
			},
			{
				year,
				year_date: parseDate(year + "-1-1"),
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
			}
		);
		yearsData.push(yearSummary);
	});
	return yearsData;
}

function getAllYears(rawIncidents) {
	return rawIncidents
		.map((d) => d.year)
		.filter((value, index, self) => self.indexOf(value) === index)
		.sort((a, b) => parseInt(a) - parseInt(b));
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
function countTypes(rawIncidents, countKey, nullKey = "Unknown") {
	let typeLookup = {};
	let typeArray = [];

	rawIncidents.forEach((incident) => {
		// if the countKey value is a string count that string
		if (typeof incident[countKey] == "string") {
			if (typeLookup[incident[countKey]]) {
				typeLookup[incident[countKey]] += 1;
			} else {
				typeLookup[incident[countKey]] = 1;
			}
		}
		// if the countKey value is null, then use the nullKey to count
		else if (incident[countKey] == null) {
			if (typeLookup[nullKey]) {
				typeLookup[nullKey] += 1;
			} else {
				typeLookup[nullKey] = 1;
			}
			// if the countKey value is an array, count for each item in array
		} else if (typeof incident[countKey] == "object") {
			incident[countKey].forEach((countCategory) => {
				if (typeLookup[countCategory]) {
					typeLookup[countCategory] += 1;
				} else {
					typeLookup[countCategory] = 1;
				}
			});
		}
	});

	for (var key in typeLookup) {
		typeArray.push({
			label: key,
			count: typeLookup[key],
		});
	}

	return typeArray.sort((a, b) => b.count - a.count);
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
