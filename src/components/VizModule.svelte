<script>
  // PROPS
  export let subhead;
  export let leadInText;
</script>
<style>
  .viz-module-w {
    margin-bottom: 50px;
  }
</style>
<div class="viz-module-w">
  {#if subhead}
    <h2 class="viz-module-subhead subhead">{subhead}</h2>
  {/if}
  {#if leadInText}
  <p class="viz-module-leadin-text">{leadInText}</p>
  {/if}
  <slot></slot>
</div>