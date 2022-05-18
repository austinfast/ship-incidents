<script>
	import { prettyDate } from "../utils/text.js";

	export let details;
	export let incidentLookup;

	let incident = null;

	$: if (details.incidentId) {
		incident = incidentLookup[details.incidentId];
	} else {
		incident = null;
	}

	let padding = 20;

	function getYPosition(y) {
		return y + padding;
	}

	function getXPosition(x) {
		return x + padding;
	}
</script>

<style>
	.popup-wrapper {
		position: absolute;
		padding: 10px;
		background: #ffffff;
		width: 250px;
	}

	p.popup-text {
		font-size: var(--font-size-small);
		line-height: var(--line-height-small);
		margin-bottom: 5px;
		margin-top: 0;
		font-weight: 700;
	}

	@media (min-width: 800px) {
		p.popup-text {
			/* font-size: var(--font-size-medium);
      line-height: var(--line-height-medium); */
		}
	}
</style>

<div
	class="popup-wrapper"
	style={`left: ${getYPosition(details.position[0])}px; top: ${getYPosition(
		details.position[1]
	)}px`}>
	{#if incident}
		<p class="popup-text">{prettyDate(incident.real_date)}</p>
		<p class="popup-text">{incident.city}, {incident.state}</p>
		<p class="popup-text">Victims: {incident.victims}</p>
	{:else}
		<p class="popup-text">I'm a popup</p>
	{/if}
</div>
