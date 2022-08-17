<script>
	import { fade } from "svelte/transition";
	import * as d3 from "d3";
	import Tooltip from "../Tooltip.svelte";
	import Loading from "../Loading.svelte";
	import FilterSelect from "../FilterSelect.svelte";
	import Footer from "../ChartFooter.svelte";
	import { filterUnique } from "../../lib/utils.js";
	import colors from "../../lib/colors.js";
	import months from "../../lib/months.js";

	// PROPS
	export let incidentData;
	export let nobuttons = false;

	let incidents = [];
	let width = 900;
	const arc = d3.arc();
	const monthTickHeight = 10;
	let typeFilter = null;
	let tooltip = null;
	let updated_at;

	$: years = incidents
		.map((d) => d.year)
		.filter((value, index, self) => self.indexOf(value) === index)
		.sort((a, b) => parseInt(a) - parseInt(b));
	$: margin = {
		top: 20,
		right: 25,
		bottom: 20,
		left: width < 600 ? 50 : 75,
	};
	$: chartWidth = width - margin.left - margin.right;
	$: maxRadius = width < 600 ? 30 : 50;
	$: minRadius = width < 600 ? 5 : 10;
	$: height = years.length * maxRadius + margin.top * 2;
	$: extent = d3.extent(incidents, (d) => d.victims);
	$: circleRadiusScale = d3.scaleSqrt().domain(extent).range([minRadius, maxRadius]);
	$: monthsEvery = chartWidth > 600 ? 1 : 2;
	$: yScale = d3
		.scaleOrdinal()
		.domain(years)
		.range(years.map((_, i) => i * maxRadius + 10));
	$: xScale = d3.scaleLinear().domain([0, 366]).range([0, chartWidth]);
	$: typeFilterOptions = incidents
		.map((d) => d.type)
		.filter(filterUnique)
		.map((d) => {
			return {
				label: d,
				value: d,
			};
		});
	// filter incidents down based on all filters
	$: filteredIncidents = typeFilter
		? incidents.filter(
				(d) => d.type.toLowerCase().indexOf(typeFilter.toLowerCase()) >= 0
		  )
		: incidents;

	// data
	incidentData.then((d) => {
		incidents = d.incidents;
		updated_at = d.updated_at;
	});

	// function that takes a Date object and returns the number of days into the given year
	// January 1, 2022 would return 0
	function getDaysIntoYear(d) {
		const year = d.getFullYear();
		const start = new Date(year, 0, 0);
		// day in milliseconds
		const msDay = 1000 * 60 * 60 * 24;
		const diff =
			d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60 * 1000;
		return Math.floor(diff / msDay);
	}

	function onDetails(incident, position) {
		if (incident) {
			tooltip = {
				incident,
				position
			}
		} else {
			tooltip = null;
		}
	}
</script>

<div class="chart-wrapper">
	<div bind:clientWidth={width}>
		{#await incidentData}
			<Loading height={500} />
		{:then _}
			<h3 class="chart-label">Timeline of mass killings scaled by number of victims killed</h3>
			<div class="chart-inner" transition:fade>
				{#if !nobuttons}
				<div class="timeline-controls">
					<FilterSelect
						bind:currentValue={typeFilter}
						options={typeFilterOptions}
						showTypeInfo={true}
						defaultLabel="All"
						filterLabel="Filter by type" />
				</div>
				{/if}
				<svg class="timeline-svg" {width} {height} role="img">
					<title>A timeline chart showing mass killing incidents scaled by number of victims killed</title>
					<g class="chart-inner" transform="translate({margin.left}, {margin.top})">
						<g class="timeline-yearinfo-group">
							{#each years as year}
								<g
									class="timeline-year-group"
									transform="translate({-margin.left}, {yScale(year)})">
									<line
										x1={margin.left - 20}
										x2={width - margin.right + 20}
										y1={0}
										y2={0} />
									<text class="timeline-year-label">{year}</text>
								</g>
							{/each}
						</g>
						<g class="timeline-incident-group">
							{#each filteredIncidents as incident}
								<path
									class="incident-bubble"
									transform="translate({xScale(
										getDaysIntoYear(incident.real_date)
									)}, {yScale(incident.year)})"
									d={arc({
										innerRadius: 0,
										outerRadius: circleRadiusScale(incident.victims),
										startAngle: -Math.PI * 0.5,
										endAngle: Math.PI * 0.5,
									})}
									fill={colors.orange}
									opacity={tooltip && !(tooltip.incident.id == incident.id) ? 0.25 : 0.75}
									stroke="#404040"
									on:mousemove={(e) => onDetails(incident, [e.pageX, e.pageY])}
									on:mouseleave={(e) => onDetails()} />
							{/each}
						</g>
						{#if years.length > 0}
							<g
								class="timeline-month-labels"
								transform="translate(0, {yScale(years[years.length - 1])})">
								{#each months as month, idx}
									{#if idx % monthsEvery == 0}
										<g
											class="timeline-month-label-group"
											transform="translate({(chartWidth / 12) *
												idx}, {monthTickHeight})">
											<line x1="0" x2="0" y1="0" y2={-monthTickHeight} />
											<text font-size={monthTickHeight} y={monthTickHeight} x="-8"
												>{month.shortName}</text>
										</g>
									{/if}
								{/each}
							</g>
						{/if}
					</g>
				</svg>
			</div>
		{/await}
	</div>
	<Footer {updated_at} />
</div>
{#if tooltip}
	<Tooltip incident={tooltip.incident} position={tooltip.position} onClose={() => tooltip = null}/>
{/if}

<style>
	.timeline-year-label {
		font-family: var(--mk-font-family-sans, sans-serif);
		font-weight: 700;
		font-size: var(--mk-font-size-small, 12px);
	}
	.timeline-controls {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1em;
	}
	.timeline-year-group line {
		stroke: var(--mk-color-grey);
	}
	.timeline-month-label-group line {
		stroke: var(--mk-color-grey);
	}
	.incident-bubble {
		cursor: crosshair;
	}
	:global(.timeline-chart-month-axis .domain) {
		display: none;
		opacity: 0;
	}

	:global(.timeline-chart-year-label) {
		color: var(--mk-color-grey-dark);
		font-size: var(--mk-font-size-small, 12px);
		font-weight: 700;
	}
	:global(.timeline-month-labels text) {
		color: var(--mk-color-grey-dark);
		font-size: 10px;
		font-weight: 700;
	}

	@media (min-width: 600px) {
		:global(.timeline-chart-year-label) {
			font-size: var(--mk-font-size-medium, 16px);
		}
	}
</style>
