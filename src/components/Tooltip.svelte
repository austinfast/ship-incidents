<script>
	import { prettyDate } from "../lib/text.js";

	export let incident;
	export let position;
	export let onClose = () => null;

	let winWidth = 350;
	let winHeight = 600;
	let winScroll = 0;
	$: tooltipWidth = Math.min(winWidth, 350);
	$: xPos = ((position[0] + tooltipWidth / 2) > winWidth || (position[0] - tooltipWidth / 2 < 0)) ? winWidth / 2 : position[0];
	$: toolTipBelow = position[1] < (winHeight / 2 + winScroll);
	$: yPos = toolTipBelow ? position[1] + 10 : position[1] - 10;

	function cleanNarrative(rawNarrative) {
		return rawNarrative
			.replace( /(<([^>]+)>)/ig, '')
			.replaceAll("&nbsp;", " ");
	}
</script>

<svelte:window bind:innerWidth={winWidth} bind:innerHeight={winHeight} bind:scrollY={winScroll} />
<div class="tooltip-wrapper" style={`left: ${xPos}px; top: ${yPos}px`} class:below={toolTipBelow}>
	<button class="tooltip-close" aria-label="close tooltip" on:click={onClose}>✖</button>
	{#if incident}
		<p class="tooltip-label">{prettyDate(incident.real_date)}</p>
		<p class="tooltip-text tooltip-value">{incident.city}, {incident.state}</p>
		<div class="tooltip-detail-section">
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Victims:</p>
				<p class="tooltip-text tooltip-value">{incident.victims}</p>
			</div>
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Injured:</p>
				<p class="tooltip-text tooltip-value">{incident.numinjured}</p>
			</div>
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Number of offenders:</p>
				<p class="tooltip-text tooltip-value">{incident.offenders}</p>
			</div>
			<div class="tooltip-detail-group">
				<p class="tooltip-label">First cause of death:</p>
				<p class="tooltip-text tooltip-value">{incident.firstcod}</p>
			</div>
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Incident type:</p>
				<p class="tooltip-text tooltip-value">{incident.type}</p>
			</div>
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Location type:</p>
				<p class="tooltip-text tooltip-value">{incident.location_type}</p>
			</div>
		</div>
		<p class="tooltip-label">Details:</p>
		<p class="tooltip-text tooltip-narrative">{cleanNarrative(incident.narrative)}</p>
	{:else}
		<p class="tooltip-text">I'm a popup</p>
	{/if}
</div>

<style>
	.tooltip-wrapper {
		position: absolute;
		transform: translate(-50%, -100%);
		padding: 10px;
		background: #ffffff;
		width: 350px;
		border: solid 2px var(--mk-color-orange);
		box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.15);
		font-size: 14px;
		line-height: 15px;
		max-width: 100%;
		z-index: 200;
	}
	.tooltip-wrapper.below {
		transform: translate(-50%, 0);
	}
	.tooltip-label {
		font-size: 0.75em;
		margin: 0;
		line-height: 1.1;
	}
	p.tooltip-text {
		font-size: 1em;
		margin-bottom: 5px;
		margin-top: 0;
	}
	.tooltip-value {
		font-weight: 700;
	}
	.tooltip-detail-section {
		display: flex;
		flex-wrap: wrap;
		margin: 1em 0;
	}
	.tooltip-detail-group {
		margin: 0 10px 10px 0;
	}
	.tooltip-detail-group:last-child {
		margin: 0;
	}
	.tooltip-close {
		background: none;
		border: none;
		position: absolute;
		top: 10px;
		right: 10px;
		color: var(--mk-color-grey-dark);
	}

	@media (min-width: 800px) {
		p.tooltip-text {
			/* font-size: var(--font-size-medium);
      line-height: var(--line-height-medium); */
		}
	}
</style>
