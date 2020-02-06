<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

    // PROPS
  export let yearlyData;
  export let yearlyVariable;
  
  let svgEl;
  let wrapEl;
  let width;
  let height = 600;


  function draw() {
    let scaleX = d3.scaleTime()
      .domain([yearlyData[0].yearDate, yearlyData[yearlyData.length - 1].yearDate])
      .range([0, width])

    let scaleY = d3.scaleLinear()
      .domain([0, d3.max(yearlyData, d => d[yearlyVariable])])
      .range([height, 0])

    let line = d3.line()
    .defined(d => !isNaN(d[yearlyVariable]))
    .x(d => scaleX(d.yearDate))
    .y(d => scaleY(d[yearlyVariable]))

    let svg = d3.select(svgEl);

    let lineG = svg.append("g");

    lineG.append("path")
      .datum(yearlyData.slice(0, -1))
      .attr("fill", "none")
      .attr("stroke", "coral")
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line)

  }

  $: if (svgEl && yearlyData && yearlyVariable) {
    console.log(yearlyData);
    draw();
  }

  onMount(() => {
    width = wrapEl.offsetWidth;
  })
</script>
<div class="trend-line-wrap" bind:this={wrapEl}>
  <svg bind:this={svgEl} width={width} height={height}></svg>
</div>