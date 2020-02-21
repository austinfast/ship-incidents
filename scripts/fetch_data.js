const path = require("path");
const sander = require("sander");
const axios = require("axios");
const mapshaper = require("mapshaper");
const reproject = require("dirty-reprojectors");
const projections = require("dirty-reprojectors/projections");


// list of the final fields included in the victims data
const victim_fields = ["relationshipcat", "age"];


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
  const family = ["Sibling", "Spouse", "Cousin", "Child (including step)", "Parent", "Niece/Nephew", "Other familial relationship", "Aunt/Uncle", "Relative in law", "Grandparent", "Grandchild", "Relative or in-law", "Child or stepchild", "Parent or stepparent", "Ex dating relationship", "Dating relationship", "Ex spouse", "Ex relative in law"];
  const acquaintance = ["Neighbor", "Coworker or employer", "Classmate", "Roommate", "Friend",  "Co-worker or employer", "Criminal associate", "Individual with some non-blood/marriage relationship to a known person", "Relative of a known person", "Other", "Acquaintence"];
  const first_responder = ["First responder"];
  const stranger = ["Random bystander/stranger"];
  const unknown = ["Unknown"]
  return victims.map((victim) => {
    let relationshipcat;
    if (family.indexOf(victim.vorelationship) >= 0) {
      relationshipcat = "family";
    } else if (acquaintance.indexOf(victim.vorelationship) >= 0) {
      relationshipcat = "acquaintance"
    } else if (first_responder.indexOf(victim.vorelationship) >= 0) {
      relationshipcat = "first_responder"
    } else if (stranger.indexOf(victim.vorelationship) >= 0) {
      relationshipcat = "stranger"
    } else if (unknown.indexOf(victim.vorelationship >= 0)) {
      relationshipcat = "unknown"
    } else if (!victim.vorelationship) {
      relationshipcat = "unknown";
    }
    let victim_with_category = Object.assign({}, victim, {
      relationshipcat
    });
    let clean_victim = {};
    victim_fields.forEach(field => {
      clean_victim[field] = victim_with_category[field];
    });
    return clean_victim;
  });
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
    let incidents_w_year = all_data.incidents.map((incident) => {
      return Object.assign({}, incident, {
        year: incident.date ? incident.date.split("-")[0] : null
      });
    });
    all_data.victims = categorize_relationships(all_data.victims);
    all_data.incidents = incidents_w_year;
    return Promise.all([
      sander.writeFile(path.join(output_dir, "json", "all.json"), JSON.stringify(all_data)),
      sander.writeFile(path.join(output_dir, "json", "incidents.json"), JSON.stringify(all_data.incidents)),
      sander.writeFile(path.join(output_dir, "json", "victims.json"), JSON.stringify(all_data.victims)),
      sander.writeFile(path.join(output_dir, "json", "offenders.json"), JSON.stringify(all_data.offenders))
    ]);
  })
  // create geojson file of incidents
  .then((d) => {
    const command = `-i ${path.join(output_dir, "json", "incidents.json")} encoding=utf8 -filter-fields "latitude,longitude,victims,type,casename,date,city,state,id" -points x=longitude y=latitude -o ${path.join(output_dir, "json", "incidents_geo.json")} format=geojson`
    return mapshaper.runCommands(command)
  })
  // load the geojson
  .then(() => {
    return sander.readFile(path.join(output_dir, "json", "incidents_geo.json"), {encoding: "utf8"})
  })
  // reproject geojson into mapbox friendly albers projection
  .then(geometry => {
    let geo = JSON.parse(geometry);
    var features = geo.features;
    let options = {
      forward: "albersUsa",
      reverse: 'mercator',
      projections
    };
    let reprojected = features.map(feature => {
      let reprojectedPoint = reproject(options, feature.geometry);
      return Object.assign({}, feature, {
        geometry: reprojectedPoint
      });
    });
    geo.features = reprojected;
    return sander.writeFile(path.join(output_dir, "json", "incidents_geo_projected.json"), JSON.stringify(geo));
  })
  .catch(e => {
    console.warn(e);
    process.exit(1);
  });