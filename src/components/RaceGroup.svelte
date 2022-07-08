<script>
	import { prettyNumber } from "../lib/text.js";
	import colors from "../lib/colors.js";
	import Bars from "./charts/RankedBar.svelte";
	import Loading from "./Loading.svelte";

	export let offenderData;
	export let victimData;
	export let valueKey;
	export let victimHeadline;
	export let offenderHeadline;

	let unkownVictims;
	let totalVictims;
	let unkownOffenders;
	let totalOffenders;

	victimData.then((d) => {
		unkownVictims = d.victimRaceCounts.find((c) => c.label == "Unknown").count;
		totalVictims = d.totalVictims;
	});
	offenderData.then((d) => {
		unkownOffenders = d.offenderRaceCounts.find((c) => c.label == "Unknown").count;
		totalOffenders = d.offenders.length;
	});
</script>
<div class="chart-group">
	{#await Promise.all([offenderData, victimData])}
		<Loading height={500}/>
	{:then _}
		<div class="group-item">
			<Bars chartLabel={victimHeadline} chartData={victimData} dataKey="victimRaceCounts" color={colors.orange} valueKey={valueKey} numTicks={3}/>
		</div>
		<div class="group-item">
			<Bars chartLabel={offenderHeadline} chartData={offenderData} dataKey="offenderRaceCounts" color={colors.blue} valueKey={valueKey} numTicks={3}/>
		</div>
	{/await}
</div>

<style>
.chart-group {
	display: flex;
	flex-wrap: wrap;
	max-width: 900px;
	margin: 0 auto;
}
.group-item {
	width: 100%;
}
@media(min-width: 768px) {
	.group-item {
		width: calc(50% - 10px);
	}
	.group-item:first-child {
		padding-right: 5px;
	}
	.group-item:nth-child(2) {
		padding-left: 5px;
	}
}
</style>
