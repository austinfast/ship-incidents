<script>
  import { onMount } from "svelte";
  import { scaleLinear, max, sum } from "d3";
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

  function draw() {
    width = wrapEl.offsetWidth;
    scale = scaleLinear()
      .domain([0, sum(counts, d => d.count)])
      .range([0, width]);
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
  }

  onMount(() => {
    draw();
    smartResizeListener(draw);
  })

</script>
<div class="stacked-bar-wrap" bind:this={wrapEl}>
  <svg class="stacked-bar" bind:this={svgEl} width={width} height={height}>
    <g>
      {#each counts as count, i}
        <rect height={barSize} width={count.width} fill={colors[i]} x={count.x}></rect>

      {/each}
    </g>
  </svg>
</div>