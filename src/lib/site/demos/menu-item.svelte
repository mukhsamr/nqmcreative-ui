<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Dropdown from '$lib/components/Dropdown.svelte';
	import MenuItem from '$lib/components/MenuItem.svelte';
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
