<script lang="ts">
	import Checkbox from '$lib/components/Checkbox.svelte';

	let checked = $state(true);
</script>

<div class="flex flex-col gap-3">
	<Checkbox bind:checked label="I agree to the terms" description="Standard MSA." />
	<Checkbox indeterminate label="Partially selected" tone="violet" />
	<Checkbox label="Disabled" disabled />
</div>
