<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { smartResizeListener } from "../../utils/events.js";

  export let age_scale;
  export let binned_data;
  export let color = "#e3e3e3";

  let wrapEl;
  let svgEl;
  let width;
  let height = 400;

  function draw() {
    width = wrapEl.offsetWidth;
    height = width < 600 ? width / 1.5 : width / 2;
    const margin = {
      top: 50,
      right: 20,
      bottom: 20,
      left: 20
    }
    
    const barmargin = width > 600 ? 10 : 5;
    
    const chartHeight = height - margin.top - margin.bottom;
    const chartWidth = width - margin.left - margin.right;
    
    age_scale.range([0, chartWidth])
    
    const x_axis = d3.axisBottom(age_scale)
      .ticks(20)
    
    const y_scale = d3.scaleLinear()
      .domain([0, d3.max(binned_data.map(d => d.length))]).nice()
      .range([chartHeight, 0])
    
    const y_axis = d3.axisLeft(y_scale)
      .ticks(6)
      .tickSize(-chartWidth)
    
    const svg = d3.select(svgEl);
    
    // start with a clean slate
    svg.selectAll("g")
      .remove();
    
    svg.append('g')
      .attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
      .call(x_axis)
      .call(g => {
        g.selectAll("line")
          .attr("stroke", "#DEDEDE")
        g.selectAll(".domain")
          .attr("stroke", "#DEDEDE");
      });
    
      
    svg.append('g')
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(y_axis)
      .call(g => {
        g.selectAll("line")
          .attr("stroke", "#DEDEDE");
        g.selectAll(".domain")
          .attr("stroke", "#DEDEDE");
        g.select(".domain").remove();
        });
    
      
    
    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr("fill", color)
      .selectAll("rect")
      .data(binned_data)
      .join("rect")
      .attr("x", d => age_scale(d.x0))
      .attr("width", d => Math.max(0, age_scale(d.x1) - age_scale(d.x0) - barmargin))
      .attr("y", d => y_scale(d.length))
      .attr("height", d => y_scale(0) - y_scale(d.length));
  }

  onMount(() => {
    draw();
    smartResizeListener(draw);
  });

</script>
<div class="age-histogram-wrap" bind:this={wrapEl}>
  <svg class="age-histogram-svg" bind:this={svgEl} width={width} height={height}></svg>
</div>