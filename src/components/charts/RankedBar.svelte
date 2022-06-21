<script>
	import { scaleLinear, max } from "d3";
	import { prettyNumber } from "../../lib/text.js";

	export let chartData;
	export let dataKey;
	export let color;
	export let valueKey = "count";
	export let barSize;
	export let numTicks = 10;

	let items = [];
	let width = 900;
	let barMargin = 5;
	let labelSize = 12;
	let margin = {
		top: 30,
		right: 30,
		bottom: 10,
		left: 5,
	};
	const tickSize = 12;
	$: barHeight = barSize ? barSize : width >= 600 ? 35 : 30;
	$: chartWidth = width - margin.left - margin.right;
	$: height =
		items.length * (barHeight + barMargin * 2 + labelSize) + margin.top + margin.bottom;
	$: scaleX = scaleLinear()
		.domain([0, max(items, (item) => item[valueKey])])
		.range([0, chartWidth])
		.nice();

	$: sortedItems = items.sort((a, b) => b[valueKey] - a[valueKey]);
	$: ticksX = scaleX.ticks(numTicks);

	chartData.then((d) => {
		items = d[dataKey].filter((d) => d[valueKey] !== null);
	});
</script>

<div class="ranked-bar-wrap chart-wrapper" bind:clientWidth={width}>
	<svg class="ranked-bar-chart" {width} {height}>
		<g
			class="x-axis-g"
			transform="translate({margin.left}, 0)">
				{#each ticksX as tick, i}
				<g class="tick tick-{i}" transform="translate({scaleX(tick)}, {margin.top - tickSize})">
					<text y={-2} x={0} >{tick}</text>
					<line y1={0} y2={height - margin.top } x1={0} x2={0}></line>
				</g>
				{/each}
		</g>
		<g class="chart-g" transform={`translate(${margin.left}, ${margin.top + tickSize})`}>
			{#each sortedItems as item, i}
				<g
					class="item-g"
					transform={`translate(0, ${i * (barHeight + barMargin * 2 + labelSize)})`}>
					<text class="ranked-bar-label">{item.label}</text>
					<rect
						height={barHeight}
						width={scaleX(item[valueKey])}
						fill={color}
						transform={"translate(0, " + barMargin + ")"} />
					<text
						transform="translate({scaleX(item[valueKey]) + barMargin}, {labelSize / 2 +
							barMargin +
							barHeight / 2})"
						class="ranked-bar-count">{prettyNumber(item[valueKey])}</text>
				</g>
			{/each}
		</g>
	</svg>
</div>

<style>
	.ranked-bar-chart {
		display: block;
	}
	.ranked-bar-label {
		fill: var(--mk-color-grey-dark, #404040);
		font-size: var(--mk-font-size-small);
		line-height: var(--mk-line-height-small);
		font-weight: 700;
	}
	.ranked-bar-count {
		font-weight: 700;
		fill: var(--mk-color-grey-dark, #404040);
		font-size: var(--mk-font-size-small);
	}
	.x-axis-g .tick text {
		font-size: var(--mk-font-size-small);
		fill: var(--mk-color-grey);
		text-anchor: middle;
	}
	.tick line {
		stroke-width: 1px;
		stroke: var(--mk-color-grey);
	}
	@media (min-width: 600px) {
		.ranked-bar-label {
			/* font-size: var(--mk-font-size-medium); */
			/* line-height: var(--mk-line-height-medium); */
		}
	}
</style>
