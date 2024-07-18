//import  "./fonts.css" // eslint-disable-line
//import styles from "./index.css" // eslint-disable-line
import Timeline from "./components/charts/Timeline.svelte";
import { getIncidentData } from "./lib/data/incidents.js";
//import 'whatwg-fetch';
//import { urlFor, getTimeStamp, smartResizeListener, numberWithCommas } from "./utils.js";
//import * as topojson from "topojson-client";

/*
function main(data) {

  const map = new Map({
    target: document.getElementById("root"),
    props: {
      data,
    }
  });

  if (window.IframeResizer) {
    var watch_resize = function() {
        var my_el = document.getElementById('root'),
            my_resizer = new window.IframeResizer(my_el, 3000);
        my_resizer.watch();
    };
    watch_resize();
  };
}


window.addEventListener("DOMContentLoaded", function() {
  main();
      });
*/
function main(data) {
  // Instantiate the Timeline Svelte component
  const timeline = new Timeline({
    target: document.getElementById("root"),
    props: {
      data: data || []
    }
  });

  // Handle iframe resizer if available
  if (window.IframeResizer) {
    const watch_resize = function() {
      const my_el = document.getElementById('root');
      const my_resizer = new window.IframeResizer(my_el, 3000);
      my_resizer.watch();
    };
    watch_resize();
  }
}

window.addEventListener("DOMContentLoaded", function() {
  main();
});

