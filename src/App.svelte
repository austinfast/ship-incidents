<script>
  import Header from "./components/Header.svelte";
  import VizModule from "./components/VizModule.svelte";
  import Loading from "./components/Loading.svelte";
  import Timeline from "./components/charts/Timeline.svelte";
  import YearlySummary from "./components/charts/YearlySummary.svelte";
  import TrendLine from "./components/charts/TrendLine.svelte";
  import IncidentMap from "./components/charts/IncidentMap.svelte";
  import IncidentTypeWaffleChart from "./components/charts/IncidentTypeWaffleChart.svelte";
  import DataManager from "./utils/data.js";
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
    max-width: 900px;
    margin: 0 auto;
    padding: 0 20px;
  }

</style>
<article>
  {#if data}
  <Header 
    incidents={prettyNumber(data.incidents.length)} 
    victims={prettyNumber(data.victims.length)} 
    offenders={prettyNumber(data.offenders.length)}></Header>

  <section class="main-content-section">
    <!-- incident timeline -->
    <VizModule
      subhead="Timeline of mass killing incidents"
      leadInText="Center of arc represents data of incident, radius represents the number of victims killed."> 
        <Timeline incidents={data.timeline}/>
    </VizModule>
    <!-- incident location map -->
    <VizModule
      subhead="Incidents by location"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
        <IncidentMap 
          incidents={data.incidents_geo} />
    </VizModule>
    <!-- trends in mass killings -->
    <VizModule
      subhead="Trends in mass killing incidents"
      leadInText="Explain the significance of mass shootings and mass public shootings as indicators."
    >
        <TrendLine 
          yearlyData={data.yearly_summaries}
          yearlyVariables={[
            ["incidents", "#D9501E", "Mass killings"], 
            ["mass_shootings", "#A61103", "Mass shootings"], 
            ["mass_public_shootings", "#590902", "Mass public shootings"]]}/>
    </VizModule>

     <VizModule
      subhead="Trends in mass killing incidents by type"
      leadInText="trends by type"
    >
        <TrendLine 
          yearlyData={data.yearly_summaries}
          yearlyVariables={[
            ["incidents_family", "#D9501E", "Family"], 
            ["incidents_public", "#A61103", "Public"], 
            ["incidents_felony", "#590902", "Felony"], 
            ["incidents_other", "#8C8C8C", "Other/unkown"]]}/>
    </VizModule>

    <!-- incident type breakdown -->
    <VizModule
      subhead="Incidents by type"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
        <IncidentTypeWaffleChart 
          incidents={data.incidents} />
    </VizModule>
  </section>
  {:else}
    <Loading />
  {/if}
</article>