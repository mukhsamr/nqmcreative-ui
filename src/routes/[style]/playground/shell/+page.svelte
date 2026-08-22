<script lang="ts">
	import { UI } from '$site/ui.js';
	import { toast } from '$lib/core/index.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
	const base = $derived(`/${data.style}`);

	let page = $state('projects');
	let collapsed = $state(false);
	let step = $state(1);
</script>

<div class="flex min-h-screen flex-col bg-bg text-text">
	<ui.Navbar
		sticky
		items={[
			{ label: 'Overview', href: '#', active: true },
			{ label: 'Projects', href: '#', badge: 12 },
			{
				label: 'Resources',
				items: [
					{ label: 'Brand kit', href: '#' },
					{ label: 'Templates', href: '#' },
					{ label: 'Changelog', href: '#', active: true }
				]
			},
			{ label: 'Pricing', href: '#' }
		]}
	>
		{#snippet brand()}
			<a href={base} class="font-heading text-base font-medium tracking-tight text-text">
				nqm<span class="text-brand">.</span>
			</a>
		{/snippet}

		{#snippet actions()}
			<ui.ThemeToggle />
			<ui.Dropdown placement="bottom-end">
				{#snippet trigger()}
					<button type="button" class="inline-flex" aria-label="Account">
						<ui.Avatar name="Nadia Q" size="sm" tone="brand" />
					</button>
				{/snippet}
				<ui.MenuSeparator label="nadia@nqm.co" />
				<ui.MenuItem>Profile</ui.MenuItem>
				<ui.MenuItem shortcut="⌘,">Settings</ui.MenuItem>
				<ui.MenuSeparator />
				<ui.MenuItem tone="danger">Sign out</ui.MenuItem>
			</ui.Dropdown>
		{/snippet}
	</ui.Navbar>

	<div class="flex flex-1">
		<div class="hidden md:flex">
			<ui.Sidebar
				bind:value={page}
				bind:collapsed
				sections={[
					{
						items: [
							{ id: 'home', label: 'Dashboard', href: '#' },
							{ id: 'projects', label: 'Projects', href: '#', badge: 12 },
							{ id: 'clients', label: 'Clients', href: '#' }
						]
					},
					{
						label: 'Studio',
						items: [
							{
								label: 'Library',
								open: true,
								items: [
									{ id: 'assets', label: 'Assets', href: '#', badge: 248 },
									{ id: 'fonts', label: 'Fonts', href: '#' },
									{ id: 'palettes', label: 'Palettes', href: '#' }
								]
							},
							{ id: 'invoices', label: 'Invoices', href: '#' },
							{ id: 'archive', label: 'Archive', href: '#', disabled: true }
						]
					}
				]}
				onnavigate={(item) => toast.info(`Navigated to ${item.label}`)}
			>
				{#snippet header()}
					<span class="font-mono text-xs tracking-wide text-text-muted uppercase">
						{collapsed ? 'nqm' : 'nqm studio'}
					</span>
				{/snippet}
			</ui.Sidebar>
		</div>

		<main class="flex-1 overflow-x-hidden px-6 py-10">
			<div class="mx-auto flex max-w-4xl flex-col gap-10">
				<header class="flex flex-wrap items-end justify-between gap-4">
					<div class="flex flex-col gap-2">
						<h1 class="font-heading text-3xl font-medium tracking-tight">Projects</h1>
						<p class="font-sans text-text-secondary">
							Active page: <code class="font-mono text-sm text-brand">{page}</code>
						</p>
					</div>
					<ui.Button onclick={() => toast.success('Project created')}>New project</ui.Button>
				</header>

				<div class="grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
					<div class="bg-bg p-6"><ui.Stat label="Active" value="12" delta="2" trend="up" /></div>
					<div class="bg-bg p-6"><ui.Stat label="In review" value="4" tone="warning" /></div>
					<div class="bg-bg p-6"><ui.Stat label="Archived" value="37" tone="neutral" /></div>
				</div>

				<ui.Card title="Onboarding" eyebrow="Steps">
					<div class="flex flex-col gap-8 pt-2">
						<ui.Steps
							bind:current={step}
							clickable
							items={[
								{ label: 'Sign the SOW', description: 'Countersigned' },
								{ label: 'Kick-off call', description: 'Scheduled' },
								{ label: 'Brand audit' },
								{ label: 'First sprint' }
							]}
						/>
						<div class="flex items-center gap-3">
							<ui.Button
								size="sm"
								variant="ghost"
								tone="neutral"
								disabled={step === 0}
								onclick={() => step--}
							>
								Back
							</ui.Button>
							<ui.Button size="sm" disabled={step === 3} onclick={() => step++}>Next step</ui.Button
							>
						</div>
					</div>
				</ui.Card>

				<ui.Card title="Vertical steps, with a failure" eyebrow="Variant">
					<ui.Steps
						orientation="vertical"
						current={2}
						tone="accent"
						items={[
							{ label: 'Upload assets', description: '248 files' },
							{ label: 'Colour check', description: 'Passed' },
							{ label: 'Print proof', description: 'Rejected by the printer', error: true },
							{ label: 'Ship' }
						]}
					/>
				</ui.Card>

				<p class="font-sans text-sm text-text-muted">
					Narrow the window below <ui.Badge tone="neutral" size="sm">768px</ui.Badge> — the sidebar drops
					away and the navbar switches to a drawer.
					<ui.Link href="{base}/playground">Back to the component preview</ui.Link>
				</p>
			</div>
		</main>
	</div>

	<ui.Footer
		copyright="© 2026 NQM Creative"
		columns={[
			{
				title: 'Product',
				links: [
					{ label: 'Components', href: `${base}/components` },
					{ label: 'App shell', href: `${base}/playground/shell` },
					{ label: 'Changelog', href: '#' }
				]
			},
			{
				title: 'Studio',
				links: [
					{ label: 'Work', href: '#' },
					{ label: 'About', href: '#' },
					{ label: 'Contact', href: '#' }
				]
			},
			{
				title: 'Elsewhere',
				links: [{ label: 'nqmcreative.com', href: 'https://nqmcreative.com', external: true }]
			}
		]}
	>
		{#snippet brand()}
			<span class="font-heading text-base font-medium tracking-tight"
				>nqm<span class="text-brand">.</span></span
			>
			<p class="font-sans text-sm leading-relaxed text-text-secondary">
				A Svelte 5 + Tailwind design system, flat by default.
			</p>
		{/snippet}

		{#snippet bottom()}
			<ui.ThemeToggle variant="segmented" />
		{/snippet}
	</ui.Footer>
</div>
