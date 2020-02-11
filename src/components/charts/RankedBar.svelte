<script>
  import { onMount } from "svelte";
  import { scaleLinear, max } from "d3";

  export let items = [];

  let svgEl;
  let wrapEl;
  let width;
  let height = 300;
  let barHeight = 30;
  let barMargin = 10;
  let labelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--font-size-medium"));
  let margin = {
    top: 20,
    right: 30,
    bottom: 10,
    left: 0
  };
  

  function getScale(width) {
    let chartWidth = width - margin.left - margin.right;
    return scaleLinear()
      .domain([0, max(items, item => item.count)])
      .range([0, chartWidth < 600 ? chartWidth : 600]);
  }

  onMount(() => {
    width = wrapEl.offsetWidth;
    barHeight = width >= 600 ? 30 : 20;
    height = items.length * (barHeight + barMargin * 2 + labelSize) + margin.top + margin.bottom;
  })

</script>

<style>
  .ranked-bar-chart {
    display: block;
  }
</style>

<div class="ranked-bar-wrap" bind:this={wrapEl}>
  <svg class="ranked-bar-chart" bind:this={svgEl} width={width} height={height}>
    <g class="chart-g" transform={`translate(${margin.left}, ${margin.top})`}>
      {#each items as item, i}
        <g 
          class="item-g"
          transform={`translate(0, ${i * (barHeight + barMargin * 2 + labelSize)})`}
          >
          <text
            style="fill: #404040; font-size: var(--font-size-medium)">{item.label}</text>
          <rect 
            height={barHeight}
            width={getScale(width)(item.count)}
            fill={i == 0 ? "#D9501E" : "#CCCCCC"}
            transform={"translate(0, " + barMargin + ")"}
          />
          <text
            transform={`translate(${getScale(width)(item.count) + barMargin}, ${(labelSize/2 + barMargin + barHeight / 2)})`}
            style="font-weight: 700; fill: #404040;"
            >{item.count}</text>
        </g>
      {/each}
    </g>
  </svg>
</div>