<script>
	import { prettyDate } from "../lib/text.js";
	import { onMount , afterUpdate} from "svelte";

	export let incident;
	export let customContent;
	export let position;
	export let size = "large";
	export let onClose = () => null;

	let winWidth = 400;
	let winHeight = 600;
	let winScroll = 0;
    let tooltipElement;

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
	/*
	function getYPostition(rawY) {
		if ((rawY - tooltipHeight ) < 0) {
//			return rawY - tooltipWidth / 2;
			return rawY + tooltipWidth / 2;
		}
		//if (rawY - tooltipWidth / 2 < 0) {
		//	return rawY + tooltipWidth / 2;
		//}
		return rawY;
	}
	*/
	
	// check for prescence of nav bar above article
	$: navEl = document ? document.getElementById("navWrapContainer") : null;
	// get height of nav bar if it exists
	$: navHeight = navEl ? navEl.getBoundingClientRect().height : 0;
	$: console.log (navHeight)
	$: tooltipWidth = size == "small" ? Math.min(winWidth, 220) : Math.min(winWidth, 400);
	$: xPos = getXPostition(position[0]);
	//$: toolTipBelow = position[1] < (winHeight / 2 + winScroll);
	$: incidentYear = incident ? new Date(incident.real_date).getFullYear() : null;
	// Set toolTipBelow based on the incident year
	$: toolTipBelow = (incidentYear === 2019 || incidentYear === 2020);
	// make sure to adjust for nav bar in vertical position
	$: yPos = toolTipBelow ? position[1] + 10 + navHeight: position[1] - 10 - navHeight;
	$: console.log ("tooltipbelow", toolTipBelow, "yPos", yPos, "xPos", xPos)
	//$: yPos = toolTipBelow ? position[1] + 10 - navHeight: position[1] - 10 - navHeight;
	//$: yPos = toolTipBelow ? 10 : position[1] - 10;
	//$: yPos = getYPostition(position[1]);
	
	
	/*
	 // Adjust position after the component has mounted or updated
  onMount(() => {
    if (tooltipElement) {
      adjustTooltipPosition();
    }
  });

  afterUpdate(() => {
    if (tooltipElement) {
      adjustTooltipPosition();
    }
  });
  
function adjustTooltipPosition() {
    const tooltipHeight = tooltipElement.offsetHeight;
    const tooltipTop = position[1] - tooltipHeight - 10;
    
    console.log("height", tooltipHeight)

    if (tooltipTop < 0) {
      yPos = tooltipHeight + 10; // Adjust as needed
    }
  }
  */
	
</script>

<svelte:window bind:innerWidth={winWidth} bind:innerHeight={winHeight} bind:scrollY={winScroll} />

<!--<div class="tooltip-wrapper" class:small={size=="small"} style={`left: ${xPos}px; top: ${yPos}px`} class:below={toolTipBelow}>-->
<div class="tooltip-wrapper" class:small={size == "small"} style={`left: ${xPos}px; top: ${yPos}px`} class:below={toolTipBelow} bind:this={tooltipElement}>

<!--<div class="tooltip-wrapper" style={`left: ${xPos}px; top: ${yPos}px`} class:below={toolTipBelow}>-->
<!--<div class="tooltip-wrapper" 
     class:small={size=="small"} 
     style={`left: ${xPos}px; top: ${yPos}px; position: absolute;`}>-->

	<button class="tooltip-close" aria-label="close tooltip" on:click={onClose}>✖</button>
	{#if incident}
		<p class="tooltip-label">{prettyDate(incident.real_date)}</p>
		{#if incident.casenickname}
			<p class="tooltip-text tooltip-value">{incident.casenickname}</p>
		{/if}
		<!--<p class="tooltip-text tooltip-value">{incident.city}, {incident.state}</p>-->
		<p class="tooltip-text tooltip-value">{incident.vessel_name} [{incident.vessel_type}]</p>
		<!--<div class="tooltip-detail-section">
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Company:</p>-->
				<p class="tooltip-text tooltip-value">{incident.umbrella} [{incident.subsidiary_list}]</p>
			<!--</div>
		</div>-->			
		<div class="tooltip-detail-section">
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Deaths:</p>
				<p class="tooltip-text tooltip-value">{incident.number_dead}</p>
			</div>
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Injured:</p>
				<p class="tooltip-text tooltip-value">{incident.number_injured}</p>
			</div>
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Missing:</p>
				<p class="tooltip-text tooltip-value">{incident.number_missing}</p>
			</div>
			<!--
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
			</div>-->
			<div class="tooltip-detail-group">
				<p class="tooltip-label">Location:</p>
				<p class="tooltip-text tooltip-value">{incident.location}</p>
			</div>
			<!-- <div class="tooltip-detail-group">
				<p class="tooltip-label">Company role(s):</p>
				<p class="tooltip-text tooltip-value">{incident.summary}</p>
			</div>
			-->
		</div>
		<p class="tooltip-label">Details:</p> 
		<p class="tooltip-text tooltip-narrative">{incident.incident_precis}</p> 
	{:else if customContent}
		{#each customContent as item}
		{#if item.label}
			<p class="tooltip-label">{item.label}: </p>
		{/if}
		<p class="tooltip-text tooltip-value">{item.value}</p>
		{/each}
	{/if}
</div>

<!--Orig tooltip-wrapper
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
</style> -->

<style>
.tooltip-wrapper {
    background: #fff;
    border: 2px solid var(--mk-color-orange);
    box-shadow: 0 0 5px 2px rgba(0,0,0,.15);
    font-family: var(--mk-font-family-sans);
    font-size: 14px;
    line-height: 15px;
    max-width: 100%;
    padding: 10px;
    position: absolute;
    transform: translate(-50%,-100%);
    width: 400px;
    z-index: 500;
}

.tooltip-wrapper.small {
    font-size: var(--mk-font-size-small);
    width: 220px;
}

.tooltip-wrapper.below {
    transform: translate(-50%);
}

p.tooltip-label {
    font-family: var(--mk-font-family-sans);
    font-size: .75em;
    line-height: 1.1;
    margin: 0;
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
    color: var(--mk-color-grey-dark);
    position: absolute;
    right: 10px;
    top: 10px;
}

@media(max-width: 500px) {
    .tooltip-wrapper {
        left: 50%!important;
    }
}

.loading-module-wrapper {
    align-items: center;
    background: #fff;
    display: flex;
    justify-content: center;
}

.loading-icon {
    --accent-color: var(--mk-color-orange);
}

.loading-icon-content .loading-icon-text {
    color: var(--accent-color, #404040);
    font-size: 16px;
    text-align: center;
}

.loading-icon-content-loader {
    font-size: 10px;
    height: 30px;
    text-align: center;
    width: 100%;
    z-index: 9999;
}

.loading-icon-content-loader > div {
    -webkit-animation: stretchdelay 1.2s ease-in-out infinite;
    animation: stretchdelay 1.2s ease-in-out infinite;
    background-color: var(--accent-color, #404040);
    display: inline-block;
    height: 30px;
    width: 6px;
}

.loading-icon-content-loader .rect2 {
    -webkit-animation-delay: -1.1s;
    animation-delay: -1.1s;
}

.loading-icon-content-loader .rect3 {
    -webkit-animation-delay: -1s;
    animation-delay: -1s;
}

.loading-icon-content-loader .rect4 {
    -webkit-animation-delay: -.9s;
    animation-delay: -.9s;
}

.loading-icon-content-loader .rect5 {
    -webkit-animation-delay: -.8s;
    animation-delay: -.8s;
}

@-webkit-keyframes stretchdelay {
    0%, 40%, to {
        -webkit-transform: scaleY(.4);
    }
    20% {
        -webkit-transform: scaleY(1);
    }
}

@keyframes stretchdelay {
    0%, 40%, to {
        transform: scaleY(.4);
        -webkit-transform: scaleY(.4);
    }
    20% {
        transform: scaleY(1);
        -webkit-transform: scaleY(1);
    }
}

.type-info-wrapper {
    align-self: flex-end;
    padding-bottom: 3px;
    padding-left: 10px;
    z-index: 500;
}

.type-info-button {
    background: var(--mk-color-grey);
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    font-weight: 900;
    height: 30px;
    width: 30px;
}

.type-info-details-wrapper {
    background: #fff;
    border: 1px solid var(--mk-color-grey);
    box-shadow: 0 0 5px 2px rgba(0,0,0,.05);
    max-width: 80vw;
    overflow-y: auto;
    padding: 10px;
    position: absolute;
    right: 35px;
    top: -3px;
    transform: translate(-100%);
    width: 375px;
}

.type-info-details-wrapper.hide {
    display: none;
}

.type-info-details-wrapper p {
    font-family: var(--mk-font-family-sans);
    font-size: var(--mk-font-size-small);
    line-height: var(--mk-line-height-small);
    margin: 0;
}

p.type-info-term {
    font-weight: 700;
    margin-top: 10px;
}

.detail-close {
    background: none;
    border: none;
    color: var(--mk-color-grey-dark);
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
}

@media(max-width: 620px) {
    .type-info-wrapper {
        position: static;
    }

    .type-info-details-wrapper {
        left: 50%!important;
        transform: translate(-50%);
    }
}

.filter-select {
    appearance: none;
    background: var(--mk-color-grey-light);
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),linear-gradient(180deg,#fff 0,#fff);
    background-position: right .7em top 50%,0 0;
    background-repeat: no-repeat,repeat;
    background-size: .65em auto,100%;
    border: 1px solid var(--mk-color-grey);
    border-radius: 5px;
    color: var(--mk-color-grey-dark);
    cursor: pointer;
    display: block;
    font-family: var(--mk-font-family-sans, sans-serif);
    min-width: 130px;
    padding: 8px 25px 8px 5px;
}

.filter-label {
    font-size: .8em;
}

.filter-wrap {
    display: flex;
}

.chart-footer {
    margin: 0;
    padding-bottom: 1em;
}

.chart-footer p.footer-text {
    color: var(--mk-color-grey-dark);
    font-family: var(--mk-font-family-sans);
    font-size: var(--mk-font-size-small);
    line-height: var(--mk-line-height-small);
    margin: 0;
}

.timeline-year-label {
    font-family: var(--mk-font-family-sans, sans-serif);
    font-size: var(--mk-font-size-small, 12px);
    font-weight: 700;
}

.timeline-controls {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1em;
}

.timeline-month-label-group line, .timeline-year-group line {
    stroke: var(--mk-color-grey);
}

.incident-bubble {
    cursor: crosshair;
}

.timeline-chart-month-axis .domain {
    display: none;
    opacity: 0;
}

.timeline-chart-year-label {
    color: var(--mk-color-grey-dark);
    font-size: var(--mk-font-size-small, 12px);
    font-weight: 700;
}

.timeline-month-labels text {
    color: var(--mk-color-grey-dark);
    font-size: 10px;
    font-weight: 700;
}

@media(min-width: 600px) {
    .timeline-chart-year-label {
        font-size: var(--mk-font-size-medium, 16px);
    }
}
</style>

