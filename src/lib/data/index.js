import { urlFor } from "../urls.js";
import { scaleLinear, max, histogram } from "d3";
import { parseDate, yearFromStringDate } from "../dates.js";

// Map to store cached data
export const cache = new Map();

export function getDataURL(filename) {
	// function to determine the correct URL path for data files. Currently only returns relative path.
	if (process.env.MK_DATA_ROOT) {
		return `${process.env.MK_DATA_ROOT}/${filename}`;
	}
	let url = "data/" + filename;
	return urlFor(url);
}

// function that returns a Promise that resolves to data for a corresponding URL, either from cache or fetch()
export function getDataFromURL(url) {
	if (!cache.has(url)) {
		console.log("fetching fresh from server " + url);
		// fetch url and store a Promise that resolves to the data
		const data = fetch(url).then((resp) => resp.json());
		cache.set(url, data);
	}
	return cache.get(url);
}

export function countTypes(rawEntries, countKey, nullKey = "Unknown") {
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

export function getAgeScale(people) {
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

export function getAgeBins(people, ageScale) {
	let ageBins = histogram()
		.domain(ageScale.domain())
		.thresholds(ageScale.ticks(20))
		.value((d) => d.age);
	return ageBins(people.filter((person) => person.age !== null));
}
