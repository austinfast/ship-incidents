<script>
	import * as d3 from "d3";
	import { victimData, getVictimData } from "../../stores/data.js";

	export let color = "#e3e3e3";

	let wrapEl;
	let svgEl;
	let width = 300;
	let binnedData;
	let ageScale;

	$: if (!$victimData) {
		getVictimData();
	} else {
		$victimData.then((d) => {
			binnedData = d.victimAges;
			ageScale = d.victimAgeScale;
		});
	}

	$: height = width < 600 ? width / 1.5 : width / 2;
	$: margin = {
		top: 50,
		right: 20,
		bottom: 20,
		left: 20,
	};
	$: barmargin = width > 600 ? 10 : 5;
	$: chartHeight = height - margin.top - margin.bottom;
	$: chartWidth = width - margin.left - margin.right;
	$: if (ageScale && chartWidth) {
		ageScale.range([0, chartWidth]);
	}
	$: xAxis = d3.axisBottom(ageScale).ticks(20);
	$: yScale = d3
		.scaleLinear()
		.domain([0, binnedData ? d3.max(binnedData.map((d) => d.length)) : 1])
		.nice()
		.range([chartHeight, 0]);
	$: yAxis = d3.axisLeft(yScale).ticks(6).tickSize(-chartWidth);

	function draw() {


		svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${height - margin.bottom})`)
			.call(x_axis)
			.call((g) => {
				g.selectAll("line").attr("stroke", "#DEDEDE");
				g.selectAll(".domain").attr("stroke", "#DEDEDE");
			});

		svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`)
			.call(y_axis)
			.call((g) => {
				g.selectAll("line").attr("stroke", "#DEDEDE");
				g.selectAll(".domain").attr("stroke", "#DEDEDE");
				g.select(".domain").remove();
			});

	}
</script>

<div class="age-histogram-wrap" bind:this={wrapEl} bind:clientWidth={width}>
	{#if binnedData}
	<svg class="age-histogram-svg" bind:this={svgEl} {width} {height} >
		<!-- @TODO call axis on these axis <g> elements -->
		<g class="x-axis-group" transform="translate({margin.left}, {height - margin.bottom})">
		</g>
		<g class="y-axis-group" transform="translate({margin.left}, {margin.top})">
		</g>
		<g class="chart-group" transform="translate({margin.left}, {margin.top})">
			{#each binnedData as bin}
				<rect 
					x={ageScale(bin.x0)}
					y={yScale(bin.length)}
					width={Math.max(0, ageScale(bin.x1) - ageScale(bin.x0) - barmargin)}
					height={ yScale(0) - yScale(bin.length)}
					fill={color}
				></rect>
			{/each}
		</g>
	</svg>
	{/if}
</div>
