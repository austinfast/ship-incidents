<script>
	import * as topojson from "topojson-client";
	import * as d3 from "d3";
	import statesTopo from "../../static/states_topo.json";
	import colors from "../../lib/colors.js";

	// PROPS
	export let incidentData;
	export let popupSlot;

	const statesGeo = topojson.feature(statesTopo, "states");
	let incidents = [];
	incidentData.then((d) => {
		incidents = d.incidents;
	});
	let width = 300;
	$: height = width * 0.8;
	$: projection = d3
		.geoAlbersUsa()
		.scale(width)
		.translate([width / 2, height / 2]);
	$: path = d3.geoPath().projection(projection);
	$: incidentFeatures = incidents.map((d) => {
		const position = projection([d.longitude, d.latitude]);
		return {
			...d,
			position,
		};
	});
	$: console.log(incidentFeatures);
</script>

<div class="chart-wrapper" bind:clientWidth={width}>
	<svg {width} {height}>
		<g>
			{#each statesGeo.features as stateFeature}
				<path
					d={path(stateFeature)}
					fill={colors["grey-light"]}
					stroke={colors["grey"]} />
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
						r="5" />
				{/if}
			{/each}
		</g>
	</svg>
</div>
