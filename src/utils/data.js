class DataManager {
  async getData() {
     const response = await fetch(this.getDataURL())
     let rawData = await response.json();
     rawData["timeline"] = this.formatTimeline(rawData.incidents);
     return rawData;
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


}

export default DataManager;