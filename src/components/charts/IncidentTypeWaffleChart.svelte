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
</style>
<div class="incident-type-wrap" bind:this={wrapEl}>
<div class="select-wrap">
  <select name="type-mode" id="" class="incident-type-select" bind:value={mode}>
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