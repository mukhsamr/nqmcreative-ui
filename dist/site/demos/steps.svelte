<script lang="ts">
	import Steps from '../../components/Steps.svelte';

	let current = $state(1);
</script>

<div class="flex w-full flex-col gap-8">
	<Steps
		bind:current
		clickable
		items={[
			{ label: 'Sign the SOW', description: 'Countersigned' },
			{ label: 'Kick-off call', description: 'Scheduled' },
			{ label: 'Brand audit' },
			{ label: 'First sprint' }
		]}
	/>
</div>
