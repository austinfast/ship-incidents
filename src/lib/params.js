export function parseParams() {
	if (!window) {
		return null;
	}
	let result = {};
	const params = window.location.search.substring(1).split("&");
	for (const param of params) {
		if (param.trim() != "") {
			const pair = param.split("=");
			result[pair[0]] = pair[1];
		}
	}
	return result;
}


export function getParameterByName(name, url) {
	if (!window) {
		return null;
	}
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return "";
	return results[2].replace(/\+/g, " ");
}
