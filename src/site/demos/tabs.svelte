<script lang="ts">
	import Tabs from '$lib/styles/matte/Tabs.svelte';

	let value = $state('overview');
</script>

<div class="flex w-full flex-col gap-6">
	<Tabs
		bind:value
		items={[
			{ value: 'overview', label: 'Overview' },
			{ value: 'assets', label: 'Assets', badge: 24 },
			{ value: 'billing', label: 'Billing' },
			{ value: 'archive', label: 'Archive', disabled: true }
		]}
	/>
	<div class="flex flex-wrap gap-6">
		<Tabs
			variant="pill"
			tone="accent"
			items={[
				{ value: 'a', label: 'Pill' },
				{ value: 'b', label: 'Variant' }
			]}
		/>
		<Tabs
			variant="segmented"
			tone="violet"
			items={[
				{ value: 'a', label: 'Segmented' },
				{ value: 'b', label: 'Variant' }
			]}
		/>
	</div>
</div>
