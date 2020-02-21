<script>
  // PROPS
  export let subhead;
  export let leadInText;
  export let theme = "light";
  export let vizSize = "small";
</script>
<style>
  .viz-module-wrapper {
    margin-bottom: 30px;
    padding-top: 20px;
  }

  .viz-module-wrapper.dark {
    background-color: #416986;
    background-image: url("static/img/seamleass_texture_blue.png");
    background-repeat: repeat;
    /* background-size: 100%; */
  }

  .viz-module-wrapper.dark h2, .viz-module-wrapper.dark p, .viz-module-wrapper.dark *{
    color: #FFFFFF;
  }
</style>
<div class="viz-module-wrapper"
  class:light={theme == "light"}
  class:dark={theme == "dark"}
>
  <div class="viz-module-inner-wrapper" class:article-width={vizSize == "wide"} class:article-width-small={vizSize == "small"}>
    <div class="viz-module-text-wrapper article-text-width">
      {#if subhead}
        <h2 class="viz-module-subhead subhead">{subhead}</h2>
      {/if}
      {#if leadInText}
      <p class="viz-module-leadin-text">{leadInText}</p>
      {/if}
    </div>
    <slot></slot>
  </div>
</div>