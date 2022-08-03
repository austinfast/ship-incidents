<script>
	import { scaleLinear, axisBottom, sum, select } from "d3";
	import Footer from "../ChartFooter.svelte";

	export let colors = [];
	export let sourceData;
	export let countKey;
	export let chartLabel;

	let width;
	let dataCounts = [];
	let barSize = 50;
	let barMargin = 0;
	let countSum;
	let scaleEl;
	let margin = {
		top: 10,
		right: 5,
		bottom: 10,
		left: 5,
	};
	let updated_at;
	$: chartWidth = width - margin.left - margin.right;
	$: height = barSize + margin.top + margin.bottom + barMargin;
	$: countSum = sum(dataCounts, (count) => count.count);
	$: scale = scaleLinear().domain([0, countSum]).range([0, chartWidth]);
	$: axis = axisBottom(scale);

	$: if (scaleEl) {
		select(scaleEl)
			.call(axis)
			.call((g) => {
				g.selectAll("line").attr("stroke", "#DEDEDE");
				g.selectAll(".domain").attr("stroke", "#DEDEDE");
			});
	}

	sourceData.then((d) => {
		dataCounts = d[countKey];
		updated_at = d.updated_at;
	});

	$: getXPosition = function (i) {
		let pos = 0;
		while (i > 0) {
			i -= 1;
			pos += scale(dataCounts[i].count);
		}
		return pos;
	};
</script>

<div class="stacked-bar-wrap chart-wrapper" >
	<div bind:clientWidth={width}>
		{#if chartLabel}
			<h3 class="chart-label">{chartLabel}</h3>
		{/if}
		<div class="key-wrap article-text-width">
			{#each dataCounts as keyItem, i}
				<div class="key-item">
					<div class="key-item-pallette" style={`background: ${colors[i]};`} />
					<p class="key-item-label">{keyItem.label}</p>
				</div>
			{/each}
		</div>
		<svg class="stacked-bar" {width} {height}>
			<g
				class="scale-g"
				bind:this={scaleEl}
				transform={`translate(${margin.left}, ${barSize + barMargin})`} />
			<g>
				{#each dataCounts as count, i}
					<rect
						height={barSize}
						width={scale(count.count)}
						fill={colors[i]}
						x={margin.left + getXPosition(i)} />
				{/each}
			</g>
		</svg>
	</div>
	<Footer {updated_at} />
</div>

<style>
	.key-item-pallette {
		width: 10px;
		height: 10px;
	}

	.key-wrap {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}

	.key-item {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		margin-bottom: 8px;
		margin-right: 8px;
	}

	.key-item-label {
		font-size: var(--mk-font-size-small);
		line-height: var(--mk-line-height-small);
		font-family: var(--mk-font-family-sans, sans-serif);
		margin-left: 5px;
		margin-bottom: 0;
	}
</style>
