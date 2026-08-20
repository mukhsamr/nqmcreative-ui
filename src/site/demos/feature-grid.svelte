<script lang="ts">
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import FeatureGrid from '$lib/components/FeatureGrid.svelte';
</script>

<div class="w-full border border-hairline">
	<FeatureGrid
		eyebrow="How it works"
		title="Three things, done properly."
		columns={3}
		bordered
		class="py-14"
	>
		<FeatureCard title="Strategy" description="Positioning and message before a single pixel." />
		<FeatureCard
			title="Identity"
			description="Marks, type and colour that survive contact with reality."
			tone="accent"
		/>
		<FeatureCard
			title="Product"
			description="Interfaces built with the same system you are reading."
			tone="violet"
		/>
	</FeatureGrid>
</div>
