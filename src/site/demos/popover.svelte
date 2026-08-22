<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import Popover from '$lib/styles/matte/Popover.svelte';
</script>

<Popover>
	{#snippet trigger()}
		<Button variant="soft" tone="violet">Open popover</Button>
	{/snippet}
	<div class="flex max-w-56 flex-col gap-2 p-4">
		<p class="font-sans text-sm font-medium text-text">Anchored panel</p>
		<p class="font-sans text-sm text-text-secondary">Flips and clamps near the viewport edges.</p>
	</div>
</Popover>
