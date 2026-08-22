<script lang="ts">
	import { UI } from '$site/ui.js';
	import { categories, count, styles } from '$site/catalogue.js';
	import CodeBlock from '$site/CodeBlock.svelte';
	import { TONES } from '$lib/core/tones.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
	const base = $derived(`/${data.style}`);

	const swatches = [
		{ tone: 'brand', base: 'bg-brand', light: 'bg-brand-light' },
		{ tone: 'accent', base: 'bg-accent', light: 'bg-accent-light' },
		{ tone: 'violet', base: 'bg-violet', light: 'bg-violet-light' },
		{ tone: 'info', base: 'bg-info', light: 'bg-info-light' },
		{ tone: 'success', base: 'bg-success', light: 'bg-success-light' },
		{ tone: 'warning', base: 'bg-warning', light: 'bg-warning-light' },
		{ tone: 'danger', base: 'bg-danger', light: 'bg-danger-light' },
		{ tone: 'neutral', base: 'bg-neutral', light: 'bg-neutral-light' }
	];

	// Both samples name the style you are reading the site in, so what is on the
	// page and what you would type never disagree.
	const install = $derived(`bun add @nqmcreative/ui
bunx nqm-ui init --style ${data.style}`);

	// Deliberately without the surrounding <script> tags: a literal closing tag
	// inside this block would end it, and every way of escaping one upsets
	// either eslint or prettier.
	const usage = $derived(`import { Button } from '@nqmcreative/ui/${data.style}';

<Button tone="accent">Get started</Button>`);
</script>

<svelte:head>
	<title>nqm.ui — a Svelte 5 design system</title>
	<meta
		name="description"
		content="{count} Svelte 5 components on Tailwind v4, in {styles.length} interchangeable styles. Eight tones, light and dark, no runtime dependencies."
	/>
</svelte:head>

<div class="flex flex-col gap-20 pb-10">
	<!-- hero -->
	<header class="flex flex-col gap-6 pt-6">
		<ui.Badge tone="brand" dot>{count} components × {styles.length} styles</ui.Badge>
		<h1
			class="max-w-2xl font-heading text-4xl leading-tight font-medium tracking-tight sm:text-5xl"
		>
			One component library, wearing different clothes.
		</h1>
		<p class="max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
			Svelte 5 runes on Tailwind v4. Every style ships all {count} components with the same props and
			the same behaviour — the focus traps, keyboard handling and date maths are written once, in core.
			Only the markup and the classes change.
		</p>
		<div class="flex flex-wrap items-center gap-3 pt-2">
			<ui.Button href="{base}/docs/installation" size="lg">Get started</ui.Button>
			<ui.Button href="{base}/components" variant="soft" size="lg">Browse components</ui.Button>
			<ui.Button
				href="https://github.com/mukhsamr/nqmcreative-ui"
				variant="outline"
				tone="neutral"
				size="lg"
			>
				GitHub
			</ui.Button>
		</div>
	</header>

	<!-- install -->
	<section class="grid gap-6 lg:grid-cols-2">
		<CodeBlock code={install} label="install" />
		<CodeBlock code={usage} label="use" />
	</section>

	<!-- styles -->
	<section class="flex flex-col gap-5">
		<div class="flex flex-col gap-2">
			<h2 class="font-heading text-2xl font-medium tracking-tight">Pick a style, not a package</h2>
			<p class="max-w-xl font-sans text-text-secondary">
				The word after <code class="font-mono text-sm text-brand">@nqmcreative/ui/</code> decides the
				look. There is no root import on purpose — a style is a choice, and choosing one by accident is
				the mistake worth designing out.
			</p>
		</div>
		<div
			data-sveltekit-reload
			class="grid gap-px border border-hairline bg-hairline sm:grid-cols-2"
		>
			{#each styles as style (style.name)}
				<a
					href="/{style.name}"
					class="flex flex-col gap-2 bg-bg p-5 transition-colors duration-150 hover:bg-bg-alt"
				>
					<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">
						@nqmcreative/ui/{style.name}
					</p>
					<p class="font-heading text-lg font-medium text-text">
						{style.title}
						{#if style.name === data.style}
							<span class="font-sans text-xs font-normal text-text-muted">— you are here</span>
						{/if}
					</p>
					<p class="font-sans text-sm leading-relaxed text-text-secondary">
						{style.description}
					</p>
				</a>
			{/each}
		</div>
		<p class="font-sans text-sm text-text-muted">
			This whole site is drawn in <span class="text-text">{data.style}</span> — chrome included. The
			style is the first segment of the URL, so every page has a twin: swap it and the same {count}
			components come back wearing the other one.
		</p>
	</section>

	<!-- palette -->
	<section class="flex flex-col gap-5">
		<div class="flex flex-col gap-2">
			<h2 class="font-heading text-2xl font-medium tracking-tight">Eight tones, one system</h2>
			<p class="max-w-xl font-sans text-text-secondary">
				Every tonal component takes the same <code class="font-mono text-sm text-brand">tone</code>
				prop. Each hue ships four steps — base, hover, light and border.
			</p>
		</div>
		<div class="grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
			{#each swatches as swatch (swatch.tone)}
				<div class="flex flex-col gap-2 bg-bg p-4">
					<div class="flex h-10 items-stretch">
						<span class="flex-1 {swatch.base}"></span>
						<span class="flex-1 {swatch.light}"></span>
					</div>
					<span class="font-mono text-xs text-text-secondary">{swatch.tone}</span>
				</div>
			{/each}
		</div>
		<div class="flex flex-wrap items-center gap-2">
			{#each TONES as tone (tone)}
				<ui.Badge {tone} dot>{tone}</ui.Badge>
			{/each}
		</div>
	</section>

	<!-- catalogue -->
	<section class="flex flex-col gap-5">
		<h2 class="font-heading text-2xl font-medium tracking-tight">Everything in the box</h2>
		<div class="grid gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
			{#each categories as group (group.name)}
				<div class="flex flex-col gap-3 bg-bg p-5">
					<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">
						{group.name}
					</p>
					<ul class="flex flex-col gap-1">
						{#each group.items as item (item.slug)}
							<li>
								<a
									href="{base}/components/{item.slug}"
									class="font-sans text-sm text-text-secondary transition-colors duration-150 hover:text-brand"
								>
									{item.name}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</section>
</div>
