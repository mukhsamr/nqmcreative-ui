<script lang="ts">
	import FeatureCard from '$lib/components/FeatureCard.svelte';
</script>

<div class="grid w-full gap-6 sm:grid-cols-2">
	<FeatureCard title="Plain" description="Sits in a grid, no border of its own.">
		{#snippet icon()}
			<svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<rect x="3" y="3" width="14" height="14" stroke="currentColor" stroke-width="1.5" />
			</svg>
		{/snippet}
	</FeatureCard>
	<FeatureCard
		href="#"
		tone="accent"
		title="A link"
		description="The whole card is clickable — the heading follows the tone on hover."
	/>
</div>
