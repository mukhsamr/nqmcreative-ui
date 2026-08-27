<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import Dropdown from '$lib/styles/matte/Dropdown.svelte';
	import MenuItem from '$lib/styles/matte/MenuItem.svelte';
	import MenuSeparator from '$lib/styles/matte/MenuSeparator.svelte';
</script>

{#snippet chevron()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" />
	</svg>
{/snippet}

{#snippet copy()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<rect x="5.5" y="5.5" width="8" height="8" stroke="currentColor" stroke-width="1.4" />
		<path d="M10.5 3.5h-8v8" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

{#snippet duplicate()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M8 4v8M4 8h8" stroke="currentColor" stroke-width="1.4" />
		<rect x="2.5" y="2.5" width="11" height="11" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

{#snippet share()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M8 11V3m0 0L5 6m3-3 3 3" stroke="currentColor" stroke-width="1.4" />
		<path d="M3 10v3h10v-3" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

{#snippet trash()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5 5 13h6l.5-8.5"
			stroke="currentColor"
			stroke-width="1.4"
		/>
	</svg>
{/snippet}

<Dropdown>
	{#snippet trigger()}
		<Button variant="outline" tone="neutral" iconEnd={chevron}>Actions</Button>
	{/snippet}
	<MenuSeparator label="Project" />
	<MenuItem icon={copy} shortcut="⌘C">Copy</MenuItem>
	<MenuItem icon={duplicate} shortcut="⌘D">Duplicate</MenuItem>
	<MenuItem icon={share} shortcut="⌘S">Share</MenuItem>
	<MenuSeparator />
	<MenuItem icon={trash} tone="danger">Delete</MenuItem>
</Dropdown>
