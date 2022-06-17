<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";
	import colors from "../../lib/colors.js";

	// PROPS
	export let yearlyData = [];
	export let yearlyVariables = [];
	export let incidentData;

	// data
	incidentData.then((d) => {
		yearlyData = d.yearlySummaries;
		console.log(yearlyData);
	});

	let xAxisEl;
	let yAxisEl;
	let width;
	let height = 350;
	let defaultDate = new Date();
	let svgEl;
	const curve = d3.curveStep;

	// const curve = d3.curveBumpX;

	$: margin = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 30,
	};
	$: chartWidth = width - margin.left - margin.right;
	$: chartHeight = height - margin.top - margin.bottom;
	$: colorScale = d3
		.scaleOrdinal()
		.domain(yearlyVariables.map((c) => c.field))
		.range([colors["orange-dark"], colors["orange"], colors["orange-light"]]);
	$: scaleX = d3
		.scaleBand()
		.domain(yearlyData.map((d) => d.year))
		.range([0, chartWidth]);

	$: scaleY = d3
		.scaleLinear()
		.domain([
			0,
			d3.max(yearlyData, (d) => {
				let totalVal = 0;
				for (const yearlyVar of yearlyVariables) {
					totalVal += d[yearlyVar.field];
				}
				return totalVal;
			}),
		])
		.range([height - margin.bottom, margin.top]);
	$: console.log(scaleY.domain());
	$: posY = function (yearData, varIdx) {
		let y = 0;
		for (let i = varIdx; i >= 0; i--) {
			y += scaleY(0) - scaleY(yearData[yearlyVariables[i].field]);
		}
		return chartHeight - y;
	};

	$: xTicksEvery = width < 500 ? 2 : 1;
	$: axisY = d3.axisLeft(scaleY);
	$: axisX = d3.axisBottom(scaleX);
	$: if (xAxisEl) {
		d3.select(xAxisEl)
			.call(axisX)
			.call((g) => {
				g.selectAll("line").attr("stroke", "#DEDEDE");
				g.selectAll(".domain").attr("stroke", "#DEDEDE");
			});
	}
	$: if (yAxisEl) {
		d3.select(yAxisEl)
			.call(axisY)
			.call((g) => {
				g.selectAll("line").attr("stroke", "#DEDEDE");
				g.selectAll(".domain").attr("stroke", "#DEDEDE");
				g.select(".domain").remove();
			});
	}
	function isCurrentYear(year) {
		let currentDate = new Date();
		return parseInt(year) == currentDate.getFullYear();
	}

	function hexToRGB(hex, alpha) {
		var r = parseInt(hex.slice(1, 3), 16),
			g = parseInt(hex.slice(3, 5), 16),
			b = parseInt(hex.slice(5, 7), 16);

		if (alpha) {
			return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
		} else {
			return "rgb(" + r + ", " + g + ", " + b + ")";
		}
	}
</script>

<div class="trend-line-wrap chart-wrapper" bind:clientWidth={width}>
	<div class="key-wrapper">
		{#each yearlyVariables as yearlyVariable}
			<div class="key-item">
				<div
					class="key-item-swatch"
					style={"background-color: " + colorScale(yearlyVariable.field)} />
				<p class="key-item-label">{yearlyVariable.label}</p>
			</div>
		{/each}
	</div>
	<svg {width} {height} bind:this={svgEl}>
		<g class="chart-g" transform="translate({margin.left}, {margin.top})">
			<g class="x-axis-g" transform="translate(0, {chartHeight})" bind:this={xAxisEl} />
			<g
				class="y-axis-g"
				bind:this={yAxisEl}
				transform="translate(0, {-margin.bottom})" />
			<g class="data-g">
				{#each yearlyData as year}
					<g class="year-g" transform="translate({scaleX(year.year)})">
						{#each yearlyVariables as yearlyVariable, i}
							<rect
								class:current-year={isCurrentYear(year.year)}
								height={scaleY(0) - scaleY(year[yearlyVariable.field])}
								y={posY(year, i)}
								width={scaleX.bandwidth()}
								fill={colorScale(yearlyVariable.field)}
								stroke={colorScale(yearlyVariable.field)}
								stroke-width="0" />
						{/each}
					</g>
				{/each}
			</g>
		</g>
	</svg>
</div>

<style>
	:global(.tick text) {
		color: var(--mk-color-grey-dark);
		font-family: var(--mk-font-family-sans, sans-serif);
		font-weight: 700;
	}

	.key-wrapper {
		display: flex;
	}

	.key-item {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		margin-right: 10px;
	}

	.key-item-swatch {
		width: 10px;
		height: 10px;
	}

	p.key-item-label {
		font-size: var(--mk-font-size-small);
		line-height: var(--mk-line-height-small);
		font-family: var(--mk-font-family-sans, sans-serif);
		font-weight: 700;
		margin-bottom: 0;
		margin-left: 5px;
	}
	rect:hover {
		stroke-width: 2;
		stroke-alignment: inner;
	}
	rect.current-year {
		fill-opacity: 0.75;
	}
</style>
