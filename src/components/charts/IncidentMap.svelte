<script>
  import mapboxgl from "mapbox-gl";
  import * as d3 from "d3";
  export let incidents;
  let el;

  let extent = d3.extent(incidents.features.map(feature => feature.properties.victims))

  mapboxgl.accessToken = "pk.eyJ1IjoidXNhdG9kYXlncmFwaGljcyIsImEiOiJ0S3BGdndrIn0.5juF5LWz_GRcndian32tZA";
    
  const minRadius = 5;
  const maxRadius = 25;
  const circleRadiusScale = d3.scaleSqrt()
    .domain(extent)
    .range([minRadius, maxRadius]);
  
  incidents.features = incidents.features.map(feature => {
    console.log(feature);
    let props = Object.assign({}, feature.properties);
    props.radius = circleRadiusScale(props.victims);
    return Object.assign({}, feature, {properties: props})
  })

  // Configure map
  function renderMap() {

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
            'circle-color': '#A61103',
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-width': 1
          }
      }, "us towns small");
    });
  }

  $: if(el && incidents) {
    console.log(incidents);
    renderMap();
  }
</script>
<div class="incident-map-wrapper" bind:this={el}></div>