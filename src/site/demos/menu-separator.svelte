<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import Dropdown from '$lib/styles/matte/Dropdown.svelte';
	import MenuItem from '$lib/styles/matte/MenuItem.svelte';
	import MenuSeparator from '$lib/styles/matte/MenuSeparator.svelte';
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
