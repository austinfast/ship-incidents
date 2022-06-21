<script>
	import { scaleLinear, max } from "d3";
	import { prettyNumber } from "../../lib/text.js";

	export let chartData;
	export let dataKey;
	export let color;
	export let valueKey = "count";
	export let barSize;

	let items = [];
	let width = 900;
	let barMargin = 5;
	let labelSize = 12;
	let margin = {
		top: 20,
		right: 30,
		bottom: 10,
		left: 0,
	};
	$: barHeight = barSize ? barSize : width >= 600 ? 35 : 30;
	$: chartWidth = width - margin.left - margin.right;
	$: height =
		items.length * (barHeight + barMargin * 2 + labelSize) + margin.top + margin.bottom;
	$: barScale = scaleLinear()
		.domain([0, max(items, (item) => item[valueKey])])
		.range([0, chartWidth < 600 ? chartWidth : 600]);

	$: sortedItems = items.sort((a, b) => b[valueKey] - a[valueKey]);

	chartData.then((d) => {
		items = d[dataKey].filter((d) => d[valueKey] !== null);
	});
</script>

<div class="ranked-bar-wrap chart-wrapper" bind:clientWidth={width}>
	<svg class="ranked-bar-chart" {width} {height}>
		<g class="chart-g" transform={`translate(${margin.left}, ${margin.top})`}>
			{#each sortedItems as item, i}
				<g
					class="item-g"
					transform={`translate(0, ${i * (barHeight + barMargin * 2 + labelSize)})`}>
					<text class="ranked-bar-label">{item.label}</text>
					<rect
						height={barHeight}
						width={barScale(item[valueKey])}
						fill={color}
						transform={"translate(0, " + barMargin + ")"} />
					<text
						transform="translate({barScale(item[valueKey]) + barMargin}, {labelSize / 2 +
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

	@media (min-width: 600px) {
		.ranked-bar-label {
			/* font-size: var(--mk-font-size-medium); */
			/* line-height: var(--mk-line-height-medium); */
		}
	}
</style>
