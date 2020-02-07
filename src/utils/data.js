class DataManager {
  constructor() {
    this._data = null;
  }
  async getData() {
    if (!this._data) {
      const response = await fetch(this.getDataURL("all.json"))
      let rawData = await response.json();
      this._data = rawData;
      this._data.incidents.forEach(incident => {
        incident.real_date = this.parseDate(incident.date);
        incident.year = incident.date ? incident.date.split("-")[0] : null;
      });
      this._data["timeline"] = this.formatTimeline(rawData.incidents);
      this._data["yearly_summaries"] = this.formatYearlySummaries(rawData.incidents);
      this._data["incidents_geo"] = await (await this.getGeoData()).json();
    }
    return this._data;
  }

  async getGeoData() {
    return await fetch(this.getDataURL("incidents_geo_projected.json"));
  }

  getDataURL(filename) {
    let url = "static/data/json/" + filename;
    return url;
  }

  formatTimeline(rawIncidents) {
    let incidentsByYear = {};
    for (var i = 0; i < rawIncidents.length; i += 1) {
      let incident = rawIncidents[i];
      let year = incident.year;
      if (incidentsByYear[year]) {
        incidentsByYear[year].push(incident);
      } else {
        incidentsByYear[year] = [incident];
      }
    }
    return incidentsByYear;
  }

  formatYearlySummaries(rawIncidents) {
    let yearsData = [];
    let years = Object.keys(this._data.timeline);
    years.forEach((year) => {
    if(year == "null") {
      return;
    }
    let incidents = this._data.timeline[year];
    let yearSummary = incidents.reduce((yearInfo, incident) => {
      return Object.assign(yearInfo, {
        victims: yearInfo.victims + incident.victims,
        mass_shooting_victims: incident.firstcod == "Shooting" ? yearInfo.mass_shooting_victims + 1 : yearInfo.mass_shooting_victims,
        mass_public_shooting_victims: incident.firstcod == "Shooting" && incident.type == "Public" ? yearInfo.mass_public_shooting_victims + 1 : yearInfo.mass_public_shooting_victims,
        numinjured: yearInfo.numinjured + incident.numinjured,
        incidents: yearInfo.incidents + 1,
        incidents_family: incident.type == "Family" ? yearInfo.incidents_family + 1 : yearInfo.incidents_family,
        incidents_public: incident.type == "Public" ? yearInfo.incidents_public + 1 : yearInfo.incidents_public,
        incidents_felony: incident.type == "Felony" ? yearInfo.incidents_felony + 1 : yearInfo.incidents_felony,
        incidents_other: incident.type == "Other" || incident.type == "Unsolved" ? yearInfo.incidents_other + 1 : yearInfo.incidents_other,
        mass_shootings: incident.firstcod == "Shooting" ? yearInfo.mass_shootings + 1 : yearInfo.mass_shootings,
        mass_public_shootings: incident.firstcod == "Shooting" && incident.type == "Public" ? yearInfo.mass_public_shootings + 1 : yearInfo.mass_public_shootings
      });
      }, {
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
        incidents_other: 0
      });
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
    let date = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2], 12)
    return date;
  }


}

export default DataManager;