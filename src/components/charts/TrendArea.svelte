<script>
	import * as d3 from "d3";
	import colors from "../../colors.json";
	import {getIncidentData, incidentData} from "../../stores/data.js";

	// PROPS
	export let yearlyData = [];
	export let yearlyVariables = [];

	// data
	$: if (!$incidentData) {
		console.log("no data yet, asking for more")
		getIncidentData();
	} else {
		console.log("data already exists, awaiting");
		$incidentData.then((d) => {
			yearlyData = d.yearlySummaries;
		})
	}

	let wrapEl;
	let xAxisEl;
	let yAxisEl;
	let width;
	let height = 400;
	let defaultDate = new Date();

	$: margin = {
		top: 20,
		right: 20,
		bottom: 20,
		left: 30,
	};
	$: chartWidth = width - margin.left - margin.right;
	$: chartHeight = height - margin.top - margin.bottom;
	$: colorScale = d3
		.scaleOrdinal()
		.domain(yearlyVariables.map((c) => c.field))
		.range([colors["orange-light"], colors["orange"], colors["orange-dark"]]);
	$: scaleX = d3
		.scaleTime()
		.domain([
			yearlyData.length > 0 ? yearlyData[0].year_date : defaultDate,
			yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].year_date : defaultDate,
		])
		.range([0, chartWidth]);

	$: scaleY = d3
		.scaleLinear()
		.domain([
			0,
			d3.max(
				yearlyData.reduce((values, yearData) => {
					yearlyVariables.forEach((yearlyVariable) => {
						values.push(yearData[yearlyVariable.field]);
					});
					return values;
				}, [])
			),
		])
		.range([chartHeight, 0]);

	$: dotRadius = width < 600 ? 3 : 4;
	$: getLine = (yearlyVariable) =>
		d3
			.line()
			.x((d) => scaleX(d.year_date))
			.y((d) => scaleY(d[yearlyVariable.field]));

	$: getArea = (yearlyVariable) =>
		d3
			.area()
			.x((d) => scaleX(d.year_date))
			.y0((d, i) => {
				if (yearlyVariables.indexOf(yearlyVariable) < yearlyVariables.length - 1) {
					return scaleY(
						d[yearlyVariables[yearlyVariables.indexOf(yearlyVariable) + 1].field]
					);
				}
				return chartHeight;
			})
			.y1((d) => scaleY(d[yearlyVariable.field]));

	$: axisY = d3.axisLeft(scaleY);
	$: axisX = d3.axisBottom(scaleX);
	$: if (xAxisEl) {
		d3.select(xAxisEl)
			.call(axisX)
			.call((g) => {
				g.selectAll("line").attr("stroke", "#DEDEDE");
				g.selectAll(".domain").attr("stroke", "#DEDEDE");
			});
	}
	$: if (yAxisEl) {
		d3.select(yAxisEl)
			.call(axisY)
			.call((g) => {
				g.selectAll("line").attr("stroke", "#DEDEDE");
				g.selectAll(".domain").attr("stroke", "#DEDEDE");
				g.select(".domain").remove();
			});
	}

	function hexToRGB(hex, alpha) {
		var r = parseInt(hex.slice(1, 3), 16),
			g = parseInt(hex.slice(3, 5), 16),
			b = parseInt(hex.slice(5, 7), 16);

		if (alpha) {
			return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
		} else {
			return "rgb(" + r + ", " + g + ", " + b + ")";
		}
	}
</script>

<style>
	:global(.tick text) {
		color: "#404040";
		font-family: var(--font-family-sans, sans-serif);
		font-weight: 700;
	}

	.key-wrapper {
		display: flex;
	}

	.key-item {
		display: flex;
		/* justify-content: center; */
		align-items: center;
		margin-right: 10px;
	}

	.key-item-swatch {
		width: 10px;
		height: 10px;
	}

	p.key-item-label {
		font-size: var(--font-size-small);
		line-height: var(--line-height-small);
		margin-bottom: 0;
		margin-left: 5px;
	}
</style>

<div class="trend-line-wrap chart-wrapper" bind:this={wrapEl} bind:clientWidth={width}>
	<div class="key-wrapper">
		{#each yearlyVariables as yearlyVariable}
			<div class="key-item">
				<div
					class="key-item-swatch"
					style={"background-color: " + colorScale(yearlyVariable.field)} />
				<p class="key-item-label">{yearlyVariable.label}</p>
			</div>
		{/each}
	</div>
	<svg {width} {height}>
		<g class="chart-g" transform="translate({margin.left}, {margin.top})">
			<g class="x-axis-g" transform="translate(0, {chartHeight})" bind:this={xAxisEl} />
			<g class="y-axis-g" bind:this={yAxisEl} />
			<g class="data-g">
				{#each yearlyVariables as yearlyVariable}
					<path
						d={getArea(yearlyVariable)(yearlyData)}
						fill={colorScale(yearlyVariable.field)}
						opacity="0.90" />
					<path
						d={getLine(yearlyVariable)(yearlyData)}
						stroke={colorScale(yearlyVariable.field)}
						stroke-width="2"
						fill="none"
						stroke-linejoin="round"
						stroke-linecap="round" />
					{#each yearlyData as year}
						<circle
							fill={colorScale(yearlyVariable.field)}
							r={dotRadius}
							cx={scaleX(year.year_date)}
							cy={scaleY(year[yearlyVariable.field])} />
						class="year-dot"
					{/each}
				{/each}
			</g>
		</g>
	</svg>
</div>
