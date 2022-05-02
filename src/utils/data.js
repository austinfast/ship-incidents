// async polyfill
import "regenerator-runtime/runtime";
import { scaleLinear, histogram, max } from "d3";
import { urlFor } from "./urls.js";
import { yearFromStringDate } from "./text.js";

class DataManager {
	constructor() {
		this._data = null;
	}
	async getData() {
		// this function returns all data, formatted and ready to go. Returns a cached version if data has been loaded already.
		if (!this._data) {
			// request data from JSON files
			const response = await fetch(this.getDataURL("all.json"));
			let rawData = await response.json();
			this._data = rawData;

			// incident lookup object
			this._data.incidentLookup = {};

			// set parse and set a few additional variables for each incident
			this._data.incidents.forEach((incident) => {
				// a real JS date
				incident.real_date = this.parseDate(incident.date);

				// a string version of just the year
				incident.year = incident.date ? yearFromStringDate(incident.date) : null;
				this._data.incidentLookup[incident.id] = incident;
			});

			// format yearly summary data
			this._data["yearly_summaries"] = this.formatYearlySummaries(rawData.incidents);

			// fetch geographic data seperately
			this._data["incidents_geo"] = await (await this.getGeoData()).json();

			// count location types
			this._data["location_type_counts"] = this.countTypes(
				rawData.incidents,
				"location_type"
			);

			// count gun types
			this._data["gun_type_counts"] = this.countTypes(
				rawData.incidents,
				"gun_type_array"
			);

			// count victim relationships
			this._data["victim_relationship_counts"] = this.getRelationshipCounts(
				rawData.victims
			);

			// victims age bins
			this._data["victim_age_scale"] = this.getAgeScale(this._data.victims);
			this._data["victim_binned_ages"] = this.getAgeBins(
				this._data.victims,
				this._data.victim_age_scale
			);
			this._data["victim_gender_counts"] = this.countTypes(this._data.victims, "sex");

			// clean offenders
			this._data["offenders"] = this.cleanOffenders(this._data["offenders"]);

			// offender age bins
			this._data["offender_age_scale"] = this.getAgeScale(this._data.offenders);
			this._data["offender_binned_ages"] = this.getAgeBins(
				this._data.offenders,
				this._data.offender_age_scale
			);

			// offender sex
			this._data["offender_gender_counts"] = this.countTypes(
				this._data.offenders,
				"sex"
			);
		}
		return this._data;
	}

	async getGeoData() {
		// function requests geographically projected data file
		return await fetch(this.getDataURL("incidents_geo_projected.json"));
	}

	getDataURL(filename) {
		// function to determine the correct URL path for data files. Currently only returns relative path.
		let url = "data/json/" + filename;
		return urlFor(url);
	}

	getAllYears(rawIncidents) {
		return rawIncidents
			.map((d) => d.year)
			.filter((value, index, self) => self.indexOf(value) === index)
			.sort((a, b) => parseInt(a) - parseInt(b));
	}

	formatYearlySummaries(rawIncidents) {
		let yearsData = [];
		let years = Object.keys(this.getAllYears(rawIncidents));
		years.forEach((year) => {
			if (year == "null") {
				return;
			}
			let incidents = rawIncidents.filter((d) => d.year == year);
			let yearSummary = incidents.reduce(
				(yearInfo, incident) => {
					//TODO: eventually I would like to add a metaType field on the back end that categorizes the mass public shootings, mass shootings ahead of time so we dont need to do that here
					return Object.assign(yearInfo, {
						victims: yearInfo.victims + incident.victims,
						mass_shooting_victims:
							incident.firstcod == "Shooting"
								? yearInfo.mass_shooting_victims + incident.victims
								: yearInfo.mass_shooting_victims,
						mass_public_shooting_victims:
							incident.firstcod == "Shooting" && incident.type == "Public"
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
							incident.firstcod == "Shooting"
								? yearInfo.mass_shootings + 1
								: yearInfo.mass_shootings,
						mass_public_shootings:
							incident.firstcod == "Shooting" && incident.type == "Public"
								? yearInfo.mass_public_shootings + 1
								: yearInfo.mass_public_shootings,
					});
				},
				{
					year,
					year_date: this.parseDate(year + "-1-1"),
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

	parseDate(dateStr) {
		// handle null dates
		if (!dateStr) {
			return null;
		}
		let dateParts = dateStr.split("-");
		let date = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2], 12);
		return date;
	}

	countTypes(rawIncidents, countKey, nullKey = "Unknown") {
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

	parseGunTypes(gun_type_string) {
		if (!gun_type_string) {
			return ["Unknown"];
		}
		let split_1 = gun_type_string.split("&");
		if (split_1.length < 2) {
			// if type is blank, override to "Unknown"
			if (split_1 == "") {
				return ["Unknown"];
			}
			return split_1;
		}
		let split_2 = split_1[0].split(",");
		let result = split_2.concat([split_1[1]]);
		result.forEach((item, i) => {
			result[i] = item.trim();
		});
		return result;
	}

	getRelationshipCounts(victims) {
		return victims.reduce((allCounts, victim) => {
			if (allCounts[victim.relationshipcat]) {
				allCounts[victim.relationshipcat] += 1;
			} else {
				allCounts[victim.relationshipcat] = 1;
			}
			return allCounts;
		}, {});
	}

	getAgeScale(people) {
		let people_with_ages = people.filter((person) => person.age !== null);
		return scaleLinear()
			.domain([0, max(people_with_ages, (d) => d.age)])
			.range([0, 1]);
	}

	getAgeBins(people, age_scale) {
		// filter out null ages
		let people_with_ages = people.filter((person) => person.age !== null);

		let age_bins = histogram()
			.domain(age_scale.domain())
			.thresholds(age_scale.ticks(20))
			.value((d) => d.age);

		return age_bins(people_with_ages);
	}

	cleanOffenders(raw_offenders) {
		return raw_offenders.map((offender) => {
			let clean_offender = Object.assign({}, offender);
			// replace empty and null sex fields with "Unknown"
			if (clean_offender.sex == "" || clean_offender.sex == null) {
				clean_offender.sex = "Unknown";
			}
			return clean_offender;
		});
	}
}

export default DataManager;
