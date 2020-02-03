import  "./style/fonts.css"
import "./style/index.css"
import "./style/mapbox-gl.css";
import App from "./App.svelte";

// check to see if static web environment
const isStaticWeb = window.location.pathname.indexOf('pages/interactives/') >= 0;

function setNavbarHeight() {
	let navEl = document.querySelector('header.site-header') || document.querySelector('header.header');
  let navHeight = navEl.getBoundingClientRect().height;
	document.documentElement.style.setProperty('--navbar-height', `${navHeight || 0}px`);
}

const app = new App({
	target: document.getElementById("root"),
});

window.addEventListener('DOMContentLoaded', function() {
	if (isStaticWeb) {
		setNavbarHeight();
	}
});

window.app = app;

export default app;
