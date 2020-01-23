<script>
  export let victims;
  export let incidents;
  export let offenders;
</script>

<style>
  .section-header {
    margin-bottom: 2rem;
  }
  h1.page-headline {
    margin-top: 2rem;
    font-size: 24px;
    line-height: 28px;
    font-weight: 900;
    font-weight: 400;
    text-transform: uppercase;
  }

  h1.page-headline .condensed {
    font-family: "Unify Sans Condensed";
    font-weight: 900;
  }

  h1.page-headline .victim-number {
    font-size: 3em;
  }

  h1.page-headline .incident-number, h1.page-headline .offender-number {
    font-size: 2em;
  }
</style>
<section class="section-header">
  <header>
    <h1 class="page-headline">
      <span class="victim-number condensed">{victims}</span><br /> people killed in <br /><span class="incident-number condensed">{incidents}</span> mass killings by <br /><span class="offender-number condensed">{offenders}</span> offenders since 2006.
    </h1>
    <p class="header-text">Last Updated: </p>
  </header>
</section>