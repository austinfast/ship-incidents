<script>
	export let height = 200;
</script>

<div class="loading-module-wrapper" style="height: {height}px">
	<div class="loading-icon">
		<div class="loading-icon-content">
			<div class="loading-icon-text">Loading</div>
			<div class="loading-icon-content-loader">
				<div class="rect1" />
				<div class="rect2" />
				<div class="rect3" />
				<div class="rect4" />
				<div class="rect5" />
			</div>
		</div>
	</div>
</div>

<style>
	.loading-module-wrapper {
		background: #ffffff;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.loading-icon {
		--accent-color: var(--mk-color-orange);
	}
	.loading-icon-content .loading-icon-text {
		text-align: center;
		font-size: 16px;
		color: var(--accent-color, #404040);
	}
	.loading-icon-content-loader {
		width: 100%;
		z-index: 9999;
		height: 30px;
		text-align: center;
		font-size: 10px;
	}
	.loading-icon-content-loader > div {
		background-color: var(--accent-color, #404040);
		height: 30px;
		width: 6px;
		display: inline-block;
		-webkit-animation: stretchdelay 1.2s infinite ease-in-out;
		animation: stretchdelay 1.2s infinite ease-in-out;
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
		-webkit-animation-delay: -0.9s;
		animation-delay: -0.9s;
	}
	.loading-icon-content-loader .rect5 {
		-webkit-animation-delay: -0.8s;
		animation-delay: -0.8s;
	}
	@-webkit-keyframes stretchdelay {
		0%,
		40%,
		100% {
			-webkit-transform: scaleY(0.4);
		}
		20% {
			-webkit-transform: scaleY(1);
		}
	}
	@keyframes stretchdelay {
		0%,
		40%,
		100% {
			transform: scaleY(0.4);
			-webkit-transform: scaleY(0.4);
		}
		20% {
			transform: scaleY(1);
			-webkit-transform: scaleY(1);
		}
	}
</style>
