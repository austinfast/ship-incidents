<script>
	import * as d3 from "d3";
	import colors from "../../lib/colors";

	export let weaponData;
	let weapons = [];
	let boxSize = 10;
	let boxMargin = 1;
	let width = 300;
	let chartColors = [
		colors["orange-dark"],
		colors["orange"],
		colors["orange-light"],
		colors["blue-dark"],
		colors["blue"],
		colors["blue-light"],
		colors["grey"],
		colors["grey-dark"],
		colors["grey"],
		colors["grey-dark"],
	];

	weaponData.then((d) => {
		weapons = d.weapons;
	});
	$: weaponTypes = getRankedTypes(weapons, "weapon_type");
	// $: colorScale = d3.scaleOrdinal().domain(weaponTypes).range(d3.schemeSet3);
	$: colorScale = d3.scaleOrdinal().domain(weaponTypes).range(chartColors);
	$: sortWeapons = function (_weapons) {
		return _weapons.sort(
			(a, b) => weaponTypes.indexOf(a.weapon_type) - weaponTypes.indexOf(b.weapon_type)
		);
	};
	$: sortedWeapons = sortWeapons(weapons);
	$: console.log(sortedWeapons);
	$: boxesPerRow = Math.floor(width / (boxSize + boxMargin));
	// $: boxesPerRow = 100;
	$: height = Math.ceil(weapons.length / boxesPerRow) * (boxSize + boxMargin);

	// takes an array of objects, and a string valueKey
	// returns an array of possible values at valueKey, ranked by number of occurences in items.
	function getRankedTypes(items, valueKey) {
		const counts = {};
		let types = [];
		for (const item of items) {
			// if we already have a count for this value, add one
			// else set count to 1 for value and add new type to types array
			if (counts[item[valueKey]]) {
				counts[item[valueKey]] += 1;
			} else {
				counts[item[valueKey]] = 1;
				types.push(item[valueKey]);
			}
		}
		return types.sort((a, b) => counts[b] - counts[a]);
	}
</script>

<div class="chart-wrapper weapon-waffle" bind:clientWidth={width}>
	{#if sortedWeapons.length > 0}
		<p class="debug-info">
			width: {width} boxes per row: {boxesPerRow} total boxes: {weapons.length}
			{sortedWeapons.length}
		</p>
		<svg {width} {height}>
			<g>
				{#each sortedWeapons as weapon, i}
					<rect
						width={boxSize}
						height={boxSize}
						x={(i % boxesPerRow) * (boxSize + boxMargin)}
						y={Math.floor(i / boxesPerRow) * (boxSize + boxMargin)}
						fill={colorScale(weapon.weapon_type)} />
				{/each}
			</g>
		</svg>
	{/if}
</div>

<style>
	.debug-info {
		font-size: 12px;
		font-family: monospace;
		padding: 5px;
		background: #cecece;
	}
	.chart-wrapper.weapon-waffle {
		max-width: 500px;
	}
</style>
