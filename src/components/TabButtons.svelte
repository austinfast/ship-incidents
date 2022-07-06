<script>
export let options = []
export let currentValue = options.length > 0 ? options[0].value : null;
</script>

<div class="button-group">
{#each options as option}
	<button on:click={() => currentValue = option.value} class="tab-button" class:active={option.value == currentValue}>{option.label}</button>
{/each}
</div>

<style>
	.tab-button {
		background: none;
		appearance: none;
		background-color: var(--mk-color-grey-light);
		color: var(--mk-color-grey-dark);
		border: solid 1px var(--mk-color-grey);
		padding: 8px 5px;
		transition: background 250ms ease;
		cursor: pointer;
		font-family: var(--mk-font-family-sans);
	}
	.tab-button.active {
		background: #ffffff;
		color: #000000;
		font-weight: var(--mk-font-weight-bold);
	}
	.tab-button:first-child {
		border-radius: 5px 0 0 5px;
	}
	.tab-button:last-child {
		border-radius: 0 5px 5px 0;
	}
</style>
