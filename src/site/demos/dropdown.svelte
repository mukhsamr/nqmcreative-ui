<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import Dropdown from '$lib/styles/matte/Dropdown.svelte';
	import MenuItem from '$lib/styles/matte/MenuItem.svelte';
	import MenuSeparator from '$lib/styles/matte/MenuSeparator.svelte';
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
