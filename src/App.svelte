<script>
  import Header from "./components/Header.svelte";
  import VizModule from "./components/VizModule.svelte";
  import Loading from "./components/Loading.svelte";
  import Timeline from "./components/charts/Timeline.svelte";
  import YearlySummary from "./components/charts/YearlySummary.svelte";
  import IncidentMap from "./components/charts/IncidentMap.svelte";
  import DataManager from "./utils/data.js";

  let dataManager = new DataManager();
  let data = null;

  dataManager.getData().then((responseData) => {
    data = responseData;
    console.log(data);
  });

</script>
<article>
  <Header></Header>
  <section class="main-content-section">
    <VizModule
      subhead="My subhead"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
      {#if data}
        <Timeline incidents={data.timeline}/>
      {:else}
        <Loading />
      {/if}
    </VizModule>
    <VizModule
      subhead="Incidents by year"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
      {#if data}
        <YearlySummary 
          yearlyData={data.yearly_summaries}
          yearlyVariable={"incidents"}/>
      {:else}
        <Loading />
      {/if}
    </VizModule>

    <VizModule
      subhead="Victims by year"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
      {#if data}
        <YearlySummary 
          yearlyData={data.yearly_summaries}
          yearlyVariable={"victims"}/>
      {:else}
        <Loading />
      {/if}
    </VizModule>
    
    <VizModule
      subhead="Incidents by location"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
      {#if data}
        <IncidentMap 
          incidents={data.incidents_geo} />
      {:else}
        <Loading />
      {/if}
    </VizModule>
  </section>
</article>