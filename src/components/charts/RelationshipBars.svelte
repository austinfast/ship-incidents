<script>
  import { onMount } from "svelte";
  import { scaleLinear, max } from "d3";

  // Props
  export let counts;
  
  let wrapEl;
  let svgEl;
  let width = 300;
  let barWidth = 80;
  let maxHeight = 350;
  let barMargin = 30;
  let heightScale = scaleLinear()
    .range([0, maxHeight]);

  let numBars = 3;

  let bar_1 = [["family", "#d9501e", "Family"], ["acquaintance", "#f08c67", "Acquaintance"]];
  let bar_2 = [["stranger", "#416986", "Stranger"], ["first_responder", "#90a4b3", "First responder"]];
  let bar_3 = [["unknown", "#8c8c8c", "Unknown"]];

  //update sizing based on width
  // $: barWidth = width < 600 ? 60 : 80;
  // $: barMargin = width < 600 ? 25 : 30;

  $: if(counts) {
    let allCounts = [];
    for (let key in counts) {
      allCounts.push(counts[key])
    }
    let bar_1_count = counts[bar_1[0][0]] + counts[bar_1[1][0]];
    allCounts.push(bar_1_count);
    heightScale = heightScale
      .domain([0, max(allCounts)])
  }

  onMount(() => {
    width = wrapEl.offsetWidth;
  });
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

  text.bar-count-label {
    font-size: var(--font-size-medium);
    font-weight: 700;
  }
</style>
<div class="relationship-bar-wrapper" bind:this={wrapEl}>
  <div class="key-wrap">
    {#each bar_1 as keyItem}
      <div class="key-item">
        <div class="key-item-pallette" style={`background: ${keyItem[1]};`}></div>
        <p class="key-item-label">{keyItem[2]}</p>
      </div>
    {/each}
    {#each bar_2 as keyItem}
      <div class="key-item">
        <div class="key-item-pallette" style={`background: ${keyItem[1]};`}></div>
        <p class="key-item-label">{keyItem[2]}</p>
      </div>
    {/each}
    {#each bar_3 as keyItem}
      <div class="key-item">
        <div class="key-item-pallette" style={`background: ${keyItem[1]};`}></div>
        <p class="key-item-label">{keyItem[2]}</p>
      </div>
    {/each}
  </div>
  <svg class="relationship-bar" bind:this={svgEl} width={width} height={maxHeight}>
    <g transform={`translate(${0}, 0)`}>
      {#each bar_1 as barCategory, i}
        <rect width={barWidth} height={heightScale(counts[barCategory[0]])} fill={barCategory[1]} y={i > 0 ? maxHeight - (heightScale(counts[barCategory[0]]) + heightScale(counts[bar_1[0][0]])) : maxHeight - heightScale(counts[barCategory[0]])}></rect>
        <text class="bar-count-label"
          y={i > 0 ? maxHeight - (heightScale(counts[barCategory[0]]) + heightScale(counts[bar_1[0][0]])) + 20 : maxHeight - heightScale(counts[barCategory[0]]) + 20}
          x={22}
          fill="#FFFFFF"
        >{counts[barCategory[0]]}</text>
      {/each}
    </g>
    <g transform={`translate(${(barWidth + barMargin)}, 0)`}>
      {#each bar_2 as barCategory, i}
        <rect width={barWidth} height={heightScale(counts[barCategory[0]])} fill={barCategory[1]} y={i > 0 ? maxHeight - (heightScale(counts[barCategory[0]]) + heightScale(counts[bar_2[0][0]])) : maxHeight - heightScale(counts[barCategory[0]])}></rect>
         <text class="bar-count-label"
          y={i > 0 ? maxHeight - (heightScale(counts[barCategory[0]]) + heightScale(counts[bar_2[0][0]])) - 8 : maxHeight - heightScale(counts[barCategory[0]]) + 20}
          fill={i > 0 ? "#404040" : "#FFFFFF"}
          x={20}
        >{counts[barCategory[0]]}</text>
      {/each}
    </g>
    <g transform={`translate(${((barWidth + barMargin) * 2)}, 0)`}>
      {#each bar_3 as barCategory, i}
        <rect width={barWidth} height={heightScale(counts[barCategory[0]])} y={maxHeight - heightScale(counts[barCategory[0]])} fill={barCategory[1]}></rect>
         <text class="bar-count-label"
          y={i > 0 ? maxHeight - (heightScale(counts[barCategory[0]]) + heightScale(counts[bar_1[0][0]])) + 20 : maxHeight - heightScale(counts[barCategory[0]]) + 20}
          x={20}
          fill="#FFFFFF"
        >{counts[barCategory[0]]}</text>
      {/each}
    </g>
  </svg>
</div>
