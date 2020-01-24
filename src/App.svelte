<script>
  import Header from "./components/Header.svelte";
  import VizModule from "./components/VizModule.svelte";
  import Loading from "./components/Loading.svelte";
  import Timeline from "./components/charts/Timeline.svelte";
  import YearlySummary from "./components/charts/YearlySummary.svelte";
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
    <VizModule
      subhead="My subhead"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
        <Timeline incidents={data.timeline}/>
    </VizModule>
    <VizModule
      subhead="Incidents by year"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
        <YearlySummary 
          yearlyData={data.yearly_summaries}
          yearlyVariable={"incidents"}/>
    </VizModule>

    <VizModule
      subhead="Victims by year"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
        <YearlySummary 
          yearlyData={data.yearly_summaries}
          yearlyVariable={"victims"}/>
    </VizModule>
    
    <VizModule
      subhead="Incidents by location"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
        <IncidentMap 
          incidents={data.incidents_geo} />
    </VizModule>

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