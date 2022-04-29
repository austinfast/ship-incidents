<script>
	import { onMount } from "svelte";
	import * as d3 from "d3";
	// import { smartResizeListener } from "../../utils/events.js";
	import { yearFromStringDate } from "../../utils/text.js";
	import { popupDetails } from "../../stores.js";

	// PROPS
	export let dataManager;

	let svgEl;
	let incidents = [];
	let wrapEl;
	let width = 900;
	let category = "All";
	let arc = d3.arc();

	$: years = incidents
		.map((d) => yearFromStringDate(d.date))
		.filter((value, index, self) => self.indexOf(value) === index)
		.sort((a, b) => parseInt(a) - parseInt(b));
	$: margin = {
		top: 20,
		right: width < 600 ? 50 : 100,
		bottom: 20,
		left: width < 600 ? 50 : 100,
	};
	$: chartWidth = width - margin.left - margin.right;
	$: maxRadius = width < 600 ? 20 : 50;
	$: minRadius = width < 600 ? 5 : 10;
	$: incident_filter = category == "All" ? null : category;
	$: svg = d3.select(svgEl);
	$: height = years.length * maxRadius + margin.top * 2;
	$: extent = d3.extent(incidents, (d) => d.victims);
	$: circleRadiusScale = d3.scaleSqrt().domain(extent).range([minRadius, maxRadius]);
	$: yScale = d3
		.scaleOrdinal()
		.domain(years)
		.range(years.map((year, i) => i * maxRadius + 10));
	$: xScale = d3.scaleLinear().domain([0, 366]).range([0, chartWidth]);
	// @TODO not sure how I feel about reading these from the DOM. I like just defining them in 1 place but
	// I worry it is going to get tedious over time pulling them in like this. Might be better to put them in a config
	// file and set them as CSS properties once.
	$: getColors = function () {
		if (!wrapEl) return null;
		const styles = getComputedStyle(wrapEl);
		return {
			orange: styles.getPropertyValue("--mk-color-orange"),
			orange_light: styles.getPropertyValue("--mk-color-orange-light"),
			orange_dark: styles.getPropertyValue("--mk-color-orange-dark"),
			blue: styles.getPropertyValue("--mk-color-blue"),
			blue_light: styles.getPropertyValue("--mk-color-blue-light"),
		};
	};
	$: colors = getColors();

	// fetch data
	dataManager.getData().then((d) => {
		incidents = d.incidents;
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

<div class="timeline-wrapper" bind:this={wrapEl} bind:clientWidth={width}>
	<svg class="timeline-svg" bind:this={svgEl} {width} {height}>
		<g class="chart-inner" transform="translate({margin.left}, {margin.top})">
			<g class="timeline-yearinfo-group">
				{#each years as year}
					<g
						class="timeline-year-group"
						transform="translate({-margin.left}, {yScale(year)})">
						<line
							x1={margin.left}
							x2={width - margin.right}
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
						stroke="#404040" />
				{/each}
			</g>
		</g>
	</svg>
</div>
