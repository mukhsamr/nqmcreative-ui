<script lang="ts">
	import StatsBand from '$lib/styles/matte/StatsBand.svelte';
</script>

<div class="w-full border border-hairline">
	<StatsBand
		title="Where the work went."
		class="py-10"
		stats={[
			{ label: 'Projects shipped', value: '48', delta: '12', trend: 'up', tone: 'brand' },
			{ label: 'Average sprint', value: '9 days', hint: 'Kick-off to review' },
			{ label: 'Retained clients', value: '82%', delta: '4%', trend: 'up', tone: 'success' }
		]}
	/>
</div>
