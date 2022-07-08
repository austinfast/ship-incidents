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
}
