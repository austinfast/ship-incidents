<script>
  import Header from "./components/Header.svelte";
  import VizModule from "./components/VizModule.svelte";
  import Loading from "./components/Loading.svelte";
  import Timeline from "./components/charts/Timeline.svelte";
  import YearlySummary from "./components/charts/YearlySummary.svelte";
  import IncidentMap from "./components/charts/IncidentMap.svelte";
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
  <p>Praesent tortor sapien, pharetra a odio ut, scelerisque varius libero. Aliquam elementum ipsum et odio cursus aliquet. Vestibulum sed ipsum eu est viverra blandit non vitae leo. Sed iaculis nulla sed imperdiet cursus. Aliquam nec volutpat turpis. Cras nibh magna, posuere et sapien a, ultrices pellentesque nisi. Pellentesque a porttitor arcu. Phasellus finibus egestas elit, vel condimentum quam tempor vel. Mauris dictum lorem pharetra cursus feugiat. Cras quis est vel nulla egestas fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus lobortis mauris, a condimentum enim ultrices sed. Vestibulum at tristique tellus. Fusce fringilla convallis leo non faucibus.</p>
  <p>Praesent tortor sapien, pharetra a odio ut, scelerisque varius libero. Aliquam elementum ipsum et odio cursus aliquet. Vestibulum sed ipsum eu est viverra blandit non vitae leo. Sed iaculis nulla sed imperdiet cursus. Aliquam nec volutpat turpis. Cras nibh magna, posuere et sapien a, ultrices pellentesque nisi. Pellentesque a porttitor arcu. Phasellus finibus egestas elit, vel condimentum quam tempor vel. Mauris dictum lorem pharetra cursus feugiat. Cras quis est vel nulla egestas fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus lobortis mauris, a condimentum enim ultrices sed. Vestibulum at tristique tellus. Fusce fringilla convallis leo non faucibus.</p>
  <p>Praesent tortor sapien, pharetra a odio ut, scelerisque varius libero. Aliquam elementum ipsum et odio cursus aliquet. Vestibulum sed ipsum eu est viverra blandit non vitae leo. Sed iaculis nulla sed imperdiet cursus. Aliquam nec volutpat turpis. Cras nibh magna, posuere et sapien a, ultrices pellentesque nisi. Pellentesque a porttitor arcu. Phasellus finibus egestas elit, vel condimentum quam tempor vel. Mauris dictum lorem pharetra cursus feugiat. Cras quis est vel nulla egestas fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus lobortis mauris, a condimentum enim ultrices sed. Vestibulum at tristique tellus. Fusce fringilla convallis leo non faucibus.</p>
  <p>Praesent tortor sapien, pharetra a odio ut, scelerisque varius libero. Aliquam elementum ipsum et odio cursus aliquet. Vestibulum sed ipsum eu est viverra blandit non vitae leo. Sed iaculis nulla sed imperdiet cursus. Aliquam nec volutpat turpis. Cras nibh magna, posuere et sapien a, ultrices pellentesque nisi. Pellentesque a porttitor arcu. Phasellus finibus egestas elit, vel condimentum quam tempor vel. Mauris dictum lorem pharetra cursus feugiat. Cras quis est vel nulla egestas fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus lobortis mauris, a condimentum enim ultrices sed. Vestibulum at tristique tellus. Fusce fringilla convallis leo non faucibus.</p>
  <p>Praesent tortor sapien, pharetra a odio ut, scelerisque varius libero. Aliquam elementum ipsum et odio cursus aliquet. Vestibulum sed ipsum eu est viverra blandit non vitae leo. Sed iaculis nulla sed imperdiet cursus. Aliquam nec volutpat turpis. Cras nibh magna, posuere et sapien a, ultrices pellentesque nisi. Pellentesque a porttitor arcu. Phasellus finibus egestas elit, vel condimentum quam tempor vel. Mauris dictum lorem pharetra cursus feugiat. Cras quis est vel nulla egestas fermentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer maximus lobortis mauris, a condimentum enim ultrices sed. Vestibulum at tristique tellus. Fusce fringilla convallis leo non faucibus.</p>
  {#if data}
    <Header 
      incidents={prettyNumber(data.incidents.length)} 
      victims={prettyNumber(data.victims.length)} 
      offenders={prettyNumber(data.offenders.length)}></Header>
  {:else}
    <Loading />
  {/if}
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