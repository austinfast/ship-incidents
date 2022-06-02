<script>
	import * as topojson from "topojson-client";
	import * as d3 from "d3";
	import statesTopo from "../../static/states_topo.json";
	import colors from "../../lib/colors.js";
	import ZoomControls from "../MapZoom.svelte";

	// PROPS
	export let incidentData;
	export let popupSlot;

	// Settings
	let width = 300;
	$: minCircleRadius = width < 400 ? 3 : 4;
	$: maxCircleRadius = width < 400 ? 20 : width < 768 ? 25 : 30;
	$: stateLabelSize = 10;

	let incidents = [];
	incidentData.then((d) => {
		incidents = d.incidents;
	});
	const statesGeo = topojson.feature(statesTopo, "states");
	let svgEl;
	let zoomTransform = {
		x: 0,
		y: 0,
		k: 1,
	};
	$: svgSelection = d3.select(svgEl);
	$: height = width * 0.55;
	$: projection = d3
		.geoAlbersUsa()
		.scale(width * 1.1)
		.translate([width / 2, height / 2]);
	$: path = d3.geoPath().projection(projection);
	$: incidentFeatures = incidents.map((d) => {
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
	$: svgSelection.call(zoom)
		.on("wheel.zoom", null);

	//zoom in handlers:
	// these basically call a d3 transition on our svg selection and calls the d3 zoom function on the transition
	// will pass these to the zoom UI component
	function zoomIn() {
		svgSelection.transition().call(zoom.scaleBy, 2);
	}
	function zoomOut() {
		svgSelection.transition().call(zoom.scaleBy, 0.5);
	}
</script>

<div class="chart-wrapper" bind:clientWidth={width}>
	<svg {width} {height} bind:this={svgEl}>
		<g
			class="zoomGroup"
			transform="translate({zoomTransform.x}, {zoomTransform.y}) scale({zoomTransform.k})">
			<g>
				{#each statesGeo.features as stateFeature}
					<path
						d={path(stateFeature)}
						fill={colors["grey-light"]}
						stroke={colors["grey"]} 
						stroke-width={1 / zoomTransform.k}/>
					<text 
						class="state-label"
						x={path.centroid(stateFeature)[0] - stateLabelSize / 2}
						y={path.centroid(stateFeature)[1] }
						font-size={stateLabelSize / zoomTransform.k}
						fill={colors["grey-dark"]}
						>{stateFeature.properties.STUSPS}</text>
				{/each}
			</g>
			<g>
				{#each incidentFeatures as incidentFeature}
					{#if incidentFeature.position}
						<circle
							cx={incidentFeature.position[0]}
							cy={incidentFeature.position[1]}
							fill={colors["orange"]}
							opacity="0.8"
							stroke="#ffffff"
							stroke-width={1 / zoomTransform.k}
							r={radiusScale(incidentFeature.victims)} />
					{/if}
				{/each}
			</g>
		</g>
	</svg>
	<ZoomControls {zoomIn} {zoomOut} />
</div>
