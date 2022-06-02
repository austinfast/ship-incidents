<script>
	import { prettyDate, shortDate } from "../lib/text.js";
	export let incidentData;
	export let popupSlot;

	let incidents = [];
	let width = 300;
	let searchFilter = "";
	let currentPage = 0;
	let itemsPerPage = 10;

	// headers in the format of
	// [dataField, prettyLabel, formatFunction]
	let tableHeaders = [
		["real_date", "Date", shortDate],
		["city", "City"],
		["state", "State"],
		["victims", "Victims"],
		["numinjured", "Injured"],
		["location_type", "Location"],
	];

	$: numHeaders =
		width > 768
			? tableHeaders.length
			: width > 400
			? tableHeaders.length - 1
			: tableHeaders.length - 2;

	incidentData.then((d) => {
		incidents = d.incidents;
	});
	$: console.log(incidents);
	$: filteredIncidents = incidents.filter(d => d.casename.toLowerCase().indexOf(searchFilter.toLowerCase()) >= 0);
	$: paginatedIncidents = filteredIncidents.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
	$: if (searchFilter != "") {
		currentPage = 0;
	}
	$: totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);
</script>

<div class="chart-wrapper" bind:clientWidth={width}>
	<div class="incident-lookup-table-page-info">
		<input type="text" bind:value={searchFilter} placeholder="Search">
		Page {currentPage + 1} of {totalPages}
		<button on:click={() => currentPage -= 1}>previous</button>
		<button on:click={() => currentPage += 1}>next</button>
	</div>
	<table class="incident-lookup-table">
		<thead>
			<tr>
				{#each tableHeaders.slice(0, numHeaders) as header}
					<td>{header[1]}</td>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each paginatedIncidents as incident}
				<tr>
					{#each tableHeaders.slice(0, numHeaders) as header}
						<td
							>{header.length > 2
								? header[2](incident[header[0]])
								: incident[header[0]]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	.incident-lookup-table {
		width: 100%;
		font-size: 12px;
	}

	@media (min-width: 768px) {
		.incident-lookup-table {
			font-size: 14px;
		}
	}
</style>
