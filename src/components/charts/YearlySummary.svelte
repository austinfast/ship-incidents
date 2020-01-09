<script>
  import * as d3 from "d3";
  export let yearlyData;
  export let yearlyVariable;
  let svgEl;

  const width = 800;
  const height = 300;
  const barHeight = 20;
  const barMargin = 5;
  const margin = {
    top: 20,
    rigth: 20,
    bottom: 20,
    left: 50
  };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const maxHeight = chartHeight;
  
  function getScaleMax(max, round = 50) {
    return max - (max % round) + round;
  }

  function draw() {
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
      .style('background', '#F7F7F7');
    
    const chartG = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    chartG.selectAll('rect')
      .data(yearlyData)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (barHeight + barMargin))
      .attr('y', d => barScale(d[yearlyVariable]))
      .attr('width', barHeight)
      .attr('height', d => barScale(0) - barScale(d[yearlyVariable]))
      .attr('fill', '#A61103')
    
    const labelG = svg.append('g');
    
    labelG.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .selectAll('.year-label')
      .data(yearlyData)
      .enter()
      .append('text')
      .attr('class', 'year-label')
      .text(d => d.year)
      .attr('y', height - margin.bottom + 10)
      .style('font-size', '8px')
      .attr('x', (d, i) => i * (barHeight + barMargin))
    
    labelG.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .call(yAxis)
    }

    $: if (svgEl && yearlyData && yearlyVariable) {
      draw();
    }
</script>

<svg bind:this={svgEl}></svg>