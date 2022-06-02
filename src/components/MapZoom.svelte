<script>
	export let zoomOut = function (e) {
		console.log("Zoom out function not implemented");
	};
	export let zoomIn = function (e) {
		console.log("Zoom in function not implemented");
	};
</script>

<div class="map-zoom-ui-wrapper">
	<button on:click={zoomIn}>zoom in</button>
	<button on:click={zoomOut}>zoom out</button>
</div>
