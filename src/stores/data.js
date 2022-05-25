import { urlFor } from "../lib/urls.js";
import { scaleLinear, max, histogram } from "d3";
import { parseDate, yearFromStringDate } from "../lib/dates.js";

// @TODO should perhaps split out the utility functions into utils/ and seperate the incidentData store 
// from the victimData store, and eventually the offender and gun stores as well, so that I can include 
// each of them seperately in the iframe embed outputs

// Map to store cached data
const cache = new Map();

// Svelte stores that are Promises that resolve to fetched data;
// what is the point of these being stores at this stage? i'm unable to do anything reactive
// since I'm using Promises anyways....
export const incidentData = getIncidentData();
export const victimData = getVictimData();

export async function getIncidentData() {
	console.log("get incident data");
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

	return {
		incidents: rawIncidents,
		incidentLookup,
		yearlySummaries,
		overallSummary,
		locationTypes,
	};
}

export async function getVictimData() {
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

function getDataURL(filename) {
	// function to determine the correct URL path for data files. Currently only returns relative path.
	if (process.env.MK_DATA_ROOT) {
		return `${process.env.MK_DATA_ROOT}/${filename}`;
	}
	let url = "data/" + filename;
	return urlFor(url);
}

// function that returns a Promise that resolves to data for a corresponding URL, either from cache or fetch()
function getDataFromURL(url) {
	if (!cache.has(url)) {
		console.log("fetching fresh from server " + url);
		// fetch url and store a Promise that resolves to the data
		const data = fetch(url).then((resp) => resp.json());
		cache.set(url, data);
	}
	return cache.get(url);
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
function countTypes(rawEntries, countKey, nullKey = "Unknown") {
	let typeLookup = {};
	let typeArray = [];

	rawEntries.forEach((entry) => {
		// if the countKey value is a string count that string
		if (typeof entry[countKey] == "string" && entry[countKey].length > 0) {
			if (typeLookup[entry[countKey]]) {
				typeLookup[entry[countKey]] += 1;
			} else {
				typeLookup[entry[countKey]] = 1;
			}
		}
		// if the countKey value is null, then use the nullKey to count
		else if (entry[countKey] == null || entry[countKey] == "" || !entry[countKey]) {
			if (typeLookup[nullKey]) {
				typeLookup[nullKey] += 1;
			} else {
				typeLookup[nullKey] = 1;
			}
			// if the countKey value is an array, count for each item in array
		} else if (typeof entry[countKey] == "object") {
			entry[countKey].forEach((countCategory) => {
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

function getAgeScale(people) {
	return scaleLinear()
		.domain([
			0,
			max(
				people.filter((person) => person.age !== null),
				(d) => d.age
			),
		])
		.range([0, 1]);
}

function getAgeBins(people, ageScale) {
	let ageBins = histogram()
		.domain(ageScale.domain())
		.thresholds(ageScale.ticks(20))
		.value((d) => d.age);
	return ageBins(people.filter((person) => person.age !== null));
}
