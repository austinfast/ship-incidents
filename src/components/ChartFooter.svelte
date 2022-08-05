<script>
	import { formatDate } from "../lib/dates.js";
	import { isMainStory } from "../lib/utils.js";
	export let updated_at;
	const showFooter = !isMainStory();
</script>
{#if showFooter}
	<div class="chart-footer">
		{#if updated_at}
			<p class="footer-text">Last updated: {formatDate(updated_at)}</p>
		{/if}
		<p class="footer-text">SOURCE The USA TODAY/AP/Northeastern University mass killing database</p>
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
