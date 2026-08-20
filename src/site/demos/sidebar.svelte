<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

	let value = $state('projects');
	let collapsed = $state(false);
</script>

<div class="flex h-96 w-full border border-hairline">
	<Sidebar
		bind:value
		bind:collapsed
		sections={[
			{
				items: [
					{ id: 'home', label: 'Dashboard', href: '#' },
					{ id: 'projects', label: 'Projects', href: '#', badge: 12 }
				]
			},
			{
				label: 'Studio',
				items: [
					{
						label: 'Library',
						open: true,
						items: [
							{ id: 'assets', label: 'Assets', href: '#' },
							{ id: 'fonts', label: 'Fonts', href: '#' }
						]
					},
					{ id: 'invoices', label: 'Invoices', href: '#' }
				]
			}
		]}
	/>
	<div class="flex-1 bg-bg-alt"></div>
</div>
