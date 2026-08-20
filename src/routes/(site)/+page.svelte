<script lang="ts">
	import { categories, count } from '$site/catalogue.js';
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';
	import CodeBlock from '$site/CodeBlock.svelte';
	import { TONES } from '$lib/tones.js';

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

	const install = `bun add @nqmcreative/ui
bunx nqm-ui init`;

	// Deliberately without the surrounding <script> tags: a literal closing tag
	// inside this block would end it, and every way of escaping one upsets
	// either eslint or prettier.
	const usage = `import Button from '@nqmcreative/ui/button';

<Button tone="accent">Get started</Button>`;
</script>

<svelte:head>
	<title>nqm.ui — a Svelte 5 design system</title>
	<meta
		name="description"
		content="{count} Svelte 5 components on Tailwind v4. Flat surfaces, eight tones, light and dark, and no runtime dependencies."
	/>
</svelte:head>

<div class="flex flex-col gap-20 pb-10">
	<!-- hero -->
	<header class="flex flex-col gap-6 pt-6">
		<Badge tone="brand" dot>{count} components</Badge>
		<h1
			class="max-w-2xl font-heading text-4xl leading-tight font-medium tracking-tight sm:text-5xl"
		>
			A design system that stays out of the way.
		</h1>
		<p class="max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
			Svelte 5 runes on Tailwind v4. Flat surfaces, no shadows, no radius except pills. Eight tones
			built on one token system, light and dark, and not a single runtime dependency.
		</p>
		<div class="flex flex-wrap items-center gap-3 pt-2">
			<Button href="/docs/installation" size="lg">Get started</Button>
			<Button href="/components" variant="soft" size="lg">Browse components</Button>
			<Button
				href="https://github.com/mukhsamr/nqmcreative-ui"
				variant="outline"
				tone="neutral"
				size="lg"
			>
				GitHub
			</Button>
		</div>
	</header>

	<!-- install -->
	<section class="grid gap-6 lg:grid-cols-2">
		<CodeBlock code={install} label="install" />
		<CodeBlock code={usage} label="use" />
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
				<Badge {tone} dot>{tone}</Badge>
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
									href="/components/{item.slug}"
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
