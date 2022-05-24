export function parseDate(dateStr) {
	// handle null dates
	if (!dateStr) {
		return null;
	}
	let dateParts = dateStr.split("-");
	let date = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2], 12);
	return date;
}
export function yearFromStringDate(stringDate) {
	if (!stringDate) {
		return null;
	}
	return stringDate.split("-")[0];
}
