<script>
import { onMount } from "svelte";
// PROPS
export let incidents;

let wrapEl;
let width;
let victims;
let height;
let sortedIncidents;
let mode = "incidents";

// chart sizing properties
let squareSize = 15;
let squareMargin = 1;
let numCols = 20;
let colorsByType = {
  "Public": "#A61103",
  "Family": "#D9501E",
  "Unsolved": "#416986",
  "Other": "#8C8C8C",
  "Felony": "#590902"
};

$: if (width) {
  squareSize = width < 600 ? 10 : 15;
  squareMargin = width < 600 ? 1 : 1;
}

// function to sort incidents by type
function sortByType(incidents) {

  // maybe this should be dynamic and order based on count of each
  let order = ["Family", "Public", "Felony", "Other", "Unsolved"]
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

$: sortedIncidents = sortByType(incidents);

$: victims = sortedIncidents.reduce((all, incident) => {
  for (var i = 0; i < incident.victims; i +=1) {
    all.push(incident.type);
  }
  return all;
}, []);

$: height = mode == "incidents" ? (Math.floor(incidents.length / numCols) * (squareSize + squareMargin)) : (Math.floor(victims.length / numCols) * (squareSize + squareMargin));

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

onMount(() => {
  width = wrapEl.offsetWidth;
})
</script>
<div class="incident-type-wrap" bind:this={wrapEl}>
<div class="select-wrap">
  <select name="type-mode" id="" bind:value={mode}>
    <option value="incidents">Incidents</option>
    <option value="victims">Victims</option>
  </select>
</div>
<svg class="incident-type-chart" height={height}>
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
</div>