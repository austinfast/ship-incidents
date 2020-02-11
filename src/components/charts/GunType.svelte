<script>
  import { onMount } from "svelte";
  import { range } from "d3";
  
  export let gunTypes = [];

  let wrapEl;
  let width;
  let victims;
  let height;
  let numRows;

  // chart sizing properties
  let chartsPerRow = 3;
  let squareSize = 10;
  let squareMargin = 1;
  let numCols = 10;
  let chartMargin = 20;

  function getHeight() {
    return getWaffleHeight(gunTypes[0].count) + chartMargin * 5 + getWaffleHeight(gunTypes[chartsPerRow].count);
  }

  function getWaffleHeight(count) {
    return getNumRows(count) * (squareSize + squareMargin);
  }

  function getNumRows(count) {
    return Math.ceil(count / numCols);
  }

  // $: squareSize = width < 600 ? 8 : 15;


  onMount(() => {
    width = wrapEl.offsetWidth;
    squareSize = width < 600 ? 8 : 15;
    height = getHeight();
  })
</script>

<div
  class="gun-type-chart-wrap"
  bind:this={wrapEl}>
  <svg width={width} height={height}>
    {#each gunTypes as gunType, i}
      <g class="gun-type-g"
        transform={`translate(${((i % chartsPerRow) * (numCols * (squareSize + squareMargin) + chartMargin))}, ${(Math.floor(i / chartsPerRow) * (getWaffleHeight(gunTypes[0].count) + chartMargin * 2 ))})`}>
        {#each range(gunType.count) as item}
          <rect
            width={squareSize}
            height={squareSize}
            x={(item % numCols) * (squareSize + squareMargin)}
            y={i < chartsPerRow ? getWaffleHeight(gunTypes[0].count) - Math.floor(item / numCols) * (squareSize + squareMargin) : getWaffleHeight(gunTypes[chartsPerRow].count) - Math.floor(item / numCols) * (squareSize + squareMargin)}
            fill={"#D7D7D7"}></rect>
        {/each}
        <text
          fill={"#D7D7D7"}
          y={i < chartsPerRow ? getWaffleHeight(gunTypes[0].count) + squareSize + chartMargin : getWaffleHeight(gunTypes[chartsPerRow].count + squareSize  + chartMargin)}
          >{gunType.label}</text>
      </g>
    {/each}
  
  </svg>
</div>