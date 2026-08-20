<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Dropdown from '../../components/Dropdown.svelte';
	import MenuItem from '../../components/MenuItem.svelte';
	import MenuSeparator from '../../components/MenuSeparator.svelte';
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
