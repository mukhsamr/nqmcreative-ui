<script lang="ts">
	import ContextMenu from '$lib/styles/matte/ContextMenu.svelte';
	import MenuItem from '$lib/styles/matte/MenuItem.svelte';
	import MenuSeparator from '$lib/styles/matte/MenuSeparator.svelte';
</script>

<ContextMenu class="w-full">
	{#snippet menu()}
		<MenuSeparator label="Row" />
		<MenuItem shortcut="⌘C">Copy</MenuItem>
		<MenuItem shortcut="⌘D">Duplicate</MenuItem>
		<MenuSeparator />
		<MenuItem tone="danger">Remove</MenuItem>
	{/snippet}
	<div
		class="flex h-28 items-center justify-center border border-dashed border-hairline-strong bg-bg-alt font-sans text-sm text-text-muted"
	>
		Right-click anywhere in this area
	</div>
</ContextMenu>
