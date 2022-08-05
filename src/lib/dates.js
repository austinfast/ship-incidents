import { timeFormat } from "d3";

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

export function formatDate(realDate) {
	const formatter = timeFormat("%m/%d/%Y at %I:%M %p");
	return formatter(realDate);
}

export function formatBylineDate(realDate) {
	// example output
	// 8:08 AM EDT Jun. 13, 2022
	const timeFormatter = timeFormat("%_I:%M %p");
	const dateFormatter = timeFormat("%b %e, %Y")
	const timeZoneName = realDate.toLocaleDateString(undefined, { timeZoneName: "short" }).split(", ")[1];
	return `${timeFormatter(realDate).trim()} ${timeZoneName} ${dateFormatter(realDate).replace("  ", " ") }`
}

export function setBylineTimeStamp(realDate) {
	const stringDate = formatBylineDate(realDate);
	try {
		const el = document
					.querySelector(".topper__timestamp")
					.querySelector(".updated")
					.querySelector("time");

		el.innerText = stringDate;
		el.dateTime = realDate.toISOString();
		return true;
	} catch {
		return false;
	}
}
