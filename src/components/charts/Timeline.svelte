<script>
	import * as d3 from "d3";
	import Popup from "../Popup.svelte";
	import { popupDetails } from "../../stores/popup.js";
	import colors from "../../colors.json";
	import months from "../../utils/months.js";

	//@TODO add filtering

	// PROPS
	export let dataManager;
	export let popupSlot;

	let svgEl;
	let incidents = [];
	let incidentLookup;
	let wrapEl;
	let width = 900;
	let category = "All";
	const arc = d3.arc();
	const monthTickHeight = 10;

	$: years = incidents
		.map((d) => d.year)
		.filter((value, index, self) => self.indexOf(value) === index)
		.sort((a, b) => parseInt(a) - parseInt(b));
	$: margin = {
		top: 20,
		right: width < 600 ? 50 : 100,
		bottom: 20,
		left: width < 600 ? 50 : 100,
	};
	$: chartWidth = width - margin.left - margin.right;
	$: maxRadius = width < 600 ? 30 : 50;
	$: minRadius = width < 600 ? 5 : 10;
	$: incident_filter = category == "All" ? null : category;
	$: svg = d3.select(svgEl);
	$: height = years.length * maxRadius + margin.top * 2;
	$: extent = d3.extent(incidents, (d) => d.victims);
	$: circleRadiusScale = d3.scaleSqrt().domain(extent).range([minRadius, maxRadius]);
	$: monthsEvery = chartWidth > 600 ? 1 : 2;
	$: yScale = d3
		.scaleOrdinal()
		.domain(years)
		.range(years.map((year, i) => i * maxRadius + 10));
	$: xScale = d3.scaleLinear().domain([0, 366]).range([0, chartWidth]);

	// fetch data
	dataManager.getData().then((d) => {
		incidents = d.incidents;
		incidentLookup = d.incidentLookup;
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

	// @todo i think i can replace a lot of the draw function with reactive statements and functions
	function draw() {
		dataItems.on("mouseenter", (d) => {
			let e = d3.event;
			onDetails(d, [e.pageX, e.pageY]);
		});

		dataItems.on("mouseleave", (d) => {
			onDetails(null);
		});
	}

	function onDetails(incident, position) {
		if (incident) {
			popupDetails.set({
				incidentId: incident.id,
				position: position,
				slot: popupSlot,
			});
		} else {
			popupDetails.set({
				incidentId: null,
				position: null,
			});
		}
	}
</script>

<style>
	.timeline-year-label {
		font-family: "Unify Sans", sans-serif;
		font-size: 12px;
	}
	:global(.timeline-chart-month-axis .domain) {
		display: none;
		opacity: 0;
	}

	:global(.timeline-chart-year-label) {
		color: #404040;
		font-size: 12px;
		font-weight: 700;
	}

	@media (min-width: 600px) {
		:global(.timeline-chart-year-label) {
			font-size: 16px;
		}
	}
</style>

<div class="chart-wrapper" bind:this={wrapEl} bind:clientWidth={width}>
	<svg class="timeline-svg" bind:this={svgEl} {width} {height}>
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
							y2={0}
							stroke="black" />
						<text class="timeline-year-label">{year}</text>
					</g>
				{/each}
			</g>
			<g class="timeline-incident-group">
				{#each incidents as incident}
					<path
						transform="translate({xScale(getDaysIntoYear(incident.real_date))}, {yScale(
							incident.year
						)})"
						d={arc({
							innerRadius: 0,
							outerRadius: circleRadiusScale(incident.victims),
							startAngle: -Math.PI * 0.5,
							endAngle: Math.PI * 0.5,
						})}
						fill={colors.orange}
						opacity="0.75"
						stroke="#404040"
						on:mouseenter={(e) => onDetails(incident, [e.clientX, e.clientY])}
						on:mousemove={(e) => onDetails(incident, [e.clientX, e.clientY])}
						on:mouseleave={(e) => onDetails()} />
				{/each}
			</g>
			<g
				class="timeline-month-labels"
				transform="translate(0, {yScale(years[years.length - 1])})">
				{#each months as month, idx}
					{#if idx % monthsEvery == 0}
						<g
							class="timeline-month-label-group"
							transform="translate({(chartWidth / 12) * idx}, {monthTickHeight})">
							<line x1="0" x2="0" y1="0" y2={-monthTickHeight} stroke="black" />
							<text font-size={monthTickHeight} y={monthTickHeight} x="-8"
								>{month.shortName}</text>
						</g>
					{/if}
				{/each}
			</g>
		</g>
	</svg>
</div>
<!-- @todo need to figure out how to manage data/state in the popup component. right now things are too split up between parent components, stores, and data manager. -->
<!-- really need to streamline this before it will work well. -->
{#if ($popupDetails.incidentId || $popupDetails.customContent) && $popupDetails.position && $popupDetails.slot == popupSlot}
	<Popup details={$popupDetails} {incidentLookup} />
{/if}
