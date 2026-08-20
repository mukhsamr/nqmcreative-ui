<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
	import MenuSeparator from '$lib/components/MenuSeparator.svelte';
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
