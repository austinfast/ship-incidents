<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";
	import colors from "../../lib/colors.js";

	// PROPS
	export let yearlyData = [];
	export let yearlyVariables = [];
	export let incidentData;
	export let chartLabel;

	// data
	incidentData.then((d) => {
		yearlyData = d.yearlySummaries;
	});

	let width;
	let height = 350;
	const tickHeight = 12;
	const numYTicks = 5;
	const margin = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 50,
	};

	$: chartWidth = width - margin.left - margin.right;

	$: chartHeight = height - margin.top - margin.bottom;

	$: colorScale = d3
		.scaleOrdinal()
		.domain(yearlyVariables.map((c) => c.field))
		.range([colors["orange-dark"], colors["orange"], colors["orange-light"]]);

	$: stackFunc = d3.stack()
		.keys(yearlyVariables.map((d) => d.field))
		.order(d3.stackOrderNone)
		.offset(d3.stackOffsetNone);

	$: stackedData = stackFunc(yearlyData);

	$: scaleX = d3
		.scaleBand()
		.paddingInner(0.1)
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
		.range([chartHeight, 0]);

	$: xTicksEvery = width < 500 ? 2 : 1;

	$: ticksY = scaleY.ticks(numYTicks);

	function isCurrentYear(year) {
		let currentDate = new Date();
		return parseInt(year) == currentDate.getFullYear();
	}
</script>

<div class="trend-line-wrap chart-wrapper" bind:clientWidth={width}>
	<h3 class="chart-label">{chartLabel}</h3>
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
	<svg {width} {height} >
		<g class="chart-g" transform="translate({margin.left}, {margin.top})">
			<g class="x-axis-g" transform="translate(0, {chartHeight})"  >
				{#each scaleX.domain() as tick, i}
					{#if i % xTicksEvery == 0}
					<g class="tick tick-{i}" transform="translate({scaleX(tick)})">
						<text y={tickHeight + 2} x={scaleX.bandwidth() / 2}>{tick}</text>
						<line x1={scaleX.bandwidth() / 2} x2={scaleX.bandwidth() / 2} y1="0" y2={tickHeight / 2}></line>
					</g>
					{/if}
				{/each}
			</g>
			<g
				class="y-axis-g"
				transform="translate({-margin.left}, 0)">
					{#each ticksY as tick, i}
					<g class="tick tick-{i}" transform="translate({margin.left / 2}, {scaleY(tick)})">
						<text y={-2} x={0} >{tick}</text>
						<line y1={0} y2={0} x1={0} x2={width}></line>
					</g>
					{/each}
			</g>
			<g class="data-g">
				{#each stackedData as row, rowIdx}
					{#each row as bar}
						<rect
							class:current-year={isCurrentYear(bar.data.year)}
							y={Math.min(scaleY(bar[0]), scaleY(bar[1]))}
							height={Math.abs(scaleY(bar[0]) - scaleY(bar[1]))}
							fill={colorScale(yearlyVariables[rowIdx].field)}
							width={scaleX.bandwidth()}
							x={scaleX(bar.data.year)}

						></rect>
					{/each}
				{/each}
			</g>
		</g>
	</svg>
</div>

<style>
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
	rect.current-year {
		fill-opacity: 0.75;
	}
	.tick text {
		font-size: 10px;
		font-weight: 700px;
		fill: var(--mk-color-grey-dark);
		font-family: var(--mk-font-family-sans, sans-serif);
		font-weight: 700;
		text-anchor: middle;
	}
	.y-axis-g .tick text {
		text-anchor: start;
	}
	.y-axis-g .tick line {
		stroke: var(--mk-color-grey);
	}
	.tick line {
		stroke: var(--mk-color-grey);
	}
</style>
