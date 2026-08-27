<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import Drawer from '$lib/styles/matte/Drawer.svelte';

	let open = $state(false);
</script>

{#snippet cog()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<circle cx="8" cy="8" r="2.2" stroke="currentColor" stroke-width="1.4" />
		<path
			d="M8 1.5v2M8 12.5v2M14.5 8h-2M3.5 8h-2M12.6 3.4l-1.4 1.4M4.8 11.2l-1.4 1.4M12.6 12.6l-1.4-1.4M4.8 4.8 3.4 3.4"
			stroke="currentColor"
			stroke-width="1.4"
		/>
	</svg>
{/snippet}

<Button variant="outline" tone="neutral" onclick={() => (open = true)}>Open drawer</Button>

<Drawer bind:open icon={cog} side="right" title="Project settings">
	<p class="text-sm text-text-secondary">Slides in on the native dialog top layer.</p>
</Drawer>
