<script>
  import Header from "./components/Header.svelte";
  import VizModule from "./components/VizModule.svelte";
  import Timeline from "./components/charts/Timeline.svelte";
</script>
<article>
  <Header></Header>
  <section class="main-content-section">
    <VizModule
      subhead="My subhead"
      leadInText="In gravida eros nisi. Quisque in lectus condimentum, lobortis magna quis, rutrum nisi. Etiam a nulla pulvinar, dapibus tortor vel, egestas leo. Aliquam erat volutpat."> 
      <Timeline />
    </VizModule>
  </section>
</article>