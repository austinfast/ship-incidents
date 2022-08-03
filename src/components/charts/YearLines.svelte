<script>
	import * as d3 from "d3";
	import Loading from "../Loading.svelte";
	import Footer from "../ChartFooter.svelte";
	import TabButtons from "../TabButtons.svelte";
	import colors from "../../lib/colors.js";

	export let incidentData;

	let chartValue = "incidents";
	let incidentsByYear = [];
	let width = 300;
	let updated_at;
	const xTicksEvery = 1;
	const numYTicks = 10;
	const tickHeight = 12;
	const currentYear = new Date().getFullYear();
	const margin = {
		top: 20,
		right: 50,
		bottom: 20,
		left: 20,
	};
	const tickFormat = d3.timeFormat("%b");
	const variableOptions = [
		{
			label: "Incidents",
			value: "incidents",
		},
		{
			label: "Victims",
			value: "victims",
		},
	];

	$: height = width * 0.8;
	$: chartHeight = height - margin.top - margin.bottom;
	$: chartWidth = width - margin.left - margin.right;
	$: chartMax = d3.max(incidentsByYear, (year) =>
		d3.max(year.counts, (d) => d[chartValue])
	);
	$: annotationSize = width < 500 ? 12 : 14;
	$: scaleY = d3.scaleLinear().domain([0, chartMax]).range([chartHeight, 0]).nice();
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
	$: lastIncident =
		incidentsByYear.length > 0
			? incidentsByYear[incidentsByYear.length - 1].counts[
					incidentsByYear[incidentsByYear.length - 1].counts.length - 1
			  ]
			: null;
	$: highestYear =
		incidentsByYear.length > 0 ? getHighestYear(incidentsByYear, chartValue) : null;

	function isCurrentYear(yr) {
		return yr == currentYear;
	}

	function getHighestYear(incidentsByYear, field) {
		const totals = incidentsByYear
			.map((year) => {
				return Object.assign(year.counts[year.counts.length - 1], { year: year.year });
			})
			.sort((a, b) => b[field] - a[field]);
		return totals[0];
	}

	function getCumulativeIncidents(rawIncidents) {
		let results = [];
		const years = Array.from(new Set(rawIncidents.map((i) => i.year))).sort(
			(a, b) => parseInt(a) - parseInt(b)
		);
		for (let yearIdx = 0; yearIdx < years.length; yearIdx += 1) {
			const year = years[yearIdx];
			// initial value is 0 for everything on January 1
			const initialValue = {
				date: new Date(year, 0, 1),
				incidents: 0,
				victims: 0,
			};
			let victimCount = 0;
			results[yearIdx] = {
				year: year,
				counts: [initialValue],
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
			// add a final value for December 31 for all past years
			if (!isCurrentYear(year)) {
				const lastEntry = results[yearIdx].counts[results[yearIdx].counts.length - 1];
				// final value contains the last entry's values with a data of December 31
				const finalValue = {
					date: new Date(year, 11, 31),
					incidents: lastEntry.incidents,
					victims: lastEntry.victims,
				};
				results[yearIdx].counts.push(finalValue);
			}
		}
		return results;
	}

	incidentData.then((d) => {
		incidentsByYear = getCumulativeIncidents(d.incidents);
		updated_at = d.updated_at;
	});
</script>

<div class="chart-wrapper">
	<div bind:clientWidth={width}>
		{#await incidentData}
			<Loading height={500} />
		{:then _}
			<h3 class="chart-label">
				Number of mass killings and victims this year compared with previous years
			</h3>
			<div class="chart-controls">
				<TabButtons options={variableOptions} bind:currentValue={chartValue} />
			</div>
			{#if lines.length > 0 && scalesX.length > 0}
				<svg {width} {height}>
					<g transform="translate({margin.left}, {margin.top})">
						<g class="x-axis-g" transform="translate(0, {chartHeight})">
							{#each ticksX as tick, i}
								{#if i % xTicksEvery == 0}
									<g class="tick tick-{i}" transform="translate({scalesX[0](tick)})">
										<text y={tickHeight + 2} x={0}>{tickFormat(tick)}</text>
										<line x1={0} x2={0} y1="0" y2={-chartHeight} />
									</g>
								{/if}
							{/each}
						</g>
						<g class="y-axis-g" transform="translate({-margin.left}, 0)">
							{#each ticksY as tick, i}
								<g
									class="tick tick-{i}"
									transform="translate({margin.left - 5}, {scaleY(tick)})">
									<text y={0} x={0} dominant-baseline="central" text-anchor="end"
										>{tick}</text>
									<line y1={0} y2={0} x1={5} x2={chartWidth} />
								</g>
							{/each}
						</g>
						{#each incidentsByYear as year, yearIdx}
							<path
								d={lines[yearIdx](year.counts)}
								fill="none"
								stroke-width={isCurrentYear(year.year) ? 3 : 2}
								opacity={isCurrentYear(year.year) || highestYear.year == year.year
									? 1
									: 0.5}
								stroke={isCurrentYear(year.year) ? colors.orange : colors["grey"]} />
							<circle
								r={isCurrentYear(year.year) ? 3 : 3}
								fill="#ffffff"
								stroke-width="3"
								opacity={isCurrentYear(year.year) || highestYear.year == year.year
									? 1
									: 0.5}
								stroke={isCurrentYear(year.year) ? colors["orange"] : colors["grey"]}
								cx={scalesX[yearIdx](year.counts[year.counts.length - 1].date)}
								cy={scaleY(year.counts[year.counts.length - 1][chartValue])} />
						{/each}
						<!-- current year -->
						<g
							transform="translate({scalesX[scalesX.length - 1](lastIncident.date) +
								10}, {scaleY(lastIncident[chartValue])})">
							<text class="chart-annotation" font-size={annotationSize}
								>{incidentsByYear[incidentsByYear.length - 1].year}</text>
							<text
								class="chart-annotation"
								dy={annotationSize + 2}
								font-size={annotationSize}
								>{lastIncident[chartValue]} {" " + chartValue}</text>
						</g>
						<!-- highest year -->
						<g
							transform="translate({chartWidth + 10}, {scaleY(
								highestYear[chartValue]
							)})">
							<text class="chart-annotation highest" font-size={annotationSize}
								>{highestYear.year}</text>
							<text
								class="chart-annotation highest"
								dy={annotationSize + 2}
								font-size={annotationSize}>{highestYear[chartValue]}</text>
						</g>
					</g>
				</svg>
			{/if}
		{/await}
	</div>
	<Footer {updated_at} />
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
		text-anchor: end;
	}
	.tick line {
		stroke: var(--mk-color-grey-light);
	}
	.chart-annotation {
		font-weight: 900;
		text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.8),
			1px -1px 0px rgba(255, 255, 255, 0.8), -1px 1px 0px rgba(255, 255, 255, 0.8),
			-1px -1px 0px rgba(255, 255, 255, 0.8);
		fill: var(--mk-color-grey-dark);
	}
	.chart-annotation.highest {
		fill: var(--mk-color-grey);
		text-shadow: none;
	}
</style>
