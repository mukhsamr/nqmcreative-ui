<script lang="ts">
	import Accordion from '$lib/components/Accordion.svelte';
	import AccordionItem from '$lib/components/AccordionItem.svelte';
</script>

<Accordion class="w-full">
	<AccordionItem title="A single item" meta="01" open>
		Built on &lt;details&gt;, so it opens and closes without JavaScript.
	</AccordionItem>
</Accordion>
