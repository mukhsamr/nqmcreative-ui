<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import CTASection from '$lib/styles/matte/CTASection.svelte';
</script>

<div class="flex w-full flex-col gap-6">
	<div class="border border-hairline">
		<CTASection
			title="Ready when you are."
			description="Tell us what you are building and we will tell you if we can help."
			class="py-10"
		>
			{#snippet actions()}
				<Button size="lg">Start a project</Button>
			{/snippet}
		</CTASection>
	</div>

	<div class="border border-hairline">
		<CTASection
			inline
			variant="solid"
			tone="accent"
			title="Or just take the components."
			description="MIT licensed, no strings."
			class="py-10"
		>
			{#snippet actions()}
				<Button variant="soft" tone="neutral" size="lg">Read the docs</Button>
			{/snippet}
		</CTASection>
	</div>
</div>
