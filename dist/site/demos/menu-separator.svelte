<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Dropdown from '../../components/Dropdown.svelte';
	import MenuItem from '../../components/MenuItem.svelte';
	import MenuSeparator from '../../components/MenuSeparator.svelte';
</script>

<Dropdown>
	{#snippet trigger()}
		<Button variant="outline" tone="neutral">Menu</Button>
	{/snippet}
	<MenuSeparator label="Group" />
	<MenuItem>First</MenuItem>
	<MenuSeparator />
	<MenuItem>Second</MenuItem>
</Dropdown>
