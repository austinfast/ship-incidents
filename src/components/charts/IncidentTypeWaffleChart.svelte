<script>

// PROPS
export let incidents;

let victims;
let height;

// chart sizing properties
let squareSize = 10;
let squareMargin = 2;
let numCols = 10;
let colorsByType = {
  "Public": "#A61103",
  "Family": "#D9501E",
  "Unsolved": "#416986",
  "Other": "#8C8C8C",
  "Felony": "#590902"
};


$: victims = incidents.reduce((all, incident) => {
  for (var i = 0; i < incident.victims; i +=1) {
    all.push(incident.type);
  }
  return all;
}, []);

$: height = (Math.floor(incidents.length / numCols) * (squareSize + squareMargin));

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
</script>
<svg class="incident-type-chart" height={height}>
  {#each incidents as incident, i}
    <rect width={squareSize + "px"} height={squareSize + "px"} fill={getColor(incident.type)} x={getXPosition(i)} y={getYPosition(i)}/>
  {/each}
</svg>