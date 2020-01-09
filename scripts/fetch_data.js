const path = require("path");
const sander = require("sander");
const axios = require("axios");
const mapshaper = require("mapshaper");
const reporoject = require("dirty-reprojectors");
const projections = require("dirty-reprojectors/projections");


// function to grab necessary environment variables
function get_auth() {
  const email = process.env.MASS_KILLINGS_DB_EMAIL || null;
  const password = process.env.MASS_KILLINGS_DB_PASSWORD || null;
  if (!email || !password) {
    console.warn("Credentials not found. Please make sure $MASS_KILLINGS_DB_EMAIL and $MASS_KILLINGS_DB_PASSWORD are set in your environment.");
    process.exit(1);
  }
  return {
    email,
    password
  };
}

// function to categorize victims relationships in to clean categories

function categorize_relationships(victims) {
  const family = ["Sibling", "Spouse", "Cousin", "Child (including step)", "Parent", "Niece/Nephew", "Other familial relationship", "Aunt/Uncle", "Relative in law", "Grandparent", "Grandchild", "Relative or in-law", "Child or stepchild", "Parent or stepparent"];
  const second_degree = ["Ex dating relationship", "Neighbor", "Coworker or employer", "Classmate", "Roommate", "Friend", "Dating relationship", "Ex spouse", "Co-worker or employer", "Criminal associate"];
  const third_degree = ["Individual with some non-blood/marriage relationship to a known person", "Relative of a known person", "Other", "Ex relative in law", "Acquaintence"]
  const stranger = ["Random bystander/stranger", "First responder"]
  return victims.map((victim) => {
    let relationshipcat;
    if (family.indexOf(victim.vorelationship) >= 0) {
      relationshipcat = "family";
    } else if (second_degree.indexOf(victim.vorelationship) >= 0) {
      relationshipcat = "second-degree"
    } else if (third_degree.indexOf(victim.vorelationship) >= 0) {
      relationshipcat = "third-degree"
    } else if (stranger.indexOf(victim.vorelationship) >= 0) {
      relationshipcat = "stranger"
    } else if (!victim.vorelationship) {
      relationshipcat = null;
    }
    return Object.assign({}, victim, {
      relationshipcat
    });
  });
} 


// function to create geojson of incidents
async function createIncidentGeo(inputFile, outputFile) {
  const command = `-i ${inputFile} encoding=utf8 -filter-fields "latitude,longitude,victims,type,casename,date,city,state,id" -points x=longitude y=latitude -o ${outputFile} format=geojson`
  let result = await mapshaper.applyCommands(command);
  return result;
}

// output data directory
const output_dir = path.join(__dirname, "../src/static/data");
const auth_credentials = get_auth();
const api_token_url = "http://mka.ap.org/api/v1/tokens";
const api_data_url = "http://mka.ap.org/api/v1/all";

// first, generate a fresh API token
// http://mka.ap.org/admin/api
axios.post(api_token_url, auth_credentials)
  .then((response) => {
    return response.data.token;
  })
  // then request new data
  .then((token) => {
    return axios.get(api_data_url, {
      headers: {
        "Authorization": token
      }
    })
  })
  // write data to json files
  .then((response) => {
    let all_data = response.data;
    let { incidents, victims, offenders} = all_data;
    let incidents_w_year = incidents.map((incident) => {
      return Object.assign({}, incident, {
        year: incident.date.split("-")[0]
      });
    });
    victims = categorize_relationships(victims);
    return Promise.all([
      sander.writeFile(path.join(output_dir, "json", "all.json"), JSON.stringify(all_data)),
      sander.writeFile(path.join(output_dir, "json", "incidents.json"), JSON.stringify(incidents_w_year)),
      sander.writeFile(path.join(output_dir, "json", "victims.json"), JSON.stringify(victims)),
      sander.writeFile(path.join(output_dir, "json", "offenders.json"), JSON.stringify(offenders))
    ]);
  })
  .then((d) => {
    const command = `-i ${path.join(output_dir, "json", "incidents.json")} encoding=utf8 -filter-fields "latitude,longitude,victims,type,casename,date,city,state,id" -points x=longitude y=latitude -o ${path.join(output_dir, "json", "incidents_geo.json")} format=geojson`
    return mapshaper.runCommands(command)
  })
  .then(() => {
    return sander.readFile(path.join(output_dir, "json", "incidents_geo.json"), {encoding: "utf8"})
  })
  .then(geometry => {
    let geo = JSON.parse(geometry);
    var features = geo.features;
    let reprojected = features.map(feature => {
      return Object.assign({}, feature, {
        geometry: reporoject({
          forward: "albersUsa",
          projections: projections
        }, feature.geometry)
      })
    });
    geo.features = reprojected;
    return sander.writeFile(path.join(output_dir, "json", "incidents_geo_projected.json"), JSON.stringify(geo));
  })
  .catch(e => {
    console.warn(e);
    process.exit(1);
  });