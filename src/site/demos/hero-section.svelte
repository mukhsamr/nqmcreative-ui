<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import HeroSection from '$lib/styles/matte/HeroSection.svelte';
</script>

<div class="w-full border border-hairline">
	<HeroSection
		eyebrow="Studio retainer"
		title="Design that ships every sprint."
		description="Strategy, identity and product design on a monthly retainer — no scoping calls, no change orders."
		class="py-14"
	>
		{#snippet actions()}
			<Button>Book a call</Button>
			<Button variant="outline" tone="neutral">See the work</Button>
		{/snippet}
	</HeroSection>
</div>
