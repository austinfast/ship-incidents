<script>
	import * as d3 from "d3";
	import Loading from "../Loading.svelte";
	import TabButtons from "../TabButtons.svelte";
	import colors from "../../lib/colors.js";

	export let incidentData;

	let chartValue = "incidents";
	let incidentsByYear = [];
	let width = 300;
	const xTicksEvery = 1;
	const numYTicks = 10;
	const tickHeight = 12;
	const currentYear = new Date().getFullYear();
	const height = 500;
	const margin = {
		top: 50,
		right: 20,
		bottom: 20,
		left: 20,
	};
	const tickFormat = d3.timeFormat("%b");
	const variableOptions = [{
		label: "Incidents",
		value: "incidents"
	},
	{
		label: "Victims",
		value: "victims"
	}];

	$: chartHeight = height - margin.top - margin.bottom;
	$: chartWidth = width - margin.left - margin.right;
	$: chartMax = d3.max(incidentsByYear, (year) =>
		d3.max(year.counts, (d) => d[chartValue])
	);
	$: scaleY = d3.scaleLinear().domain([0, chartMax]).range([chartHeight, 0]);
	$: ticksY = scaleY.ticks(numYTicks);
	$: getScaleX = function (year) {
		return d3
			.scaleTime()
			.domain([new Date(year, 0, 1), new Date(year, 11, 31)])
			.range([0, chartWidth]);
	};
	$: scalesX = incidentsByYear.map((d) => getScaleX(d.year));
	$: ticksX = scalesX.length > 0 ? scalesX[0].ticks(d3.timeMonth.every(1)) : [];
	$: getLine = function (yearIdx) {
		return d3
			.line()
			.x((d) => (scalesX[yearIdx] ? scalesX[yearIdx](d.date) : 0))
			.y((d) => scaleY(d[chartValue]))
			.curve(d3.curveStepAfter);
	};
	$: lines = incidentsByYear.map((d, i) => getLine(i));

	function isCurrentYear(yr) {
		return yr == currentYear;
	}

	function getCumulativeIncidents(rawIncidents) {
		let results = [];
		const years = Array.from(new Set(rawIncidents.map((i) => i.year))).sort(
			(a, b) => parseInt(a) - parseInt(b)
		);
		for (let yearIdx = 0; yearIdx < years.length; yearIdx += 1) {
			const year = years[yearIdx];
			let victimCount = 0;
			results[yearIdx] = {
				year: year,
				counts: [],
			};
			const yearIncidents = rawIncidents
				.filter((d) => d.year == year)
				.sort((a, b) => a.real_date - b.real_date);
			for (let incIdx = 0; incIdx < yearIncidents.length; incIdx += 1) {
				const incident = yearIncidents[incIdx];
				victimCount = victimCount + incident.victims;
				results[yearIdx].counts.push({
					date: incident.real_date,
					incidents: incIdx + 1,
					victims: victimCount,
				});
			}
		}
		return results;
	}

	incidentData.then((d) => {
		incidentsByYear = getCumulativeIncidents(d.incidents);
	});
</script>

<div class="chart-wrap" bind:clientWidth={width}>
	{#await incidentData}
		<Loading height={500} />
	{:then _}
		<TabButtons options={variableOptions} bind:currentValue={chartValue}/>
		{#if lines.length > 0 && scalesX.length > 0}
			<svg {width} {height}>
				<g transform="translate({margin.left}, {margin.top})">
				<g class="x-axis-g" transform="translate(0, {chartHeight})"  >
					{#each ticksX as tick, i}
						{#if i % xTicksEvery == 0}
						<g class="tick tick-{i}" transform="translate({scalesX[0](tick)})">
							<text y={tickHeight + 2} x={0}>{tickFormat(tick)}</text>
							<line x1={0} x2={0} y1="0" y2={-chartHeight}></line>
						</g>
						{/if}
					{/each}
				</g>
				<g
					class="y-axis-g"
					transform="translate({-margin.left}, 0)">
						{#each ticksY as tick, i}
						<g class="tick tick-{i}" transform="translate({margin.left / 2}, {scaleY(tick)})">
							<text y={-2} x={0} >{tick}</text>
							<line y1={0} y2={0} x1={margin.left / 2} x2={chartWidth}></line>
						</g>
						{/each}
				</g>
				{#each incidentsByYear as year, yearIdx}
					<path
						d={lines[yearIdx](year.counts)}
						fill="none"
						stroke-width={isCurrentYear(year.year) ? 3 : 1}
						opacity={isCurrentYear(year.year) ? 1 : 0.75}
						stroke={isCurrentYear(year.year) ? colors.orange : colors["grey"]} />
				{/each}
				</g>
			</svg>
		{/if}
	{/await}
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
	.tick line {
		stroke: var(--mk-color-grey-light);
	}
</style>
