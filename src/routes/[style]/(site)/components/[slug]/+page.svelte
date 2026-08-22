<script lang="ts">
	import CodeBlock from '$site/CodeBlock.svelte';
	import { styles } from '$site/catalogue.js';
	import { UI } from '$site/ui.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
	const base = $derived(`/${data.style}`);
	const entry = $derived(data.entry);

	// The preview is not a special case: this page already *is* the style, so
	// the demo is simply the one written for it.
	const Demo = $derived(entry.demos[data.style]);
	const source = $derived(entry.sources[data.style]);

	// Two ways in: the style barrel exports by name, the per-component subpath
	// exports a default. Mixing the two — named braces on the subpath — is the
	// one combination that does not work.
	const importLines = $derived(
		[
			`import { ${entry.name} } from '@nqmcreative/ui/${data.style}';`,
			`import ${entry.name} from '${entry.subpaths[data.style]}';`
		].join('\n')
	);
</script>

<svelte:head>
	<title>{entry.name} — nqm.ui</title>
	<meta name="description" content={entry.description} />
</svelte:head>

<article class="flex flex-col gap-10">
	<header class="flex flex-col gap-3">
		<ui.Badge tone="neutral" size="sm">{entry.category}</ui.Badge>
		<h1 class="font-heading text-3xl font-medium tracking-tight">{entry.name}</h1>
		<p class="max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
			{entry.description}
		</p>
	</header>

	<CodeBlock code={importLines} label="import — barrel or subpath" />

	<!-- live preview -->
	<section class="flex flex-col gap-4">
		<h2 class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Preview</h2>
		{#if Demo}
			<div class="flex min-h-40 items-center justify-center border border-hairline bg-bg p-8">
				<Demo />
			</div>
			{#if source}
				<CodeBlock code={source} label="{entry.slug}.svelte" />
			{/if}
		{:else}
			<div
				class="flex min-h-40 items-center justify-center border border-dashed border-hairline-strong p-8 font-sans text-sm text-text-muted"
			>
				No demo for this component yet.
			</div>
		{/if}
	</section>

	<!-- the same component, in the other styles -->
	<section
		data-sveltekit-reload
		class="flex flex-wrap items-center gap-3 font-sans text-sm text-text-muted"
	>
		<span>See {entry.name} in</span>
		{#each styles.filter((s) => s.name !== data.style) as other (other.name)}
			<ui.Link href="/{other.name}/components/{entry.slug}">{other.title}</ui.Link>
		{/each}
		<span class="text-hairline-strong">·</span>
		<span>source</span>
		{#each styles as style (style.name)}
			<ui.Link
				href="https://github.com/mukhsamr/nqmcreative-ui/blob/main/src/lib/styles/{style.name}/{entry.name}.svelte"
				external>{style.name}</ui.Link
			>
		{/each}
	</section>

	<!-- what it pulls in -->
	{#if entry.uses.length || entry.modules.length}
		<section class="grid gap-6 sm:grid-cols-2">
			{#if entry.uses.length}
				<ui.Card variant="filled" eyebrow="Renders" title="Inside this component">
					<p class="font-sans text-sm leading-relaxed text-text-secondary">
						Uses {entry.uses.join(', ')} internally — nothing extra to install.
					</p>
				</ui.Card>
			{/if}
			{#if entry.modules.length}
				<ui.Card variant="filled" eyebrow="Imports" title="Core modules">
					<ul class="flex flex-wrap gap-2">
						{#each entry.modules as module (module)}
							<li>
								<ui.Badge tone="neutral" size="sm">{module}</ui.Badge>
							</li>
						{/each}
					</ul>
				</ui.Card>
			{/if}
		</section>
	{/if}

	<!-- prev / next -->
	<nav class="flex items-stretch gap-px border-t border-hairline pt-6">
		<div class="flex-1">
			{#if data.previous}
				<a
					href="{base}/components/{data.previous.slug}"
					class="flex flex-col gap-1 py-2 font-sans transition-colors duration-150 hover:text-brand"
				>
					<span class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Previous</span
					>
					<span class="text-sm">{data.previous.name}</span>
				</a>
			{/if}
		</div>
		<div class="flex-1 text-right">
			{#if data.next}
				<a
					href="{base}/components/{data.next.slug}"
					class="flex flex-col gap-1 py-2 font-sans transition-colors duration-150 hover:text-brand"
				>
					<span class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Next</span>
					<span class="text-sm">{data.next.name}</span>
				</a>
			{/if}
		</div>
	</nav>
</article>
