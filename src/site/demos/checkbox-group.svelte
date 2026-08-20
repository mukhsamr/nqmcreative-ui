<script lang="ts">
	import CheckboxGroup from '$lib/components/CheckboxGroup.svelte';

	let value = $state(['wifi']);
</script>

<CheckboxGroup
	legend="Included"
	bind:value
	max={3}
	hint="Pick up to three."
	orientation="horizontal"
	boxed
	tone="accent"
	options={[
		{ value: 'wifi', label: 'Fibre wifi' },
		{ value: 'coffee', label: 'Barista coffee' },
		{ value: 'studio', label: 'Photo studio' },
		{ value: 'parking', label: 'Parking' }
	]}
/>
