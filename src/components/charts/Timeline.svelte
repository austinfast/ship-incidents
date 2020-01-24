<script>
import { onMount } from "svelte";
import * as d3 from "d3";

// PROPS
export let incidents;

let svgEl;
let wrapEl;
let category = "All";
let years = Object.keys(incidents);
let width = 900;

function drawChart() {
  let height = width;
  let topMargin = 20;
  
  const maxRadius = width < 600 ? 20 : 50;
  const minRadius = width < 600 ? 5 : 10;
  let margin = width < 600 ? 50 : 100;
  
  let arc = d3.arc();
  
  let incident_filter = category == "All" ? null : category;

  let flatIncidents = [];
  for (var key in incidents) {
    flatIncidents = flatIncidents.concat(incidents[key]);
  }

  height = years.length * maxRadius + topMargin * 2;

  const svg = d3.select(svgEl)
    .attr("height", height)
    .attr("width", width)
    .style("background", "#F7F7F7");

  const extent = d3.extent(flatIncidents, d => +d.victims);
  
  const circleRadiusScale = d3.scaleSqrt()
    .domain(extent)
    .range([minRadius, maxRadius]);
  
  
  const colorScale = d3.scaleOrdinal()
    .domain(["Public", "Family", "Unsolved", "Other", "Felony"])
    .range(['#A61103', '#D9501E', '#416986', '#8C8C8C', '#590902']);
  
  let yearScales = new Map();
  years.forEach(year => {
    yearScales.set(year, d3.scaleTime()
      .domain([new Date(parseInt(year), 0, 1), new Date(parseInt(year), 11, 31)])
      .range([0, width - (margin * 2)])
    )
  })
  
  const monthAxis = d3.axisBottom(yearScales.get(years[0]))
    .tickFormat(d3.timeFormat("%b"))
    .ticks(d3.timeMonth.every(width < 600 ? 2 : 1));

  const yearGroups = svg
    .append("g")
    .attr("class", "data-wrap")
    .attr("transform", `translate(${margin}, ${topMargin})`)
    .selectAll(".year-group")
    .data(years)
    .enter()
    .append("g")
    .attr("class", "year-group")
    .attr("transform", (d, i) => {
      return `translate(0, ${i * maxRadius + 10})`
    })
  
  yearGroups
    .selectAll(".data-circle")
    .data(d => {return incident_filter ? incident[d].filter(incident => incident.type == incident_filter) : incidents[d]})
    .enter()
    .append("path")
    .attr("class", "data-circle")
    .attr("transform", (d, i) => `translate(${yearScales.get(d.year)(d.real_date)}, 0)`)
    .attr("d", d => {
      return arc({
      		innerRadius: 0,
      		outerRadius: circleRadiusScale(d.victims),
      		startAngle: -Math.PI*0.5,
      		endAngle: Math.PI*0.5
    	});
    })
    .attr("fill", d => colorScale(d.type))
    .attr("fill", "#A61103")
    .attr("stroke", "white")
    .attr("opacity", 0.75);
  
  yearGroups.append("rect")
    .attr("height", 1)
    .attr("width", (width - (margin * 2) + maxRadius))
    .attr("fill", "#8C8C8C")
    .attr("x", -(maxRadius/2))
  
  yearGroups.append('text')
    .text(d => d)
    // .attr('x', -maxRadius/2 - margin/2)
    .attr("x", -margin)
    .attr("font-family", "Unify Sans")
    .attr("class", "timeline-chart-year-label");
    
 
  svg.append("g")
    .attr("class", "timeline-chart-month-axis")
    .attr("transform", `translate(${margin},${(years.length - 1) * (maxRadius) + 10 + topMargin})`)
    .call(monthAxis)
}

$: if (incidents && svgEl) {
  drawChart();
}

onMount(() => {
  width = wrapEl.offsetWidth;
})
</script>
<style>

  :global(.timeline-chart-month-axis .domain) {
    display: none;
    opacity: 0;
  }

  :global(.timeline-chart-year-label) {
    color: #404040;
    font-size: 12px;
    font-weight: 700;
  }

  @media(min-width: 600px) {
    :global(.timeline-chart-year-label) {
      font-size: 16px;
    }
  }
</style>

<div class="timeline-wrapper" bind:this={wrapEl}>
  <svg class="timeline-svg" bind:this={svgEl}></svg>
</div>