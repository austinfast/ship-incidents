<script>
	import { victimData } from "../../stores/data.js";
	import { scaleLinear, max, sum } from "d3";

	let svgEl;
	let counts = [];
	let width = 300;
	let barWidth = 80;
	let maxHeight = 350;
	let barMargin = 30;

	const bar_1 = [
		["family", "#d9501e", "Family"],
		["acquaintance", "#f08c67", "Acquaintance"],
	];
	const bar_2 = [
		["stranger", "#416986", "Stranger"],
		["first_responder", "#90a4b3", "First responder"],
	];
	const bar_3 = [["unknown", "#8c8c8c", "Unknown"]];
	const bars = [bar_1, bar_2, bar_3];

	$: maxCount = max(bars.map((bar) => sum(bar.map((barItem) => counts[barItem[0]]))));
	$: heightScale = scaleLinear().domain([0, maxCount]).range([0, maxHeight]);

	//update sizing based on width
	// $: barWidth = width < 600 ? 60 : 80;
	// $: barMargin = width < 600 ? 25 : 30;

	$: if (counts) {
		let allCounts = [];
		for (let key in counts) {
			allCounts.push(counts[key]);
		}
		let bar_1_count = counts[bar_1[0][0]] + counts[bar_1[1][0]];
		allCounts.push(bar_1_count);
		heightScale = heightScale.domain([0, max(allCounts)]);
	}
	// data
	victimData.then((d) => {
		counts = d.victimRelationships;
	});
</script>

<div
	class="relationship-bar-wrapper chart-wrapper in-depth-article-width"
	bind:clientWidth={width}>
	{#if counts && heightScale}
		<div class="key-wrap">
			{#each bar_1 as keyItem}
				<div class="key-item">
					<div class="key-item-pallette" style={`background: ${keyItem[1]};`} />
					<p class="key-item-label">{keyItem[2]}</p>
				</div>
			{/each}
			{#each bar_2 as keyItem}
				<div class="key-item">
					<div class="key-item-pallette" style={`background: ${keyItem[1]};`} />
					<p class="key-item-label">{keyItem[2]}</p>
				</div>
			{/each}
			{#each bar_3 as keyItem}
				<div class="key-item">
					<div class="key-item-pallette" style={`background: ${keyItem[1]};`} />
					<p class="key-item-label">{keyItem[2]}</p>
				</div>
			{/each}
		</div>
		<svg class="relationship-bar" bind:this={svgEl} {width} height={maxHeight}>
			{#each bars as bar, barIndex}
				<g transform={`translate(${(barWidth + barMargin) * barIndex}, 0)`}>
					{#each bar as barCategory, i}
						<rect
							width={barWidth}
							height={heightScale(counts[barCategory[0]])}
							fill={barCategory[1]}
							y={i > 0
								? maxHeight -
								  (heightScale(counts[barCategory[0]]) + heightScale(counts[bar[0][0]]))
								: maxHeight - heightScale(counts[barCategory[0]])} />
						<text
							class="bar-count-label"
							y={i > 0
								? barIndex == 1
									? maxHeight -
									  (heightScale(counts[barCategory[0]]) +
											heightScale(counts[bar[0][0]])) -
									  8
									: maxHeight -
									  (heightScale(counts[barCategory[0]]) +
											heightScale(counts[bar[0][0]])) +
									  20
								: maxHeight - heightScale(counts[barCategory[0]]) + 20}
							x={22}
							fill={barIndex == 1 && i == 1 ? "#404040" : "#ffffff"}>{counts[barCategory[0]]}</text>
					{/each}
				</g>
			{/each}
		</svg>
	{/if}
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

	text.bar-count-label {
		font-size: var(--font-size-medium);
		font-weight: 700;
	}
</style>
