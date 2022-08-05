export const filterUnique = (v, i, a) => a.indexOf(v) === i;

export const isEmbed = () => {
	if (!window) {
		return false;
	}
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
};
export function isMainStory() {
	if (window) {
		// check if page is in an embed
		if (isEmbed()) {
			return false;
		} else if (
			window.location.pathname.indexOf("/story/") >= 0 ||
			window.location.pathname.indexOf("/in-depth/") >= 0
		) {
			return true;
		}
	}
	return false;
}
