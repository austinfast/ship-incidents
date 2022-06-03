<script>
	import { prettyDate, shortDate } from "../lib/text.js";
	import colors from "../lib/colors.js";
	export let incidentData;
	export let popupSlot;

	let incidents = [];
	let width = 300;
	let searchFilter = "";
	let currentPage = 0;
	let itemsPerPage = 10;
	let sortColumn = "real_date";
	let sortAscending = false;
	let showSearchClearButton = false;

	// headers in the format of
	// [dataField, prettyLabel, showMobile?, formatFunction]
	let tableHeaders = [
		["real_date", "Date", true, shortDate],
		["city", "City", true],
		["state", "State", true],
		["victims", "Victims", true],
		["numinjured", "Injured"],
		["type", "Type", false],
		["location_type", "Location", false],
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
	$: console.log(filteredIncidents);
	$: console.log(showSearchClearButton);

	function handleHeaderClick(header) {
		// if header is already selected as sort column, reverse order
		if (header[0] == sortColumn) {
			sortAscending = !sortAscending;
		} else {
			sortAscending = false;
			sortColumn = header[0];
		}
	}
	function onSearchFocus() {
		showSearchClearButton = false;
	}
	function onSearchBlur() {
		if (searchFilter != "") {
			showSearchClearButton = true;
		}
	}
</script>

<div class="table-wrapper" bind:clientWidth={width}>
	<div class="incident-lookup-table-page-info">
	<div class="search-wrap">
		<span class="search-icon-wrap"><svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg" class="search-icon">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.90083 13.403C10.8098 13.403 13.1681 11.0027 13.1681 8.04182C13.1681 5.0809 10.8098 2.68061 7.90083 2.68061C4.99183 2.68061 2.63361 5.0809 2.63361 8.04182C2.63361 11.0027 4.99183 13.403 7.90083 13.403ZM7.90083 16.0836C12.2643 16.0836 15.8017 12.4832 15.8017 8.04182C15.8017 3.60044 12.2643 0 7.90083 0C3.53732 0 0 3.60044 0 8.04182C0 12.4832 3.53732 16.0836 7.90083 16.0836Z" fill={colors["grey"]}/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.6336 11.5889L22 20.1045L20.1378 22L11.7714 13.4843L13.6336 11.5889Z" fill={colors["grey"]}/>
  </svg></span>
		<input type="text" bind:value={searchFilter} placeholder="Search by date or location" class="incident-table-search-input" on:focus={onSearchFocus} on:blur={onSearchBlur}/>
		<span class="search-clear-button" class:show={showSearchClearButton}>x</span>
	</div>
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
						class:show-mobile={header[2]}
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
						class={header[0]}
						class:show-mobile={header[2]}
							>{header.length > 3
								? header[3](incident[header[0]])
								: incident[header[0]]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
		Page {currentPage + 1} of {totalPages}
		<button on:click={() => (currentPage -= 1)}>previous</button>
		<button on:click={() => (currentPage += 1)}>next</button>
</div>

<style>
	.table-wrapper {
		max-width: 1200px;
		margin: 0 auto;
	}
	.incident-lookup-table {
		width: 100%;
		font-size: 12px;
		border-collapse: collapse;
		text-align: right;
	}
	.incident-lookup-table th {
		/* text-align: left; */
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
	.incident-lookup-table thead th {
		border-bottom: solid 1px var(--mk-color-grey-dark);
		padding: 12px 15px 7px 0;
		font-size: 0.8em;
		text-transform: uppercase;
	}
	.incident-lookup-table tbody td {
		border-bottom: solid 1px var(--mk-color-grey-light);
		padding: 12px 15px 7px 0;
	}
	.incident-lookup-table tbody tr:hover {
		cursor: pointer;
		transition: background-color 250ms ease;
	}
	.incident-lookup-table tbody tr:hover {
		background-color: var(--mk-color-grey-light);
	}
	/* column fixed widths to avoid jumping when paging or searching */
	.incident-lookup-table tbody td.real_date {
		width: 112px;
	}
	.incident-lookup-table tbody td.city {
		width: 157px;
	}
	.incident-lookup-table tbody td.type {
		width: 150px;
	}
	.incident-lookup-table tbody td, .incident-lookup-table thead th {
		display: none;
	}
	.incident-lookup-table tbody td.show-mobile, .incident-lookup-table thead th.show-mobile {
		display: table-cell;
	}
	.search-wrap {
		position: relative;
		display: inline-block;
	}
	.incident-table-search-input {
		border: solid 1px var(--mk-color-grey-light);
		padding: 8px 5px 8px 30px;
		min-width: 160px;
		border-radius: 5px;
	}
	.search-icon {
		width: 20px;
		position: absolute;
		top: 5px;
		left: 5px;
	}
	.search-clear-button {
		display: none;
		/* position: absolute; */
		right: 2px;
		top: 2px;
	}
	.search-clear-button.show {
		/* display: block; */
	}

	@media (min-width: 420px) {
		.incident-lookup-table tbody td, .incident-lookup-table thead th {
			display: table-cell;
		}
	}
	@media (min-width: 768px) {
		.incident-lookup-table {
			font-size: 14px;
		}
	}
	@media (min-width: 1256px) {
		.incident-lookup-table {
			font-size: 16px;
		}
	}
</style>
