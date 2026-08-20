<script lang="ts">
	import RadioGroup from '$lib/components/RadioGroup.svelte';

	let value = $state('studio');
</script>

<RadioGroup
	legend="Plan"
	bind:value
	boxed
	options={[
		{ value: 'studio', label: 'Studio', description: 'For one designer.' },
		{ value: 'agency', label: 'Agency', description: 'Up to ten seats.' }
	]}
/>
