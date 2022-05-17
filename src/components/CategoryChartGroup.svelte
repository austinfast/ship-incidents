<script>
	import CategoryAreaChart from "./charts/CategoryAreaChart.svelte";
	export let dataManager;
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

<style>
	@media (min-width: 768px) {
		.chart-wrap-double-group {
			display: flex;
			justify-content: space-around;
			max-width: 1200px;
		}
	}
</style>

<div class="chart-wrap-double-group">
	<CategoryAreaChart {dataManager} categories={incidentCategories} />
	<CategoryAreaChart {dataManager} categories={victimCategories} />
</div>
