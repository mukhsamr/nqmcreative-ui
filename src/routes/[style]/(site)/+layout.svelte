<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { count, components, styles } from '$site/catalogue.js';
	import { docs } from '$site/docs.js';
	import { UI } from '$site/ui.js';

	let { data, children } = $props();

	// Every component on this page — chrome included — comes from the style in
	// the URL. Nothing here is hard-wired to one style.
	const ui = $derived(UI[data.style]);

	/** Prefix for every internal link: the style is part of the path. */
	const base = $derived(`/${data.style}`);

	let paletteOpen = $state(false);

	const active = $derived(page.url.pathname);
	const inStyle = $derived((path: string) => active.startsWith(`${base}${path}`));

	// One flat A–Z list — sidebar and palette both — rather than category
	// headings: a reader looking for a component knows its name, not which
	// bucket it was filed under.
	const sorted = [...components].sort((a, b) => a.name.localeCompare(b.name));

	// The category is gone from the palette's headings, so it rides along as a
	// keyword instead: typing `overlay` still finds them.
	const paletteItems = $derived(
		sorted.map((item) => ({
			id: item.slug,
			label: item.name,
			description: item.description,
			keywords: `${item.slug} ${item.category}`,
			onselect: () => goto(`${base}/components/${item.slug}`)
		}))
	);

	/** The same page in another style — swap the first segment, keep the rest. */
	const switchTo = (name: string) => `/${name}${active.slice(base.length)}`;
</script>

<div class="flex min-h-screen flex-col bg-bg text-text">
	<ui.Navbar
		sticky
		items={[
			{ label: 'Docs', href: `${base}/docs/installation`, active: inStyle('/docs') },
			{ label: 'Components', href: `${base}/components`, active: inStyle('/components') },
			{ label: 'Playground', href: `${base}/playground`, active: inStyle('/playground') }
		]}
	>
		{#snippet brand()}
			<a href={base} class="font-heading text-base font-medium tracking-tight text-text">
				nqm<span class="text-brand">.</span>ui
			</a>
		{/snippet}

		{#snippet actions()}
			<!--
				Plain links, not a toggle: the style is the route, so switching is a
				navigation. That also means the choice survives a reload and can be
				shared as a URL.

				`data-sveltekit-reload` — inherited by every link inside — forces a
				full page load. Crossing styles swaps 65 components and the whole
				token set at once, and a fresh document is both the honest way to see
				that and the way `data-style` gets rewritten server-side.
			-->
			<nav aria-label="Style" data-sveltekit-reload class="flex items-center gap-1">
				{#each styles as style (style.name)}
					<a
						href={switchTo(style.name)}
						aria-current={style.name === data.style ? 'true' : undefined}
						title={style.description}
						class="px-2 py-1 font-sans text-sm transition-colors duration-150 {style.name ===
						data.style
							? 'font-medium text-brand'
							: 'text-text-muted hover:text-text'}"
					>
						{style.name}
					</a>
				{/each}
			</nav>

			<!--
				A real Button rather than bespoke markup, so the search control is
				drawn by the style like everything else on the page.
			-->
			<ui.Button variant="outline" tone="neutral" size="sm" onclick={() => (paletteOpen = true)}>
				<svg class="size-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" />
					<path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.5" />
				</svg>
				Search
				<ui.Kbd>⌘K</ui.Kbd>
				<ui.Kbd>/</ui.Kbd>
			</ui.Button>
			<ui.ThemeToggle />
		{/snippet}
	</ui.Navbar>

	<div class="mx-auto flex w-full max-w-6xl flex-1 gap-12 px-6">
		<!-- component nav, hidden on small screens where the navbar drawer takes over -->
		<nav aria-label="Components" class="hidden w-52 shrink-0 py-10 lg:block">
			<div class="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col gap-6 overflow-y-auto pb-6">
				<div class="flex flex-col gap-1">
					<p
						class="px-2 pb-1 font-sans text-[10px] font-semibold tracking-wide text-text-muted uppercase"
					>
						getting started
					</p>
					{#each docs as doc (doc.slug)}
						<a
							href="{base}/docs/{doc.slug}"
							aria-current={active === `${base}/docs/${doc.slug}` ? 'page' : undefined}
							class="px-2 py-1 font-sans text-sm transition-colors duration-150 {active ===
							`${base}/docs/${doc.slug}`
								? 'bg-brand-light font-medium text-brand'
								: 'text-text-secondary hover:text-text'}"
						>
							{doc.title}
						</a>
					{/each}
				</div>

				<div class="flex flex-col gap-1">
					<p
						class="px-2 pb-1 font-sans text-[10px] font-semibold tracking-wide text-text-muted uppercase"
					>
						components
					</p>
					{#each sorted as item (item.slug)}
						<a
							href="{base}/components/{item.slug}"
							aria-current={active === `${base}/components/${item.slug}` ? 'page' : undefined}
							class="px-2 py-1 font-sans text-sm transition-colors duration-150 {active ===
							`${base}/components/${item.slug}`
								? 'bg-brand-light font-medium text-brand'
								: 'text-text-secondary hover:text-text'}"
						>
							{item.name}
						</a>
					{/each}
				</div>
			</div>
		</nav>

		<main class="min-w-0 flex-1 py-10">
			{@render children()}
		</main>
	</div>

	<ui.Footer
		copyright="© 2026 NQM Creative · MIT"
		columns={[
			{
				title: 'Docs',
				links: [
					{ label: 'Installation', href: `${base}/docs/installation` },
					{ label: 'Theming', href: `${base}/docs/theming` },
					{ label: 'Locale', href: `${base}/docs/locale` },
					{ label: `Components (${count})`, href: `${base}/components` },
					{ label: 'Playground', href: `${base}/playground` },
					{ label: 'App shell', href: `${base}/playground/shell` }
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
				A Svelte 5 + Tailwind v4 component library. You are reading it in
				<span class="text-text">{data.style}</span>.
			</p>
		{/snippet}
	</ui.Footer>
</div>

<ui.CommandPalette bind:open={paletteOpen} items={paletteItems} placeholder="Search components…" />
