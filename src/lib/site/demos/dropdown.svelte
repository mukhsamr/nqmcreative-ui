<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import MenuSeparator from '$lib/components/MenuSeparator.svelte';
</script>

<Dropdown>
	{#snippet trigger()}
		<Button variant="outline" tone="neutral">Actions</Button>
	{/snippet}
	<MenuSeparator label="Project" />
	<MenuItem shortcut="⌘C">Copy</MenuItem>
	<MenuItem shortcut="⌘D">Duplicate</MenuItem>
	<MenuSeparator />
	<MenuItem tone="danger">Delete</MenuItem>
</Dropdown>
