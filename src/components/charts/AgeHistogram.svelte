<script>
	import * as d3 from "d3";
	import { isEmbed } from "../../lib/utils.js";

	export let color = "#e3e3e3";
	export let sourceData;
	export let ageBinKey;
	export let chartLabel;

	let width = 300;
	let binnedData = [];
	let xAxisEl;
	let yAxisEl;
	const numYTicks = 5;
	const tickHeight = 12;

	sourceData.then((d) => {
		binnedData = d[ageBinKey];
	});

	$: height = width < 600 ? width / 1.5 : width / 2;
	$: margin = {
		top: 50,
		right: 20,
		bottom: 20,
		left: 50,
	};
	$: chartHeight = height - margin.top - margin.bottom;
	$: chartWidth = width - margin.left - margin.right;
	$: maxAge = binnedData.length > 0 ? d3.max(binnedData, (bin) => bin.x1) : 100;
	$: scaleX = d3
		.scaleBand()
		.paddingInner(0.1)
		.domain(d3.range(0, maxAge, 5))
		.range([0, chartWidth]);
	$: xTicksEvery = width < 500 ? 2 : 1;
	$: ticksY = scaleY.ticks(numYTicks);
	$: scaleY = d3
		.scaleLinear()
		.domain([0, binnedData ? d3.max(binnedData.map((d) => d.length)) : 1])
		.nice()
		.range([chartHeight, 0]);
</script>

<div class:in-depth-article-width={!isEmbed()}>
	<div class="age-histogram-wrap chart-wrapper" bind:clientWidth={width}>
		{#if chartLabel}
			<h3 class="chart-label">{chartLabel}</h3>
		{/if}
		{#if binnedData}
			<svg class="age-histogram-svg" {width} {height}>
				<g class="chart-group" transform="translate({margin.left}, {margin.top})">
					<g
						class="x-axis-g"
						transform="translate(0, {chartHeight})"
						bind:this={xAxisEl}>
						{#each scaleX.domain() as tick, i}
							{#if i % xTicksEvery == 0}
								<g class="tick tick-{i}" transform="translate({scaleX(tick)})">
									<text y={tickHeight + 2} x={scaleX.bandwidth() / 2}
										>{tick}-{tick + 4}</text>
									<line
										x1={scaleX.bandwidth() / 2}
										x2={scaleX.bandwidth() / 2}
										y1="0"
										y2={tickHeight / 2} />
								</g>
							{/if}
						{/each}
					</g>
					<g class="y-axis-g" transform="translate({-margin.left}, 0)">
						{#each ticksY as tick, i}
							<g
								class="tick tick-{i}"
								transform="translate({margin.left / 2}, {scaleY(tick)})">
								<text y={-2} x={0}>{tick}</text>
								<line y1={0} y2={0} x1={0} x2={width} />
							</g>
						{/each}
					</g>
					{#each binnedData as bin}
						<rect
							x={scaleX(bin.x0)}
							y={scaleY(bin.length)}
							width={scaleX.bandwidth()}
							height={scaleY(0) - scaleY(bin.length)}
							fill={color} />
					{/each}
				</g>
			</svg>
		{/if}
	</div>
</div>

<style>
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
