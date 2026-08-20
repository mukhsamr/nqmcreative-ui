<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Drawer from '$lib/components/Drawer.svelte';

	let open = $state(false);
</script>

<Button variant="outline" tone="neutral" onclick={() => (open = true)}>Open drawer</Button>

<Drawer bind:open side="right" title="Project settings">
	<p class="text-sm text-text-secondary">Slides in on the native dialog top layer.</p>
</Drawer>
