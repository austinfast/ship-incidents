<script>
	import Header from "./components/Header.svelte";
	import VizModule from "./components/VizModule.svelte";
	import Popup from "./components/Popup.svelte";
	import Loading from "./components/Loading.svelte";
	import Timeline from "./components/charts/Timeline.svelte";
	import YearlySummary from "./components/charts/YearlySummary.svelte";
	import TrendLine from "./components/charts/TrendLine.svelte";
	import TrendArea from "./components/charts/TrendArea.svelte";
	import IncidentMap from "./components/charts/IncidentMap.svelte";
	import IncidentTypeWaffleChart from "./components/charts/IncidentTypeWaffleChart.svelte";
	import RankedBar from "./components/charts/RankedBar.svelte";
	import GunType from "./components/charts/GunType.svelte";
	import RelationshipBars from "./components/charts/RelationshipBars.svelte";
	import AgeHistogram from "./components/charts/AgeHistogram.svelte";
	import StackedBar from "./components/charts/StackedBar.svelte";
	import DataManager from "./utils/data.js";
	import { popupDetails } from "./stores/popup.js";
	import { prettyNumber } from "./utils/text.js";

	let dataManager = new DataManager();
	let data = null;

	dataManager.getData().then((responseData) => {
		data = responseData;
		console.log(data);
	});
</script>

<style>
	article {
		overflow: auto;
	}

	:global(.article-width) {
		max-width: 900px;
		margin: 0 auto;
		padding: 0 20px;
	}

	:global(.article-width-small) {
		max-width: 600px;
		margin: 0 auto;
		padding: 0 20px;
	}

	:global(.article-text-width) {
		max-width: 600px;
		margin: 0 auto;
	}
</style>

<article>
	{#if data}
		<Header
			incidents={prettyNumber(data.incidents.length)}
			victims={prettyNumber(data.victims.length)}
			offenders={prettyNumber(data.offenders.length)}
		/>

		<section class="main-content-section">
			<!-- incident timeline -->
			<VizModule
				subhead="Timeline of mass killing incidents"
				leadInText="Center of arc represents data of incident, radius represents the number of victims killed."
				vizSize="wide"
			>
				<Timeline incidents={data.timeline} />
			</VizModule>
			<!-- incident location map -->
			<VizModule
				subhead="Incidents by location"
				leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."
				vizSize="wide"
			>
				<IncidentMap incidents={data.incidents_geo} />
			</VizModule>
			<!-- trends in mass killings -->
			<VizModule
				subhead="Trends in mass killing incidents"
				leadInText="Explain the significance of mass shootings and mass public shootings as indicators."
			>
				<TrendArea
					yearlyData={data.yearly_summaries}
					yearlyVariables={[
						["incidents", "#D9501E", "Mass killings"],
						["mass_shootings", "#A61103", "Mass shootings"],
						["mass_public_shootings", "#590902", "Mass public shootings"],
					]}
				/>
			</VizModule>

			<!-- trends in mass killings victims -->
			<VizModule subhead="Trends in mass killing victims">
				<TrendArea
					yearlyData={data.yearly_summaries}
					yearlyVariables={[
						["victims", "#D9501E", "Mass killing victims"],
						["mass_shooting_victims", "#A61103", "Mass shooting victims"],
						["mass_public_shooting_victims", "#590902", "Mass public shooting victims"],
					]}
				/>
			</VizModule>

			<VizModule subhead="Trends in mass killing incidents by type" leadInText="trends by type">
				<TrendLine
					yearlyData={data.yearly_summaries}
					yearlyVariables={[
						["incidents_family", "#D9501E", "Family"],
						["incidents_public", "#A61103", "Public"],
						["incidents_felony", "#590902", "Felony"],
						["incidents_other", "#8C8C8C", "Other/unkown"],
					]}
				/>
			</VizModule>

			<!-- incident type breakdown -->
			<VizModule
				subhead="Incidents by type"
				leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."
			>
				<IncidentTypeWaffleChart incidents={data.incidents} />
			</VizModule>

			<!-- location type breakdown -->
			<VizModule
				subhead="Location types"
				leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."
			>
				<RankedBar items={data.location_type_counts} />
			</VizModule>

			<!-- weapon type breakdown -->
			<VizModule subhead="Weapons used" leadInText="Which types of weapons were used in the most incidents." theme="dark">
				<!-- <GunType gunTypes={data.gun_type_counts} /> -->
			</VizModule>

			<!-- relationships -->
			<VizModule subhead="Relationships" leadInText="Information about relationships between victims and their killers.">
				<RelationshipBars counts={data.victim_relationship_counts} />
			</VizModule>

			<!-- victim ages -->
			<VizModule subhead="Victims by age" leadInText="Age distribution">
				<AgeHistogram binned_data={data.victim_binned_ages} age_scale={data.victim_age_scale} color="#d9501e" />
			</VizModule>

			<!-- victim sex -->
			<VizModule subhead="Victims by sex" leadInText="" vizSize="wide">
				<StackedBar counts={data.victim_gender_counts} colors={["#d9501e", "#f08c67"]} />
			</VizModule>

			<!-- offender ages -->
			<VizModule subhead="Offenders by age" leadInText="Age distribution">
				<AgeHistogram binned_data={data.offender_binned_ages} age_scale={data.offender_age_scale} color="#416986" />
			</VizModule>

			<!-- offender gender -->
			<VizModule subhead="Offenders by sex" leadInText="Offenders were most likely to be male." vizSize="wide">
				<StackedBar counts={data.offender_gender_counts} colors={["#416986", "#90a4b3", "#8c8c8c"]} />
			</VizModule>
		</section>
		{#if ($popupDetails.incidentId || $popupDetails.customContent) && $popupDetails.position}
			<Popup details={$popupDetails} incidentLookup={data.incidentLookup} />
		{/if}
	{:else}
		<Loading />
	{/if}
</article>
