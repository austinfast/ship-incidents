<script>
	import CategoryAreaChart from "./charts/CategoryAreaChart.svelte";

	export let incidentData;
	console.log(incidentData);

	const incidentCategories = [
		{
			field: "incidents",
			label: "All mass killings",
		},
		{
			field: "mass_shootings",
			label: "Mass shootings",
		},
		{
			field: "mass_public_shootings",
			label: "Mass public shootings",
		},
	];
	const victimCategories = [
		{
			field: "victims",
			label: "Victims of mass killings",
		},
		{
			field: "mass_shooting_victims",
			label: "Victims of mass shootings",
		},
		{
			field: "mass_public_shooting_victims",
			label: "Victims of mass public shootings",
		},
	];
</script>

<div class="chart-wrap-double-group category-charts">
	<CategoryAreaChart categories={incidentCategories} {incidentData} />
	<CategoryAreaChart categories={victimCategories} {incidentData} />
</div>

<style>
	.category-charts {
		display: flex;
		justify-content: center;
	}
</style>
