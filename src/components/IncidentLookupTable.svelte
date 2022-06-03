<script>
	import { prettyDate, shortDate } from "../lib/text.js";
	export let incidentData;
	export let popupSlot;

	let incidents = [];
	let width = 300;
	let searchFilter = "";
	let currentPage = 0;
	let itemsPerPage = 10;
	let sortColumn = "real_date";
	let sortAscending = false;

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
	// $: sortRows = (a, b) => b[sortColumn] - a[sortColumn];
	$: sortRows = (a, b) => {
		if (sortAscending) {
			return a[sortColumn] > b[sortColumn] ? 1 : a[sortColumn] < b[sortColumn] ? -1 : 0;
		} else {
			return a[sortColumn] > b[sortColumn] ? -1 : a[sortColumn] < b[sortColumn] ? 1 : 0;
		}
	};
	$: filteredIncidents = incidents
		.filter((d) => d.casename.toLowerCase().indexOf(searchFilter.toLowerCase()) >= 0)
		.sort(sortRows);
	$: paginatedIncidents = filteredIncidents.slice(
		currentPage * itemsPerPage,
		(currentPage + 1) * itemsPerPage
	);
	$: if (searchFilter != "") {
		currentPage = 0;
	}
	$: totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

	function handleHeaderClick(header) {
		// if header is already selected as sort column, reverse order
		if (header[0] == sortColumn) {
			sortAscending = !sortAscending;
		} else {
			sortAscending = false;
			sortColumn = header[0];
		}
	}
</script>

<div class="chart-wrapper" bind:clientWidth={width}>
	<div class="incident-lookup-table-page-info">
		<input type="text" bind:value={searchFilter} placeholder="Search" />
		Page {currentPage + 1} of {totalPages}
		<button on:click={() => (currentPage -= 1)}>previous</button>
		<button on:click={() => (currentPage += 1)}>next</button>
	</div>
	<table class="incident-lookup-table">
		<thead>
			<tr>
				{#each tableHeaders.slice(0, numHeaders) as header}
					<th
						on:click={(_) => handleHeaderClick(header)}
						class:sort-column={sortColumn == header[0]}
						class:asc={sortAscending}
						class:desc={!sortAscending}
						><span>{header[1]}</span>
					</th>
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
	.incident-lookup-table th {
		text-align: left;
		user-select: none;
		cursor: pointer;
	}
	.incident-lookup-table th span {
		position: relative;
	}
	.incident-lookup-table th.sort-column.desc span::after {
		content: "";
		display: inline-block;
		width: 0;
		height: 0;
		border: 5px solid transparent;
		border-top-color: transparent;
		border-top-color: var(--mk-color-grey-dark);
		position: absolute;
		top: 5px;
		right: -12px;
	}
	.incident-lookup-table th.sort-column.asc span::after {
		content: "";
		display: inline-block;
		width: 0;
		height: 0;
		border: 5px solid transparent;
		border-bottom-color: transparent;
		border-bottom-color: var(--mk-color-grey-dark);
		position: absolute;
		top: 0px;
		right: -12px;
	}
	@media (min-width: 768px) {
		.incident-lookup-table {
			font-size: 14px;
		}
	}
</style>
