<script lang="ts">
	import { categories, count } from '$site/catalogue.js';
	import { UI } from '$site/ui.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
	const base = $derived(`/${data.style}`);

	let query = $state('');

	const filtered = $derived(
		categories
			.map((group) => ({
				...group,
				items: group.items.filter((item) =>
					`${item.name} ${item.slug} ${item.description}`
						.toLowerCase()
						.includes(query.trim().toLowerCase())
				)
			}))
			.filter((group) => group.items.length > 0)
	);

	const shown = $derived(filtered.reduce((n, group) => n + group.items.length, 0));
</script>

<svelte:head>
	<title>Components — nqm.ui</title>
</svelte:head>

<div class="flex flex-col gap-10">
	<header class="flex flex-col gap-4">
		<h1 class="font-heading text-3xl font-medium tracking-tight">Components</h1>
		<p class="max-w-xl font-sans text-text-secondary">
			{count} components, drawn here in <span class="text-text">{data.style}</span>.
		</p>
		<ui.Input bind:value={query} placeholder="Filter components…" class="max-w-sm" />
		{#if query}
			<p class="font-mono text-xs text-text-muted">{shown} of {count}</p>
		{/if}
	</header>

	{#each filtered as group (group.name)}
		<section class="flex flex-col gap-4">
			<h2 class="font-mono text-[10px] tracking-wide text-text-muted uppercase">{group.name}</h2>
			<div class="grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
				{#each group.items as item (item.slug)}
					<a
						href="{base}/components/{item.slug}"
						class="group flex flex-col gap-1.5 bg-bg p-5 transition-colors duration-150 hover:bg-bg-alt"
					>
						<span class="font-heading text-base font-medium text-text group-hover:text-brand">
							{item.name}
						</span>
						<span class="font-sans text-sm leading-snug text-text-secondary">
							{item.description}
						</span>
						<span class="pt-1 font-mono text-[11px] text-text-muted">{item.slug}</span>
					</a>
				{/each}
			</div>
		</section>
	{:else}
		<p class="font-sans text-text-muted">Nothing matches “{query}”.</p>
	{/each}
</div>
