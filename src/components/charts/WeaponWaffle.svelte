<script>
	import Footer from "../ChartFooter.svelte";

	export let weaponData;
	export let splitBy;
	export let chartColor = "#cecece";
	export let dataFilter;
	export let labels = {};
	export let chartLabel;

	let weapons = [];
	let boxSize = 10;
	let boxMargin = 1;
	let width = 300;
	let updated_at;

	weaponData.then((d) => {
		if (dataFilter) {
			weapons = d.weapons.filter(d => dataFilter[1].indexOf(d[dataFilter[0]]) > -1);
		} else {
			weapons = d.weapons;
		}
		updated_at = d.updated_at;
	});

	// chart sizing
	$: waffleMargin = {
		top: 10,
		right: 10,
		bottom: 20,
		left: 10,
	};
	$: wafflesPerRow = width < 500 ? 2 : width < 768 ? 3 : 4;
	$: waffleLabelSize = 13;
	$: waffleWidth = Math.floor(width / wafflesPerRow);
	$: waffleInnerWidth = waffleWidth - waffleMargin.left - waffleMargin.right;
	$: boxesPerRow = Math.floor(waffleInnerWidth / (boxSize + boxMargin));

	$: weaponTypes = getRankedTypes(weapons, splitBy);
	$: sortWeapons = function (_weapons) {
		return _weapons.sort(
			(a, b) => weaponTypes.indexOf(a.weapon_type) - weaponTypes.indexOf(b.weapon_type)
		);
	};
	$: chartsData = getChartRows(
		weaponTypes.map((d) => weapons.filter((w) => w[splitBy] == d))
	);
	$: sortedWeapons = sortWeapons(weapons);
	$: height = chartsData.reduce((prev, curr) => prev + getWaffleRowHeight(curr), 0) + waffleMargin.bottom;
	$: getWaffleXPosition = function (chartIdx) {
		return (
			(boxesPerRow * (boxSize + boxMargin) + waffleMargin.right + waffleMargin.left) *
				(chartIdx % wafflesPerRow) +
			waffleMargin.left
		);
	};
	$: getWaffleYPosition = function (rowIdx) {
		let y = 0;
		for (var i = rowIdx - 1; i >= 0; i -= 1) {
			const rowHeight = getWaffleRowHeight(chartsData[i]);
			y += rowHeight;
		}
		return y + waffleMargin.top;
	};
	$: getChartRows = function (d) {
		const rows = [];
		for (const [i, cd] of d.entries()) {
			let rowIdx = Math.floor(i / wafflesPerRow);
			if (rows[rowIdx]) {
				rows[rowIdx].push(cd);
			} else {
				rows[rowIdx] = [cd];
			}
		}
		return rows;
	};

	$: getWaffleRowHeight = function (rowData) {
		return (
			Math.ceil(rowData[0].length / boxesPerRow) * (boxSize + boxMargin) +
			waffleMargin.bottom +
			waffleMargin.top
		);
	};
	$: getLabel = function (rawStr) {
		if (labels) {
			if (labels[rawStr]) {
					return labels[rawStr];
				}
		}
		return rawStr.charAt(0).toUpperCase() + rawStr.substring(1);
	}

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

<div class="chart-wrapper weapon-waffle">
	<div bind:clientWidth={width}>
		{#if chartLabel}
			<h3 class="chart-label">{chartLabel}</h3>
		{/if}
		{#if chartsData.length > 0}
			<svg {width} {height} role="img">
				<title>A chart showing the {chartLabel.toLowerCase()}</title>
				{#each chartsData as chartRow, rowIdx}
					<g transform="translate(0, {getWaffleYPosition(rowIdx)})" class="chart-row">
						{#each chartRow as chartData, chartIdx}
							<g
								transform="translate({getWaffleXPosition(chartIdx)}, 0)"
								class="chart-item">
								{#each chartData as weapon, i}
									<rect
										width={boxSize}
										height={boxSize}
										x={(i % boxesPerRow) * (boxSize + boxMargin)}
										y={getWaffleRowHeight(chartRow) -
											waffleMargin.bottom -
											waffleMargin.top -
											Math.floor(i / boxesPerRow) * (boxSize + boxMargin)}
										fill={chartColor} />
								{/each}
								<text
									font-size={waffleLabelSize}
									transform="translate(0, {getWaffleRowHeight(chartRow) -
										waffleMargin.bottom +
										waffleLabelSize})">{getLabel(chartData[0][splitBy])}</text>
							</g>
						{/each}
					</g>
				{/each}
			</svg>
		{/if}
	</div>
	<Footer {updated_at} />
</div>
