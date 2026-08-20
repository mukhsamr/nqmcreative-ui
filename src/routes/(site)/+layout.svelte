<script lang="ts">
	import { page } from '$app/state';
	import { categories, components, count } from '$site/catalogue.js';
	import { docs } from '$site/docs.js';
	import CommandPalette from '$lib/components/CommandPalette.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Kbd from '$lib/components/Kbd.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children } = $props();

	let paletteOpen = $state(false);

	const active = $derived(page.url.pathname);

	const paletteItems = $derived(
		components.map((item) => ({
			id: item.slug,
			label: item.name,
			description: item.description,
			group: item.category,
			keywords: item.slug,
			onselect: () => (window.location.href = `/components/${item.slug}`)
		}))
	);
</script>

<div class="flex min-h-screen flex-col bg-bg text-text">
	<Navbar
		sticky
		items={[
			{ label: 'Docs', href: '/docs/installation', active: active.startsWith('/docs') },
			{ label: 'Components', href: '/components', active: active.startsWith('/components') },
			{ label: 'Playground', href: '/playground' },
			{ label: 'App shell', href: '/playground/shell' }
		]}
	>
		{#snippet brand()}
			<a href="/" class="font-heading text-base font-medium tracking-tight text-text">
				nqm<span class="text-brand">.</span>ui
			</a>
		{/snippet}

		{#snippet actions()}
			<button
				type="button"
				onclick={() => (paletteOpen = true)}
				class="inline-flex items-center gap-2 border border-hairline px-3 py-1.5 font-sans text-sm text-text-muted transition-colors duration-150 hover:border-hairline-strong hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
			>
				<svg class="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" />
					<path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.5" />
				</svg>
				Search
				<Kbd>⌘K</Kbd>
			</button>
			<ThemeToggle />
		{/snippet}
	</Navbar>

	<div class="mx-auto flex w-full max-w-6xl flex-1 gap-12 px-6">
		<!-- category nav, hidden on small screens where the navbar drawer takes over -->
		<nav aria-label="Components" class="hidden w-52 shrink-0 py-10 lg:block">
			<div class="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col gap-6 overflow-y-auto pb-6">
				<div class="flex flex-col gap-1">
					<p class="px-2 pb-1 font-mono text-[10px] tracking-wide text-text-muted uppercase">
						getting started
					</p>
					{#each docs as doc (doc.slug)}
						<a
							href="/docs/{doc.slug}"
							aria-current={active === `/docs/${doc.slug}` ? 'page' : undefined}
							class="px-2 py-1 font-sans text-sm transition-colors duration-150 {active ===
							`/docs/${doc.slug}`
								? 'bg-brand-light font-medium text-brand'
								: 'text-text-secondary hover:text-text'}"
						>
							{doc.title}
						</a>
					{/each}
				</div>

				{#each categories as group (group.name)}
					<div class="flex flex-col gap-1">
						<p class="px-2 pb-1 font-mono text-[10px] tracking-wide text-text-muted uppercase">
							{group.name}
						</p>
						{#each group.items as item (item.slug)}
							<a
								href="/components/{item.slug}"
								aria-current={active === `/components/${item.slug}` ? 'page' : undefined}
								class="px-2 py-1 font-sans text-sm transition-colors duration-150 {active ===
								`/components/${item.slug}`
									? 'bg-brand-light font-medium text-brand'
									: 'text-text-secondary hover:text-text'}"
							>
								{item.name}
							</a>
						{/each}
					</div>
				{/each}
			</div>
		</nav>

		<main class="min-w-0 flex-1 py-10">
			{@render children()}
		</main>
	</div>

	<Footer
		copyright="© 2026 NQM Creative · MIT"
		columns={[
			{
				title: 'Docs',
				links: [
					{ label: 'Installation', href: '/docs/installation' },
					{ label: 'Theming', href: '/docs/theming' },
					{ label: 'Locale', href: '/docs/locale' },
					{ label: `Components (${count})`, href: '/components' },
					{ label: 'Playground', href: '/playground' },
					{ label: 'App shell', href: '/playground/shell' }
				]
			},
			{
				title: 'Elsewhere',
				links: [
					{
						label: 'GitHub',
						href: 'https://github.com/mukhsamr/nqmcreative-ui',
						external: true
					},
					{ label: 'nqmcreative.com', href: 'https://nqmcreative.com', external: true }
				]
			}
		]}
	>
		{#snippet brand()}
			<span class="font-heading text-base font-medium tracking-tight">
				nqm<span class="text-brand">.</span>ui
			</span>
			<p class="font-sans text-sm leading-relaxed text-text-secondary">
				A Svelte 5 + Tailwind v4 design system. Flat surfaces, eight tones, light and dark.
			</p>
		{/snippet}
	</Footer>
</div>

<CommandPalette bind:open={paletteOpen} items={paletteItems} placeholder="Search components…" />
