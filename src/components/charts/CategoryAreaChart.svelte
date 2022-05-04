<script>
	import * as d3 from "d3";
	import colors from "../../colors.json";

	export let dataManager;
	let summaryStatistics;
	let width = 900;
	const categories = ["mass_killings", "mass_shootings", "mass_public_shootings"];

	dataManager.getData().then((d) => {
		summaryStatistics = d.overall_summaries;
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
		.domain(["mass_killings", "mass_shootings", "mass_public_shootings"])
		.range([colors["orange-light"], colors["orange"], colors["orange-dark"]]);

	$: sizeScale = d3
		.scaleSqrt()
		.domain([0, summaryStatistics ? summaryStatistics.incidents : 1])
		.range([0, boxSize]);
</script>

<style>
	.chart-label {
		text-align: right;
		font-size: 12px;
		transform: translate(-5px, 12px);
		font-family: var(--mk-font-family-sans);
	}
</style>

<div class="chart-wrapper" bind:clientWidth={width}>
	<h2>Category area chart</h2>
	{#if summaryStatistics}
		<svg {width} height={width}>
			<g class="chart-group" transform="translate({margin.left}, {margin.top})">
				<rect
					y={boxSize - sizeScale(summaryStatistics["incidents"])}
					width={sizeScale(summaryStatistics["incidents"])}
					height={sizeScale(summaryStatistics["incidents"])}
					fill={colorScale("mass_killings")} />
				<rect
					y={boxSize - sizeScale(summaryStatistics["mass_shootings"])}
					width={sizeScale(summaryStatistics["mass_shootings"])}
					height={sizeScale(summaryStatistics["mass_shootings"])}
					fill={colorScale("mass_shootings")} />
				<rect
					y={boxSize - sizeScale(summaryStatistics["mass_public_shootings"])}
					width={sizeScale(summaryStatistics["mass_public_shootings"])}
					height={sizeScale(summaryStatistics["mass_public_shootings"])}
					fill={colorScale("mass_public_shootings")} />
			</g>
			<g class="label-group">
				<text x={margin.left} text-anchor="end" class="chart-label"
					>All mass killings</text>
				<text
					x={margin.left}
					text-anchor="end"
					class="chart-label"
					y={boxSize - sizeScale(summaryStatistics["mass_shootings"])}
					>Mass shootings</text>
				<text
					x={margin.left}
					text-anchor="end"
					class="chart-label"
					y={boxSize - sizeScale(summaryStatistics["mass_public_shootings"])}
					>Mass public shootings</text>
			</g>
		</svg>
	{/if}
</div>
