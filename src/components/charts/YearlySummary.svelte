<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

  // PROPS
  export let yearlyData;
  export let yearlyVariable;
  
  let svgEl;
  let wrapEl;
  let width;
  
  // gets rounded scale maximum
  function getScaleMax(max, round = 50) {
    return max - (max % round) + round;
  }

  // returns two digit string of year
  function shortYear(fullYear) {
    return fullYear.toString().slice(-2);
  }

  function draw() {
    let height = width < 600 ? 300 : 400;
    let barHeight = (width / yearlyData.length) * (2/3);
    let barMargin = barHeight / 3;
    let margin = {
      top: 20,
      rigth: 20,
      bottom: 20,
      left: 30
    };
    let chartWidth = width - margin.left - margin.right;
    let chartHeight = height - margin.top - margin.bottom;
    let maxHeight = chartHeight;
    let allValues = yearlyData.map(year => year[yearlyVariable])
  
    const extent = d3.extent(allValues);
    const barScale = d3.scaleLinear()
      .domain([0, getScaleMax(d3.max(allValues), 50)])
      .range([chartHeight, margin.top])
    
    const yAxis = d3.axisLeft(barScale)
      .ticks(5)
    
    const svg = d3.select(svgEl)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#F7F7F7");
    
    const chartG = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    chartG.selectAll("rect")
      .data(yearlyData)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * (barHeight + barMargin))
      .attr("y", d => barScale(d[yearlyVariable]))
      .attr("width", barHeight)
      .attr("height", d => barScale(0) - barScale(d[yearlyVariable]))
      .attr("fill", (d, i) => {
        if (i == yearlyData.length - 1) {
          return "#d9501e";
        }
        return "#CCCCCC";
      })
    
    const labelG = svg.append("g")
      .attr("class", "label-group");
    
    labelG.append("g")
      .attr("class", "yearly-summary-year-label-group")
      .attr("transform", `translate(${margin.left}, 0)`)
      .selectAll(".year-label")
      .data(yearlyData)
      .enter()
      .append("text")
      .attr("class", "year-label")
      .text(d => shortYear(d.year))
      .attr("y", height - margin.bottom + 17)
      .attr("x", (d, i) => i * (barHeight + barMargin))
    
    labelG.append("g")
      .attr("class", "y-axis-group")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis)
  }

  $: if (svgEl && yearlyData && yearlyVariable) {
    draw();
  }

  onMount(() => {
    width = wrapEl.offsetWidth;
  })
</script>

<style>
  :global(.label-group text) {
    font-family: "Unify Sans", sans-serif;
    font-weight: 700;
  }

  :global(.label-group .domain) {
    fill: none;
    stroke: none;
  }

  :global(.yearly-summary-year-label-group .year-label) {
    font-size: 12px;
  }
</style>

<div class="summary-wrap" bind:this={wrapEl}>
  <svg bind:this={svgEl}></svg>
</div>