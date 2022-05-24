<script>
	import { scaleLinear, max } from "d3";
	import { incidentData } from "../../stores/data.js";

	let svgEl;
	let items = [];
	let wrapEl;
	let width = 900;
	let barMargin = 10;
	let labelSize = 12;
	let margin = {
		top: 20,
		right: 30,
		bottom: 10,
		left: 0,
	};
	$: barHeight = width >= 600 ? 30 : 20;
	$: chartWidth = width - margin.left - margin.right;
	$: height =
		items.length * (barHeight + barMargin * 2 + labelSize) + margin.top + margin.bottom;
	$: barScale = scaleLinear()
		.domain([0, max(items, (item) => item.count)])
		.range([0, chartWidth < 600 ? chartWidth : 600]);

	incidentData.then((d) => {
		items = d.locationTypes;
	});
</script>

<style>
	.ranked-bar-chart {
		display: block;
	}

	.ranked-bar-label {
		fill: #404040;
		font-size: var(--font-size-small);
		line-height: var(--line-height-small);
	}

	.ranked-bar-count {
		font-weight: 700;
		fill: #404040;
	}

	@media (min-width: 600px) {
		.ranked-bar-label {
			font-size: var(--font-size-medium);
			line-height: var(--line-height-medium);
		}
	}
</style>

<div class="ranked-bar-wrap chart-wrapper" bind:this={wrapEl} bind:clientWidth={width}>
	<svg class="ranked-bar-chart" {width} {height}>
		<g class="chart-g" transform={`translate(${margin.left}, ${margin.top})`}>
			{#each items as item, i}
				<g
					class="item-g"
					transform={`translate(0, ${i * (barHeight + barMargin * 2 + labelSize)})`}>
					<text class="ranked-bar-label">{item.label}</text>
					<rect
						height={barHeight}
						width={barScale(item.count)}
						fill={i == 0 ? "#D9501E" : "#CCCCCC"}
						transform={"translate(0, " + barMargin + ")"} />
					<text
						transform="translate({barScale(item.count) + barMargin}, {labelSize / 2 +
							barMargin +
							barHeight / 2})"
						class="ranked-bar-count">{item.count}</text>
				</g>
			{/each}
		</g>
	</svg>
</div>
