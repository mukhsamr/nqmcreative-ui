<script lang="ts">
	import Navbar from '../../components/Navbar.svelte';
	import ThemeToggle from '../../components/ThemeToggle.svelte';
</script>

<div class="w-full border border-hairline">
	<Navbar
		bordered={false}
		items={[
			{ label: 'Overview', href: '#', active: true },
			{ label: 'Projects', href: '#', badge: 12 },
			{
				label: 'Resources',
				items: [
					{ label: 'Brand kit', href: '#' },
					{ label: 'Templates', href: '#' }
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
