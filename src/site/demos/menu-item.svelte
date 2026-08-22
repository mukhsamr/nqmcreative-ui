<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import Dropdown from '$lib/styles/matte/Dropdown.svelte';
	import MenuItem from '$lib/styles/matte/MenuItem.svelte';
</script>

<Dropdown>
	{#snippet trigger()}
		<Button variant="outline" tone="neutral">Menu</Button>
	{/snippet}
	<MenuItem shortcut="⌘C">Plain</MenuItem>
	<MenuItem selected>Selected</MenuItem>
	<MenuItem disabled>Disabled</MenuItem>
	<MenuItem tone="danger">Danger</MenuItem>
</Dropdown>
