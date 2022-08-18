<script>
	let showDetail = false;
	function toggleInfo() {
		showDetail = !showDetail;
	}
</script>

<div class="type-info-wrapper">
	<button
		class="type-info-button"
		aria-label="Show definitions of incident types"
		on:click={toggleInfo}>?</button>
	<div class="type-info-details-wrapper" class:hide={!showDetail} >
		<button
			class="detail-close"
			aria-label="close tooltip"
			on:click={toggleInfo}>✖</button>
		<p class="type-info-term">Family</p>
		<p class="type-info-definition">
			Committed by a family member or a current or former intimate partner.
		</p>
		<p class="type-info-term">Felony</p>
		<p class="type-info-definition">
			Associated with other criminal activity (robbery, drug trafficking, or gang
			conflict, etc.)
		</p>
		<p class="type-info-term">Suspected felony</p>
		<p class="type-info-definition">
			Suspected to be associated with other criminal activity (robbery, drug
			trafficking, or gang conflict, etc.) but connection is not confirmed.
		</p>
		<p class="type-info-term">Public</p>
		<p class="type-info-definition">
			Committed in a public setting (school, restaurant, retail store, or house of
			worship, etc.) and not connected to other criminal activity (robbery, drug
			trafficking, or gang conflict, etc.)
		</p>
		<p class="type-info-term">Other</p>
		<p class="type-info-definition">
			Unusual circumstances that do not constitute a family, felony, or public
			incident.
		</p>
		<p class="type-info-term">Undetermined</p>
		<p class="type-info-definition">
			Type cannot as yet be determined based on available facts.
		</p>
		<p class="type-info-term">Unsolved</p>
		<p class="type-info-definition">
			Currently unsolved and no indication as to type of incident.
		</p>
	</div>
</div>

<style>
	.type-info-wrapper {
		align-self: flex-end;
		padding-left: 10px;
		padding-bottom: 3px;
		position: relative;
		z-index: 500;
	}
	.type-info-button {
		background: var(--mk-color-grey);
		border: none;
		border-radius: 50%;
		color: #ffffff;
		cursor: pointer;
		width: 30px;
		height: 30px;
		font-weight: 900;
	}
	.type-info-details-wrapper {
		border: solid 1px var(--mk-color-grey);
		box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.05);
		position: absolute;
		background: #ffffff;
		padding: 10px;
		top: -3px;
		right: 35px;
		width: 375px;
		max-width: 80vw;
		overflow-y: auto;
	}
	.type-info-details-wrapper.hide {
		display: none;
	}
	.type-info-details-wrapper p {
		font-size: var(--mk-font-size-small);
		font-family: var(--mk-font-family-sans);
		line-height: var(--mk-line-height-small);
		margin: 0;
	}
	p.type-info-term {
		font-weight: 700;
		margin-top: 10px;
	}
	.detail-close {
		background: none;
		border: none;
		cursor: pointer;
		position: absolute;
		top: 10px;
		right: 10px;
		color: var(--mk-color-grey-dark);
	}
	@media(max-width: 620px) {
		.type-info-details-wrapper {
			left: 50%;
			transform: translate(-50%, 0);
		}

	}
</style>
