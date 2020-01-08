class DataManager {
  constructor() {
    this._data = null;
  }
  async getData() {
    if (!this._data) {
      const response = await fetch(this.getDataURL())
      let rawData = await response.json();
      this._data = rawData;
      this._data.incidents.forEach(incident => {
        incident.real_date = this.parseDate(incident.date);
      })
      this._data["timeline"] = this.formatTimeline(rawData.incidents);
    }
    return this._data;
  }

  getDataURL() {
    let url = "static/data/all.json";
    return url;
  }

  formatTimeline(rawIncidents) {
    let incidentsByYear = {};
    for (var i = 0; i < rawIncidents.length; i += 1) {
      let incident = rawIncidents[i];
      let year = incident.date.split("-")[0]
      incident.year = year;
      if (incidentsByYear[year]) {
        incidentsByYear[year].push(incident);
      } else {
        incidentsByYear[year] = [incident];
      }
    }
    return incidentsByYear;
  }

  parseDate(dateStr) {
    let dateParts = dateStr.split("-");
    let date = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2], 12)
    return date;
  }


}

export default DataManager;