<script>
	import * as d3 from "d3";
	import colors from "../../lib/colors.js";

	export let categories;
	export let incidentData;
	let summaryStatistics;
	let width = 800;

	// data
	incidentData.then((d) => {
		summaryStatistics = d.overallSummary;
	});
	$: margin = {
		top: 0,
		right: 0,
		bottom: 0,
		left: width > 500 ? 200 : 135,
	};

	$: boxSize = width - margin.left - margin.right;

	$: colorScale = d3
		.scaleOrdinal()
		.domain(categories.map((c) => c.field))
		.range([colors["orange-light"], colors["orange"], colors["orange-dark"]]);

	$: sizeScale = d3
		.scaleSqrt()
		.domain([0, summaryStatistics ? summaryStatistics[categories[0].field] : 1])
		.range([0, boxSize]);
</script>

<div class="chart-wrapper category-chart" >
	<div bind:clientWidth={width} >
		{#if summaryStatistics}
			<svg {width} height={boxSize}>
				<g class="chart-group" transform="translate({margin.left}, {margin.top})">
					{#each categories as category}
						<rect
							y={boxSize - sizeScale(summaryStatistics[category.field])}
							width={sizeScale(summaryStatistics[category.field])}
							height={sizeScale(summaryStatistics[category.field])}
							fill={colorScale(category.field)} />
					{/each}
				</g>
				<g class="label-group">
					{#each categories as category}
						<text
							x={margin.left}
							text-anchor="end"
							class="chart-label"
							y={boxSize - sizeScale(summaryStatistics[category.field])}
							>{category.label}</text>
					{/each}
				</g>
			</svg>
		{/if}
	</div>
</div>

<style>
	.chart-label {
		text-align: right;
		font-size: 12px;
		transform: translate(-5px, 12px);
		font-family: var(--mk-font-family-sans);
	}
	.category-chart {
		width: 100%
	}
	@media (min-width: 1024px) {
		.category-chart {
			width: 50%;
		}
	}
</style>
