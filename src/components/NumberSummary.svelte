<script>
	import { fade } from "svelte/transition";
	import Loading from "./Loading.svelte";
	import { prettyNumber } from "../lib/text.js";
	export let incidentData;
	export let victimData;
</script>
<div class="chart-wrapper number-overview">
	{#await Promise.all([victimData, incidentData])}
	<Loading />
	{:then results}
	<div class="summary-inner" transition:fade>
		<div class="victim-count">
			<p class="summary-number">{prettyNumber(results[0].totalVictims)}</p>
			<p class="summary-description">people have been killed in</p>
		</div>
		<div class="incident-count">
			<p class="summary-number">{prettyNumber(results[1].incidents.length)}</p>
			<p class="summary-description">mass killings since 2006</p>
		</div>
	</div>
	{/await}
</div>
<style>
.number-overview {
	padding: 1em 0;
}
.summary-inner {
	display: flex;
	text-align: center;
	justify-content: center;
	width: 100%;
}
.victim-count {
	margin-right: 25px;
}
.incident-count {
	margin-left: 25px;
}
.number-overview .summary-number {
	color: var(--mk-color-orange);
	font-size: 4em;
	font-family: var(--mk-font-family-serif);
	/* margin-bottom: 2rem; */
}
.number-overview .summary-description {
	font-size: var(--mk-font-size-small);
}
@media(min-width: 768px) {
	.number-overview .summary-number {
		font-size: 6em;
		line-height: 1.25em;
	}
}
@media(min-width: 1400px) {
	.number-overview .summary-number {
		font-size: 6vw;
		line-height: 1.25em;
	}
}
</style>
