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
	$: console.log(years);
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
	$: console.log(yScale.range());

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
		svg.selectAll("g").remove();

		// const colorScale = d3
		// 	.scaleOrdinal()
		// 	.domain(["Public", "Family", "Unsolved", "Other", "Felony"])
		// 	.range(["#A61103", "#D9501E", "#416986", "#8C8C8C", "#590902"]);

		let yearScales = new Map();
		years.forEach((year) => {
			yearScales.set(
				year,
				d3
					.scaleTime()
					.domain([new Date(parseInt(year), 0, 1), new Date(parseInt(year), 11, 31)])
					.range([0, width - margin.left - margin.right])
			);
		});

		const monthAxis = d3
			.axisBottom(yearScales.get(years[0]))
			.tickFormat(d3.timeFormat("%b"))
			.ticks(d3.timeMonth.every(width < 600 ? 2 : 1));

		const yearGroups = svg
			.append("g")
			.attr("class", "data-wrap")
			.attr("transform", `translate(${margin.left}, ${margin.top})`)
			.selectAll(".year-group")
			.data(years)
			.enter()
			.append("g")
			.attr("class", "year-group")
			.attr("transform", (d, i) => {
				return `translate(0, ${i * maxRadius + 10})`;
			});

		let dataItems = yearGroups
			.selectAll(".data-circle")
			.data((d) => {
				return incident_filter
					? incident[d].filter((incident) => incident.type == incident_filter)
					: incidents[d];
			})
			.enter()
			.append("path")
			.attr("class", "data-circle")
			.attr(
				"transform",
				(d, i) => `translate(${yearScales.get(d.year)(d.real_date)}, 0)`
			)
			.attr("d", (d) => {
				return arc({
					innerRadius: 0,
					outerRadius: circleRadiusScale(d.victims),
					startAngle: -Math.PI * 0.5,
					endAngle: Math.PI * 0.5,
				});
			})
			// .attr("fill", d => colorScale(d.type))
			.attr("fill", "#d9501e")
			.attr("stroke", "white")
			.attr("opacity", 0.75);

		yearGroups
			.append("rect")
			.attr("height", 1)
			.attr("width", width - margin.left - margin.right + maxRadius)
			.attr("fill", "#8C8C8C")
			.attr("x", -(maxRadius / 2));

		yearGroups
			.append("text")
			.text((d) => d)
			.attr("x", -margin.left)
			.attr("font-family", "Unify Sans")
			.attr("class", "timeline-chart-year-label");

		svg
			.append("g")
			.attr("class", "timeline-chart-month-axis")
			.attr(
				"transform",
				`translate(${margin.left},${(years.length - 1) * maxRadius + 10 + margin.top})`
			)
			.call(monthAxis);

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
			{#each incidents as incident}
				<path
					transform="translate({xScale(
						getDaysIntoYear(incident.real_date)
					)}, {yScale(incident.year)})"
					d={arc({
						innerRadius: 0,
						outerRadius: circleRadiusScale(incident.victims),
						startAngle: -Math.PI * 0.5,
						endAngle: Math.PI * 0.5,
					})} />
			{/each}
		</g>
	</svg>
</div>
