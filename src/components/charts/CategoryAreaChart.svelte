<script>
export let dataManager;
let categories;
dataManager.getData()
	.then(d => {
		categories = d.incidentsByMetaCategory;
	});
</script>
<h2>Category area chart</h2>
