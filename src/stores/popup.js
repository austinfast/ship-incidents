import { writable } from "svelte/store";

export const popupDetails = writable({
	incidentId: null,
	customContent: null,
	position: null,
	slot: null,
});
