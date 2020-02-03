<script>
  import { onMount } from "svelte";
  import mapboxgl from "mapbox-gl";
  import * as d3 from "d3";

  // PROPS
  export let incidents;

  let el;
  let width;

  // Configure map
  function renderMap() {
    // Mapbox KEY
    mapboxgl.accessToken = "pk.eyJ1IjoidXNhdG9kYXlncmFwaGljcyIsImEiOiJ0S3BGdndrIn0.5juF5LWz_GRcndian32tZA";
    
    // Set circle radius scale based on data
    let extent = d3.extent(incidents.features.map(feature => feature.properties.victims))
    let minRadius = width < 600 ? 3 : 5;
    let maxRadius = width < 600 ? 15 : 25;
    let circleRadiusScale = d3.scaleSqrt()
      .domain(extent)
      .range([minRadius, maxRadius]);
    
    incidents.features = incidents.features.map(feature => {
      let props = Object.assign({}, feature.properties);
      props.radius = circleRadiusScale(props.victims);
      return Object.assign({}, feature, {properties: props})
    })

    let map = new mapboxgl.Map({
      container: el,
      bounds: [-24.0,-13.2,20.7,12.8],
      style: "mapbox://styles/usatodaygraphics/ck0gz14210qh11cq6w8fqzjvz?fresh=true",
      scrollZoom: false
    });
    var nav = new mapboxgl.NavigationControl({showCompass: false});
    map.addControl(nav, 'top-left');
    
    map.on("load", function() {
      
      map.addLayer({
          "id": "incidents",
          "type": "circle",
          "source": {
            "type": "geojson",
            "data": incidents
          },
          paint: {
            'circle-radius': ['get', 'radius'],
            'circle-opacity': 0.75,
            'circle-color': '#d9501e',
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-width': 1
          }
      }, "us towns small");
    });
  }

  $: if(el && incidents) {
    width = el.offsetWidth;
    renderMap();
  }
</script>
<style>
.incident-map-wrapper {
  height: 67vw;
  max-height: 600px;
}
</style>
<div class="incident-map-wrapper" bind:this={el}></div>