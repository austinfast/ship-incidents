import { timeFormat } from "d3";

export function prettyNumber(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function prettyDate(d) {
	let f = timeFormat("%B %d, %Y");
	return f(d);
}

export function yearFromStringDate(stringDate) {
	if (!stringDate) {
		return null;
	}
	return stringDate.split("-")[0];
}
