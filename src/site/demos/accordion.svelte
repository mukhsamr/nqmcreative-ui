<script lang="ts">
	import Accordion from '$lib/styles/matte/Accordion.svelte';
	import AccordionItem from '$lib/styles/matte/AccordionItem.svelte';
</script>

{#snippet doc()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M4 2h5l3 3v9H4V2Z" stroke="currentColor" stroke-width="1.4" />
		<path d="M9 2v3h3" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

{#snippet clock()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4" />
		<path d="M8 4.5V8l2.5 1.5" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

<Accordion class="w-full">
	<AccordionItem icon={doc} title="What does the retainer include?" meta="01" open>
		Strategy, design and two rounds of revision per sprint.
	</AccordionItem>
	<AccordionItem icon={clock} title="How fast is onboarding?" meta="02" tone="accent">
		Kick-off within five business days of the signed SOW.
	</AccordionItem>
</Accordion>
