<script>
	import TypeInfo from "./TypeInfo.svelte";
	export let options = [
		{
			label: "Default option",
			value: "default",
		},
	];
	export let currentValue = null;
	export let filterLabel = "Filter";
	export let defaultLabel = "Select";
	export let showTypeInfo = false;
	function labelToId(text) {
		return text
			.toString()
			.toLowerCase()
			.replace(/\s+/g, "-") // Replace spaces with -
			.replace(/[^\w\-]+/g, "") // Remove all non-word chars
			.replace(/\-\-+/g, "-") // Replace multiple - with single -
			.replace(/^-+/, "") // Trim - from start of text
			.replace(/-+$/, ""); // Trim - from end of text
	}
</script>
<div class="filter-wrap">
	<div class="filter-select-wrap">
		<label class="filter-label" for={labelToId(filterLabel)}>{filterLabel}</label>
		<select bind:value={currentValue} class="filter-select" id={labelToId(filterLabel)}>
			<option value={null}>{defaultLabel}</option>
			{#each options as option}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>
	{#if showTypeInfo}
		<TypeInfo />
	{/if}
</div>

<style>
	.filter-select {
		appearance: none;
		border: solid 1px var(--mk-color-grey);
		border-radius: 5px;
		cursor: pointer;
		color: var(--mk-color-grey-dark);
		font-family: var(--mk-font-family-sans, sans-serif);
		padding: 8px 25px 8px 5px;
		display: block;
		min-width: 130px;
		background: var(--mk-color-grey-light);
		/* note: bg image below uses 2 urls. The first is an svg data uri for the arrow icon, and the second is the gradient. 
        for the icon, if you want to change the color, be sure to use `%23` instead of `#`, since it's a url. You can also swap in a different svg icon or an external image reference
		*/
		background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23000000%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
			linear-gradient(to bottom, #ffffff 0%, #ffffff 100%);
		background-repeat: no-repeat, repeat;
		/* arrow icon position (1em from the right, 50% vertical) , then gradient position*/
		background-position: right 0.7em top 50%, 0 0;
		/* icon size, then gradient */
		background-size: 0.65em auto, 100%;
	}
	.filter-label {
		font-size: 0.8em;
	}
	.filter-wrap {
		display: flex;
	}
</style>
