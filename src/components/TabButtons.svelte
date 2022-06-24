<script>
export let options = []
export let currentValue = options.length > 0 ? options[0].value : null;
</script>
<div class="button-group">
{#each options as option}
	<button on:click={() => currentValue = option.value}>{option.label}</button>
{/each}
</div>
