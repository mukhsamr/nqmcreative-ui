<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Dropdown from '../../components/Dropdown.svelte';
	import MenuItem from '../../components/MenuItem.svelte';
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
