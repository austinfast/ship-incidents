import { timeFormat } from "d3";

export function prettyNumber(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function prettyDate(d) {
	let f = timeFormat("%B %d, %Y");
	return f(d);
}

export function shortDate(d) {
	let f = timeFormat("%_m/%_d/%Y");
	return f(d).replace(/\s/g, "");
}
