<script>
	import { scaleLinear, max, sum } from "d3";
	import { isEmbed } from "../../lib/utils.js";
	import Footer from "../ChartFooter.svelte";

	export let victimData;

	let counts;
	let width = 300;
	let barWidth = 80;
	let maxHeight = 350;
	let barMargin = 30;
	let updated_at;

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
	$: maxCount = max(bars.map((bar) => sum(bar.map((barItem) => counts ? counts[barItem[0]] : 0))));
	$: heightScale = scaleLinear().domain([0, maxCount]).range([0, maxHeight]);
	// data
	victimData.then((d) => {
		counts = d.victimRelationships;
		updated_at = d.updated_at;
	});
</script>
<div 
	class="chart-wrapper"
	class:in-depth-article-width={!isEmbed()}>
	<div
		bind:clientWidth={width}>
		<h3 class="chart-label">Number of victims by relationship to their murderers</h3>
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
		{#if counts && heightScale}
			<svg class="relationship-bar" {width} height={maxHeight}>
				<!-- <g transform="translate({(width / 2) - (barWidth * 1.5 + barMargin)},0)"> -->
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
									fill={barIndex == 1 && i == 1 ? "#404040" : "#ffffff"}
									>{counts[barCategory[0]]}</text>
							{/each}
						</g>
					{/each}
				<!-- </g> -->
			</svg>
		{/if}
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

	text.bar-count-label {
		font-size: var(--mk-font-size-medium);
		font-weight: 700;
	}
</style>
