<script>
import { onMount } from "svelte";
import * as d3 from "d3";

export let incidents;
let el;
let category = "All";

const width = 900;
const height = 900;
const margin = 100;

function drawChart() {
  const svg = d3.select(el)
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .style("width", "100%")
    .style("height", "auto")
    .style("background", "#F7F7F7");
  
  const maxRadius = 50;
  const minRadius = 10;
  
  let arc = d3.arc();
  
  let incident_filter = category == "All" ? null : category;
  
  const extent = d3.extent(incidents, d => +d.victims);
  
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
    .ticks(d3.timeMonth.every(1));

  const yearGroups = svg
    .append('g')
    .attr('class', 'data-wrap')
    .attr('transform', `translate(${margin}, ${margin})`)
    .selectAll('.year-group')
    .data(years)
    .enter()
    .append('g')
    .attr('class', 'year-group')
    .attr('transform', (d, i) => {
      return `translate(0, ${i * maxRadius + 10})`
    })
  
  yearGroups
    .selectAll('.data-circle')
    .data(d => {return incident_filter ? incidents_by_year.get(d).filter(incident => incident.type == incident_filter) : incidents_by_year.get(d)})
    .enter()
    .append('path')
    .attr('class', 'data-circle')
    .attr('transform', (d, i) => `translate(${yearScales.get(d.year)(new Date(d.date))}, 0)`)
    .attr('d', d => {
      return arc({
      		innerRadius: 0,
      		outerRadius: circleRadiusScale(d.victims),
      		startAngle: -Math.PI*0.5,
      		endAngle: Math.PI*0.5
    	});
    })
    .attr('fill', d => colorScale(d.type))
    .attr('fill', '#A61103')
    .attr('stroke', 'white')
    .attr('opacity', 0.75);
  
  yearGroups.append('rect')
    .attr('height', 1)
    .attr('width', (width - (margin * 2) + maxRadius))
    .attr('fill', 'black')
    .attr('x', -(maxRadius/2))
  
  yearGroups.append('text')
    .text(d => d)
    .attr('x', -maxRadius/2 - margin/2)
    .attr('font-family', 'Unify Sans')
    
 
  svg.append("g")
    .attr("transform", `translate(${margin},${years.length * (maxRadius) + margin - 40})`)
    .call(monthAxis)
}


onMount(() => {
  console.log(el);
  drawChart();
});

</script>


<div id="chart-timeline" bind:this={el}></div>