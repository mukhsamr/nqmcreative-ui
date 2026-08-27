<script lang="ts">
	import Navbar from '$lib/styles/matte/Navbar.svelte';
	import ThemeToggle from '$lib/styles/matte/ThemeToggle.svelte';
</script>

{#snippet home()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M2 7 8 2l6 5v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7Z"
			stroke="currentColor"
			stroke-width="1.4"
		/>
	</svg>
{/snippet}

{#snippet stack()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="m8 2 6 3-6 3-6-3 6-3Z" stroke="currentColor" stroke-width="1.4" />
		<path d="m2 8 6 3 6-3M2 11l6 3 6-3" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

{#snippet book()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M3 2.5h6a2 2 0 0 1 2 2v9a2 2 0 0 0-2-2H3v-9Z"
			stroke="currentColor"
			stroke-width="1.4"
		/>
		<path d="M13 2.5h-2v9h2v-9Z" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

<div class="w-full border border-hairline">
	<Navbar
		bordered={false}
		items={[
			{ label: 'Overview', href: '#', active: true, icon: home },
			{ label: 'Projects', href: '#', badge: 12, icon: stack },
			{
				label: 'Resources',
				icon: book,
				items: [
					{ label: 'Brand kit', href: '#', icon: stack },
					{ label: 'Templates', href: '#', icon: book }
				]
			}
		]}
	>
		{#snippet brand()}
			<span class="font-heading text-base font-medium tracking-tight"
				>nqm<span class="text-brand">.</span></span
			>
		{/snippet}
		{#snippet actions()}
			<ThemeToggle />
		{/snippet}
	</Navbar>
</div>
