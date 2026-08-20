<script lang="ts">
	import SegmentedControl from '../../components/SegmentedControl.svelte';

	let value = $state('grid');
</script>

<SegmentedControl
	bind:value
	label="View"
	options={[
		{ value: 'grid', label: 'Grid' },
		{ value: 'list', label: 'List' },
		{ value: 'board', label: 'Board' },
		{ value: 'gantt', label: 'Gantt', disabled: true }
	]}
/>
