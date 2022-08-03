<script>
	import { formatDate } from "../lib/dates.js";
	export let updated_at;
	function isMainStory() {
		if (window) {
			// check if page is in an embed
			if (window.location !== window.parent.location) {
				return false;
			} else if (window.location.pathname.indexOf("/story/") >= 0 || window.location.pathname.indexOf("/in-depth/") >= 0) {
				return true;
			}
		}
		return false;
	}
	const showFooter = !isMainStory();
</script>
{#if showFooter}
	<div class="chart-footer">
		{#if updated_at}
			<p class="footer-text">Last updated: {formatDate(updated_at)}</p>
		{/if}
		<p class="footer-text">SOURCE The USA TODAY/AP/Northeastern University mass killings database</p>
	</div>
{/if}
<style>
.chart-footer {
	margin: 0;
	padding-bottom: 1em;
}
.chart-footer p.footer-text {
	font-family: var(--mk-font-family-sans);
	font-size: var(--mk-font-size-small);
	color: var(--mk-color-grey-dark);
	margin: 0;
	line-height: var(--mk-line-height-small);
}
</style>
