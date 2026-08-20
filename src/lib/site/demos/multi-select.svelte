<script lang="ts">
	import MultiSelect from '$lib/components/MultiSelect.svelte';

	let value = $state(['brand', 'motion']);
</script>

<div class="w-full max-w-sm">
	<MultiSelect
		bind:value
		max={4}
		tone="violet"
		options={[
			{ value: 'brand', label: 'Brand identity', group: 'Design' },
			{ value: 'ui', label: 'Product UI', group: 'Design' },
			{ value: 'motion', label: 'Motion', group: 'Design' },
			{ value: 'copy', label: 'Copywriting', group: 'Content' },
			{ value: 'dev', label: 'Front-end build', group: 'Build' }
		]}
	/>
</div>
