<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import CommandPalette from '$lib/styles/matte/CommandPalette.svelte';
	import Kbd from '$lib/styles/matte/Kbd.svelte';

	let open = $state(false);
</script>

<Button variant="outline" tone="neutral" onclick={() => (open = true)}>
	Open palette <Kbd>⌘</Kbd><Kbd>K</Kbd>
</Button>

<CommandPalette
	bind:open
	hotkey={null}
	items={[
		{ id: 'new', label: 'New project', group: 'Create', shortcut: '⌘N' },
		{ id: 'invite', label: 'Invite a teammate', group: 'Create' },
		{ id: 'settings', label: 'Open settings', group: 'Navigate', keywords: 'preferences' },
		{ id: 'archive', label: 'Archive project', group: 'Danger', disabled: true }
	]}
/>
