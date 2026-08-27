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

<Accordion class="w-full">
	<AccordionItem icon={doc} title="A single item" meta="01" open>
		Built on &lt;details&gt;, so it opens and closes without JavaScript.
	</AccordionItem>
</Accordion>
