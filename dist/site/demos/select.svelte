<script lang="ts">
	import Select from '../../components/Select.svelte';

	let value = $state('studio');
</script>

<Select
	bind:value
	class="max-w-xs"
	options={[
		{ value: 'studio', label: 'Studio' },
		{ value: 'agency', label: 'Agency' },
		{ value: 'custom', label: 'Custom', disabled: true }
	]}
/>
