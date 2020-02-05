<script>
import { onMount } from "svelte";
// PROPS
export let incidents;

let wrapEl;
let width;
let victims;
let height;
let mode = "incidents";
let counts;
let victimCounts;
let countLookup = {};
let order;
let victimOrder;
let victimCountLookup = {};
let sortedIncidents;

// chart sizing properties
let squareSize = 20;
let squareMargin = 1;
let numCols = 20;
let colorsByType = {
  "Public": "#A61103",
  "Family": "#D9501E",
  "Unsolved": "#416986",
  "Other": "#8C8C8C",
  "Felony": "#590902"
};

let labelPositions = [];


// get counts of each type
function getIncidentCounts() {
  let typeCounts = [];
  let types = incidents.reduce((types, incident) => {
    if (types.indexOf(incident.type) < 0 && incident.type) {
      return types.concat([incident.type]);
    } else {
      return types;
    }
  }, []);

  for (var i = 0; i < types.length; i += 1) {
    let type = types[i];
    let count = getCount(type);
    typeCounts.push([type, count]);
  }

  typeCounts = typeCounts.sort((a, b) => b[1] - a[1]);
  return typeCounts;
}

// get counts of victims of each type
function getVictimCounts() {
  let typeCounts = [];
  let types = victims.reduce((allTypes, victimType) => {
    if (allTypes.indexOf(victimType) < 0 && victimType) {
      return allTypes.concat([victimType]);
    } else {
      return allTypes;
    }
  }, []);
  for (var i = 0; i < types.length; i += 1) {
    let type = types[i];
    let count = victims.filter(victimType => victimType == type).length;
    typeCounts.push([type, count]);
  }

  typeCounts = typeCounts.sort((a, b) => b[1] - a[1]);
  return typeCounts;
}

// function to sort incidents by type
function sortByType(incidents) {

  return incidents.sort((a, b) => {
    for (var i = 0; i < order.length; i += 1) {
      let orderType = order[i];
      if (a.type == orderType) {
        return -1;
      } else if (b.type == orderType) {
        return 1;
      } 
    }
    return 0;
  });
}

function getCount(incidentType) {
  let incidentsByType = incidents.filter(incident => incident.type == incidentType);
  return incidentsByType.length;
}

function computeLabelPositions() {
  let labelOrder = mode == "incidents" ? order : victimOrder;
  let lookup = mode == "incidents" ? countLookup : victimCountLookup;
  return labelOrder.map((type, i) => {
    let numPrevious = i - 1;
    let totalPrevious = 0;
    while(numPrevious >= 0) {
      totalPrevious += lookup[order[numPrevious]];
      numPrevious -= 1;
    }
    let rows = Math.floor(totalPrevious / numCols) + Math.ceil(lookup[type] / numCols / 2);
    return [type, rows * (squareSize + squareMargin)];
  });
}

// take an index and return an x position;
function getXPosition(i) {
  return (i % numCols) * (squareSize + squareMargin);
}

// take an index and return a y position;
function getYPosition(i) {
  return Math.floor(i / numCols) * (squareSize + squareMargin);
}

// take a type and return a color
function getColor(type) {
  return colorsByType[type];
}

$: if (width) {
  squareSize = width < 600 ? 10 : 20;
  squareMargin = width < 600 ? 1 : 1;
  labelPositions = computeLabelPositions();
}

// set our dynamic variables based on our incidents;

// raw counts of each type
$: counts = getIncidentCounts();

// a lookup object of counts
$: countLookup = counts.reduce((lookup, typeCount) => {
  lookup[typeCount[0]] = typeCount[1];
  return lookup;
}, countLookup);

// ordering based on counts
$: order = counts.map(type => type[0]);
$: victimOrder = victimCounts.map(type => type[0]);

// sort the incidents based on order
$: sortedIncidents = sortByType(incidents);

// count victims by incident type
$: victims = sortedIncidents.reduce((all, incident) => {
  for (var i = 0; i < incident.victims; i +=1) {
    all.push(incident.type);
  }
  return all;
}, []);

$: if (victims) {
  victimCounts = getVictimCounts();
}

$: victimCountLookup = victimCounts.reduce((lookup, typeCount) => {
  lookup[typeCount[0]] = typeCount[1];
  return lookup;
}, victimCountLookup);
// re compute the height based on mode and the sizing variables
$: height = mode == "incidents" ? (Math.floor(incidents.length / numCols) * (squareSize + squareMargin)) : (Math.floor(victims.length / numCols) * (squareSize + squareMargin));

$: if(mode) {
  labelPositions = computeLabelPositions();
}

onMount(() => {
  width = wrapEl.offsetWidth;
  counts = getIncidentCounts();
  victimCounts = getVictimCounts();
  labelPositions = computeLabelPositions();

})
</script>
<style>
  .incident-type-select {
    display: block;
    font-size: var(--font-size-medium);
    font-weight: 700;
    color: #404040;
    padding: .6em 1.8em .5em .8em;
    cursor: pointer;
    /* width: 100%; */
    max-width: 100%;
    margin: 0;
    margin-bottom: 20px;
    border-radius: 0;
    border: none;
    /* border: 1px solid #aaa; */
    /* box-shadow: 0 1px 0 1px rgba(0,0,0,.04); */
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: url('data:image/svg+xml;charset=US-ASCII,<svg%20xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg"%20width%3D"292.4"%20height%3D"292.4"><path%20fill%3D%22%23404040%22%20d%3D"M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z"%2F><%2Fsvg>'),
      linear-gradient(to bottom, #D7D7D7 0%,#D7D7D7 100%);
    background-repeat: no-repeat, repeat;
    background-position: right .7em top 50%, 0 0;
    background-size: .65em auto, 100%;
  }

  .incident-type-chart-label-wrapper {
    display: flex;
  }
  
  .chart-labels-wrapper {
    position: relative;
    padding-left: 10px;
  }

  .chart-label {
    position: absolute;
    transform: translateY(-50%);
  }

  .chart-label p {
    margin: 0;
    font-size: var(--font-size-small);
    line-height: var(--line-height-small);
  }

  .chart-label p.type-count {
    font-size: var(--font-size-medium);
    line-height: var(--line-height-small);
    font-weight: 700;
    margin: 0;
  }
</style>
<div class="incident-type-wrap" bind:this={wrapEl}>
<div class="select-wrap">
  <select name="type-mode" id="" class="incident-type-select" bind:value={mode}>
    <option value="incidents">Incidents</option>
    <option value="victims">Victims</option>
  </select>
</div>
<div class="incident-type-chart-label-wrapper">
  <svg class="incident-type-chart" height={height} width={(squareSize + squareMargin) * numCols }>
    {#if mode == "incidents"}
    {#each incidents as incident, i}
      <rect 
        width={squareSize + "px"} 
        height={squareSize + "px"} 
        fill={getColor(incident.type)} 
        x={(i % numCols) * (squareSize + squareMargin)} 
        y={Math.floor(i / numCols) * (squareSize + squareMargin)}
      />
    {/each}
    {:else if mode == "victims"}
    {#each victims as victim, i}
      <rect 
        width={squareSize + "px"} 
        height={squareSize + "px"} 
        fill={getColor(victim)} 
        x={(i % numCols) * (squareSize + squareMargin)} 
        y={Math.floor(i / numCols) * (squareSize + squareMargin)}
      />
    {/each}
    {/if}
  </svg>
  <div class="chart-labels-wrapper">
    {#each labelPositions as label}
      <div class="chart-label"
        style={"top: " + label[1] + "px"}>
        <p class="type-count"
          style={"color: " + getColor(label[0]) + ";"}>{mode == "incidents" ? countLookup[label[0]] : victimCountLookup[label[0]]}</p>
        <p class="type-label">{label[0]}</p>
      </div>
    {/each}
  </div>
</div>
</div>