<script>
	import colors from "../lib/colors.js";

	export let zoomOut = function (e) {
		console.log("Zoom out function not implemented");
	};
	export let zoomIn = function (e) {
		console.log("Zoom in function not implemented");
	};
</script>


<div class="map-zoom-ui-wrapper">
	<button on:click={zoomIn} class="map-zoom-button map-zoom-button-top">
		<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M8 1.5C8 0.671875 7.32837 0 6.5 0C5.67163 0 5 0.671875 5 1.5V5H1.5C0.671631 5 0 5.67188 0 6.5C0 7.32812 0.671631 8 1.5 8H5V11.5C5 12.3281 5.67163 13 6.5 13C7.32837 13 8 12.3281 8 11.5V8H11.5C12.3284 8 13 7.32812 13 6.5C13 5.67188 12.3284 5 11.5 5H8V1.5Z" fill="#404040"/>
		</svg>
	</button>
	<button on:click={zoomOut} class="map-zoom-button map-zoom-button-bottom">
		<svg width="13" height="3" viewBox="0 0 13 3" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="13" height="3" rx="1.5" fill="#404040"/>
		</svg>
	</button>
</div>

<style>
	.map-zoom-ui-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: absolute;
		top: 5px;
		right: 5px;
	}
	.map-zoom-button {
		background: #ffffff;
		background: var(--mk-color-grey-light);
		border: solid 1px var(--mk-color-grey);
		display: block;
		width: 29px;
		height: 29px;
		cursor: pointer;
	}
	.map-zoom-button-top {
		border-radius: 3px 3px 0 0;
		border-bottom: none;
	}
	.map-zoom-button-bottom {
		border-radius: 0 0 3px 3px;
	}
</style>
