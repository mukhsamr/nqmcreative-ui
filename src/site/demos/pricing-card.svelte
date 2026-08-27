<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import PricingCard from '$lib/styles/matte/PricingCard.svelte';
</script>

{#snippet spark()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M8 1.5 9.6 6l4.4 1.6L9.6 9.2 8 13.5 6.4 9.2 2 7.6 6.4 6 8 1.5Z"
			stroke="currentColor"
			stroke-width="1.3"
		/>
	</svg>
{/snippet}

<div class="grid w-full gap-6 sm:grid-cols-2">
	<PricingCard
		name="Studio"
		price="Rp 4,5jt"
		period="/ bulan"
		description="For one designer and one project at a time."
		features={['One active project', 'Two revision rounds', 'Async updates']}
	>
		{#snippet action()}
			<Button variant="outline" tone="neutral" block>Choose Studio</Button>
		{/snippet}
	</PricingCard>

	<PricingCard
		featured
		badge="Most popular"
		name="Agency"
		price="Rp 12jt"
		period="/ bulan"
		description="For teams shipping on a weekly cadence."
		featureIcon={spark}
		features={[
			'Three active projects',
			'Unlimited revisions',
			'Weekly calls',
			'Shared Slack channel'
		]}
	>
		{#snippet action()}
			<Button block>Choose Agency</Button>
		{/snippet}
	</PricingCard>
</div>
