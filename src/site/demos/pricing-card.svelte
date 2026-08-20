<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import PricingCard from '$lib/components/PricingCard.svelte';
</script>

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
