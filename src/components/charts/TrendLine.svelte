<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";

    // PROPS
  export let yearlyData;
  export let yearlyVariables;
  
  let svgEl;
  let wrapEl;
  let width;
  let height = 300;


  function draw() {
    let margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 30
    };
    let chartWidth = width - margin.left - margin.right;
    let chartHeight = height - margin.top - margin.bottom;

    let dotRadius = width < 600 ? 3 : 5;

    let scaleX = d3.scaleTime()
      .domain([yearlyData[0].year_date, yearlyData[yearlyData.length - 1].year_date])
      .range([0, chartWidth])

    let scaleY = d3.scaleLinear()
      .domain([0, d3.max(yearlyData.reduce((values, yearData) => {
        yearlyVariables.forEach(yearlyVariable => {
          values.push(yearData[yearlyVariable])
        });
        return values;
      }, []))])
      .range([chartHeight, 0])

    let axisY = d3.axisLeft(scaleY)
      .tickSize(-chartWidth);
    let axisX = d3.axisBottom(scaleX)
      .tickSize(-chartHeight);


    let svg = d3.select(svgEl);

    let chartG = svg.append("g")
      .attr("class", "chart-g")
      .attr("transform", `translate(${margin.left}, ${margin.right})`);

    let xAxisG = chartG.append("g")
      .attr("class", "x-axis-g")
      .attr("transform", `translate(0, ${chartHeight})`)

    let yAxisG = chartG.append("g")
      .attr("class", "y-axis-g");

    xAxisG.call(axisX)
      .call(g => {
        g.selectAll("line")
          .attr("stroke", "#DEDEDE")
        g.selectAll(".domain")
          .attr("stroke", "#DEDEDE");
      });
    yAxisG.call(axisY)
      .call(g => {
        g.selectAll("line")
          .attr("stroke", "#DEDEDE");
        g.selectAll(".domain")
          .attr("stroke", "#DEDEDE");
        });


    yearlyVariables.forEach(yearlyVariable => {
      let lineG = chartG.append("g");
      let dotG = chartG.append("g");
      let line = d3.line()
      .x(d => scaleX(d.year_date))
      .y(d => scaleY(d[yearlyVariable]))

      lineG.append("path")
        .datum(yearlyData.slice(0, -1))
        .attr("fill", "none")
        .attr("stroke", "coral")
        .attr("stroke-width", 2)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);

      dotG.selectAll(".year-dot")
        .data(yearlyData.slice(0, -1))
        .enter()
        .append("circle")
        .attr("class", "year-dot")
        .attr("cy", d => scaleY(d[yearlyVariable]))
        .attr("cx", d => scaleX(d.year_date))
        .attr("r", dotRadius)
        .attr("fill", "coral");

    })
  }

  $: if (svgEl && yearlyData && yearlyVariables) {
    draw();
  }

  onMount(() => {
    width = wrapEl.offsetWidth;
  })
</script>
<style>
  :global(.tick text) {
    color: "#404040";
    font-family: var(--font-family-sans, sans-serif);
    font-weight: 700;
  }
</style>
<div class="trend-line-wrap" bind:this={wrapEl}>
  <svg bind:this={svgEl} width={width} height={height}></svg>
</div>