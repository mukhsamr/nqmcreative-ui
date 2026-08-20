<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import AccordionItem from '$lib/components/AccordionItem.svelte';
</script>

<Accordion class="w-full">
	<AccordionItem title="What does the retainer include?" meta="01" open>
		Strategy, design and two rounds of revision per sprint.
	</AccordionItem>
	<AccordionItem title="How fast is onboarding?" meta="02" tone="accent">
		Kick-off within five business days of the signed SOW.
	</AccordionItem>
</Accordion>
