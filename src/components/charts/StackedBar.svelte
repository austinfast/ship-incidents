<script>
  import { onMount } from "svelte";
  import { scaleLinear, axisBottom, max, sum, select } from "d3";
  import { smartResizeListener } from "../../utils/events.js";

  export let counts = [];
  export let colors = [];

  let width;
  let height = 200;
  let wrapEl;
  let svgEl;
  let allValues = [];
  let scale;
  let barSize = 50;
  let barMargin = 0;
  let countSum;
  let axis;
  let scaleEl;
  let margin = {
    top: 10,
    right: 5,
    bottom: 10,
    left: 5
  };

  function draw() {
    width = wrapEl.offsetWidth;
    let chartWidth = width - margin.left - margin.right;
    height = barSize + margin.top + margin.bottom + barMargin;
    scale = scaleLinear()
      .domain([0, sum(counts, d => d.count)])
      .range([0, chartWidth]);
    
    countSum = sum(counts, count => count.count);
    
    axis = axisBottom(scale);

    console.log(axis.tickSizeOuter())
    
    let scaleGroup = select(scaleEl);
    
    scaleGroup
      .call(axis)
      .call(g => {
        g.selectAll("line")
          .attr("stroke", "#DEDEDE")
        g.selectAll(".domain")
          .attr("stroke", "#DEDEDE");
      });
  }

  function getXPosition(i) {
    let pos = 0;
    while(i > 0) {
      i -= 1;
      pos += scale(counts[i].count)
    }
    return pos;
  }

  $: if(scale) {
    counts = counts.map((count, i) => {
      count.x = getXPosition(i);
      count.width = scale(count.count);
      return count;
    });
  } else {
    counts = counts.map((count, i) => {
      count.x = 0;
      count.width = 0;
      return count;
    });
  }

  onMount(() => {
    draw();
    smartResizeListener(draw);
  })

</script>
<style>
  .key-item-pallette {
    width: 10px;
    height: 10px;
  }

  .key-wrap {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .key-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 8px;
    margin-right: 8px;
  }

  .key-item-label {
    font-size: var(--font-size-small);
    line-height: var(--line-height-small);
    margin-left: 5px;
    margin-bottom: 0;
  }
</style>
<div class="stacked-bar-wrap" bind:this={wrapEl}>
  <div class="key-wrap article-text-width">
  {#each counts as keyItem, i}
      <div class="key-item">
        <div class="key-item-pallette" style={`background: ${colors[i]};`}></div>
        <p class="key-item-label">{keyItem.label}</p>
      </div>
  {/each}
  </div>
  <svg class="stacked-bar" bind:this={svgEl} width={width} height={height}>
    <g class="scale-g" bind:this={scaleEl} transform={`translate(${margin.left}, ${(barSize + barMargin)})`}></g>
    <g>
      {#each counts as count, i}
        <rect height={barSize} width={count.width} fill={colors[i]} x={(margin.left + count.x)}></rect>

      {/each}
    </g>
  </svg>
</div>