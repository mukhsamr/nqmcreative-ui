<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import CommandPalette from '$lib/styles/matte/CommandPalette.svelte';
	import Kbd from '$lib/styles/matte/Kbd.svelte';

	let open = $state(false);
</script>

{#snippet plus()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.5" />
	</svg>
{/snippet}

{#snippet person()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<circle cx="8" cy="5.5" r="2.6" stroke="currentColor" stroke-width="1.4" />
		<path d="M3 14c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

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

{#snippet trash()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5 5 13h6l.5-8.5"
			stroke="currentColor"
			stroke-width="1.4"
		/>
	</svg>
{/snippet}

<Button variant="outline" tone="neutral" onclick={() => (open = true)}>
	Open palette <Kbd>⌘</Kbd><Kbd>K</Kbd>
</Button>

<CommandPalette
	bind:open
	hotkey={null}
	items={[
		{ id: 'new', label: 'New project', group: 'Create', shortcut: '⌘N', icon: plus },
		{ id: 'invite', label: 'Invite a teammate', group: 'Create', icon: person },
		{
			id: 'settings',
			label: 'Open settings',
			group: 'Navigate',
			keywords: 'preferences',
			icon: cog
		},
		{ id: 'archive', label: 'Archive project', group: 'Danger', icon: trash, disabled: true }
	]}
/>
