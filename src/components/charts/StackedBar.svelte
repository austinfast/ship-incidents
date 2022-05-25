<script>
	import { scaleLinear, axisBottom, sum, select } from "d3";

	export let colors = [];
	export let sourceData;
	export let countKey;

	let width;
	let dataCounts = [];
	let allValues = [];
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

<div class="stacked-bar-wrap chart-wrapper" bind:clientWidth={width}>
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
		font-size: var(--font-size-small);
		line-height: var(--line-height-small);
		margin-left: 5px;
		margin-bottom: 0;
	}
</style>
