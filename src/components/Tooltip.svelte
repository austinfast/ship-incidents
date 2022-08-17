<script>
	import { prettyDate } from "../lib/text.js";

	export let incident;
	export let customContent;
	export let position;
	export let size = "large";
	export let onClose = () => null;

	let winWidth = 400;
	let winHeight = 600;
	let winScroll = 0;
	// takes a raw x position and returns an adjusted one to prevent tooltip from being cut off
	function getXPostition(rawX) {
		if ((rawX + tooltipWidth / 2) > winWidth) {
			return rawX - tooltipWidth / 2;
		}
		if (rawX - tooltipWidth / 2 < 0) {
			return rawX + tooltipWidth / 2;
		}
		return rawX;
	}
	// check for prescence of nav bar above article
	$: navEl = document ? document.getElementById("navWrapContainer") : null;
	// get height of nav bar if it exists
	$: navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
	$: tooltipWidth = size == "small" ? Math.min(winWidth, 220) : Math.min(winWidth, 400);
	$: xPos = getXPostition(position[0]);
	$: toolTipBelow = position[1] < (winHeight / 2 + winScroll);
	// make sure to adjust for nav bar in vertical position
	$: yPos = toolTipBelow ? position[1] + 10 - navHeight: position[1] - 10 - navHeight;

</script>

<svelte:window bind:innerWidth={winWidth} bind:innerHeight={winHeight} bind:scrollY={winScroll} />
<div class="tooltip-wrapper" class:small={size=="small"} style={`left: ${xPos}px; top: ${yPos}px`} class:below={toolTipBelow}>
	<button class="tooltip-close" aria-label="close tooltip" on:click={onClose}>✖</button>
	{#if incident}
		<p class="tooltip-label">{prettyDate(incident.real_date)}</p>
		{#if incident.casenickname}
			<p class="tooltip-text tooltip-value">{incident.casenickname}</p>
		{/if}
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
		<!-- <p class="tooltip-label">Details:</p> -->
		<!-- <p class="tooltip-text tooltip-narrative">{incident.narrative}</p> -->
	{:else if customContent}
		{#each customContent as item}
		{#if item.label}
			<p class="tooltip-label">{item.label}: </p>
		{/if}
		<p class="tooltip-text tooltip-value">{item.value}</p>
		{/each}
	{/if}
</div>

<style>
	.tooltip-wrapper {
		position: absolute;
		transform: translate(-50%, -100%);
		padding: 10px;
		background: #ffffff;
		width: 400px;
		border: solid 2px var(--mk-color-orange);
		box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.15);
		font-size: 14px;
		line-height: 15px;
		max-width: 100%;
		z-index: 500;
		font-family: var(--mk-font-family-sans);
	}
	.tooltip-wrapper.small {
		width: 220px;
		font-size: var(--mk-font-size-small);
	}
	.tooltip-wrapper.below {
		transform: translate(-50%, 0);
	}
	p.tooltip-label {
		font-size: 0.75em;
		margin: 0;
		line-height: 1.1;
		font-family: var(--mk-font-family-sans);
	}
	p.tooltip-text {
		font-family: var(--mk-font-family-sans);
		font-size: 1em;
		margin-bottom: 5px;
		margin-top: 5px;
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
	@media (max-width: 500px) {
		.tooltip-wrapper {
			left: 50% !important;
		}
	}
</style>
