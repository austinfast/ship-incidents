<script>
	import * as topojson from "topojson-client";
	import * as d3 from "d3";
	import statesTopo from "../../static/states_topo.json";
	import colors from "../../lib/colors.js";
	import { filterUnique } from "../../lib/utils.js";
	import Tooltip from "../Tooltip.svelte";
	import ZoomControls from "../MapZoom.svelte";
	import FilterSelect from "../FilterSelect.svelte";
	import Footer from "../ChartFooter.svelte";

	// PROPS
	export let incidentData;
	export let nobuttons = false;

	// Settings
	let width = 300;
	let typeFilter = null;
	let tooltip = null;
	let updated_at;
	$: minCircleRadius = (width < 400 ? 3 : 4) / zoomTransform.k;
	$: maxCircleRadius = (width < 500 ? 20 : width < 768 ? 25 : 30) / zoomTransform.k;
	$: stateLabelSize = 10;

	let incidents = [];
	incidentData.then((d) => {
		incidents = d.incidents;
		updated_at = d.updated_at;
	});
	const statesGeo = topojson.feature(statesTopo, "states");
	let svgEl;
	let zoomTransform = {
		x: 0,
		y: 0,
		k: 1,
	};
	$: svgSelection = d3.select(svgEl);
	$: height = width * 0.65;
	// $: projection = d3
	// 	.geoAlbersUsa()
	// 	.scale(width * 1.1)
	// 	.translate([width / 1.9, height / 2]);
	$: projection = d3
		.geoAlbersUsa()
		.fitWidth(width, statesGeo);
	$: path = d3.geoPath().projection(projection);
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
	$: incidentFeatures = filteredIncidents.map((d) => {
		const position = projection([d.longitude, d.latitude]);
		return {
			...d,
			position,
		};
	});
	$: radiusScale = d3
		.scaleSqrt()
		.domain([4, d3.max(incidents, (i) => i.victims)])
		.range([minCircleRadius, maxCircleRadius]);

	// this receives the magic output of the d3 zoom, we should probably use these values
	// in some component variables, rather than setting attributes via d3 selections
	function zoomed(e) {
		const { transform } = e;
		zoomTransform = transform;
		// mapG.attr("transform", transform);
		// mapG.attr("stroke-width", 1 / transform.k);
	}

	// leaning on this d3 zoom magic
	// @TODO i feel like i could re-implement this with Svelte tweens and properties
	// and i wonder if it would be better ?
	const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

	// bind events via d3
	$: svgSelection.call(zoom).on("wheel.zoom", null);

	//zoom in handlers:
	// these basically call a d3 transition on our svg selection and calls the d3 zoom function on the transition
	// will pass these to the zoom UI component
	function zoomIn() {
		svgSelection.transition().call(zoom.scaleBy, 2);
	}
	function zoomOut() {
		svgSelection.transition().call(zoom.scaleBy, 0.5);
	}

	// tooltip function
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

<div class="chart-wrap-double-group">
	<div class="chart-inner-wrapper" bind:clientWidth={width}>
		<h3 class="chart-label">Mass killings by location scaled by number of victims</h3>
		{#if !nobuttons}
			<div class="map-controls">
				<FilterSelect
					bind:currentValue={typeFilter}
					options={typeFilterOptions}
					showTypeInfo={true}
					defaultLabel="All"
					filterLabel="Filter by type" />
			</div>
		{/if}
		<div class="map-wrap">
			<svg {width} {height} bind:this={svgEl} role="img">
				<title>A map showing the locations of mass killings in the U.S.</title>
				<g
					class="zoomGroup"
					transform="translate({zoomTransform.x}, {zoomTransform.y}) scale({zoomTransform.k})">
					<g>
						{#each statesGeo.features as stateFeature}
							<path
								d={path(stateFeature)}
								fill={colors["grey-light"]}
								stroke={colors["grey"]}
								stroke-width={1 / zoomTransform.k} />
							<text
								class="state-label"
								x={path.centroid(stateFeature)[0] - stateLabelSize / 2}
								y={path.centroid(stateFeature)[1]}
								font-size={stateLabelSize / zoomTransform.k}
								fill={colors["grey"]}>{stateFeature.properties.STUSPS}</text>
						{/each}
					</g>
					<g>
						{#each incidentFeatures as incidentFeature}
							{#if incidentFeature.position}
								<circle
									class="incident-bubble"
									cx={incidentFeature.position[0]}
									cy={incidentFeature.position[1]}
									fill={colors["orange"]}
									opacity={tooltip && !(tooltip.incident.id == incidentFeature.id) ? 0.25 : 0.75}
									stroke="#ffffff"
									stroke-width={1 / zoomTransform.k}
									r={radiusScale(incidentFeature.victims)}
									on:mousemove={(e) => onDetails(incidentFeature, [e.pageX, e.pageY])}
									on:mouseleave={(e) => onDetails()} />
							{/if}
						{/each}
					</g>
				</g>
			</svg>
			{#if !nobuttons}
				<ZoomControls {zoomIn} {zoomOut} />
			{/if}
		</div>
	</div>
	<Footer {updated_at} />
</div>
{#if tooltip}
	<Tooltip incident={tooltip.incident} position={tooltip.position} onClose={() => tooltip = null}/>
{/if}

<style>
	.map-controls {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1em;
	}
	.map-wrap {
		position: relative;
	}
	.incident-bubble {
		cursor: crosshair;
	}
</style>
