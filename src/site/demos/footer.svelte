<script lang="ts">
	import Footer from '$lib/styles/matte/Footer.svelte';
</script>

<div class="w-full border border-hairline">
	<Footer
		copyright="© 2026 NQM Creative"
		columns={[
			{
				title: 'Product',
				links: [
					{ label: 'Components', href: '#' },
					{ label: 'Changelog', href: '#' }
				]
			},
			{
				title: 'Studio',
				links: [
					{ label: 'Work', href: '#' },
					{ label: 'Contact', href: '#' }
				]
			}
		]}
	>
		{#snippet brand()}
			<span class="font-heading text-base font-medium tracking-tight"
				>nqm<span class="text-brand">.</span></span
			>
			<p class="font-sans text-sm text-text-secondary">A Svelte 5 design system.</p>
		{/snippet}
	</Footer>
</div>
