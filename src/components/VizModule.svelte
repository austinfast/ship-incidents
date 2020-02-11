<script>
  // PROPS
  export let subhead;
  export let leadInText;
  export let backgroundImage;
  export let backgroundColor;
  export let textColor = "dark";
</script>
<style>
  .viz-module-wrapper {
    margin-bottom: 30px;
    padding-top: 20px;
  }
  :global(.light-text h2, .light-text p, .light-text *) {
    color: #FFFFFF;
  }
</style>
<div class="viz-module-wrapper"
  class:light-text={textColor == "light"}
  style={`
    background-color: ${backgroundColor ? backgroundColor : "none"};
    background-image: ${backgroundImage ? backgroundImageURL : "none"};
  `}>
  <div class="viz-module-inner-wrapper article-width">
    {#if subhead}
      <h2 class="viz-module-subhead subhead">{subhead}</h2>
    {/if}
    {#if leadInText}
    <p class="viz-module-leadin-text">{leadInText}</p>
    {/if}
    <slot></slot>
  </div>
</div>