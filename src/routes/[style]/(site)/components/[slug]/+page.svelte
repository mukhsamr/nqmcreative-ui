<script lang="ts">
	import CodeBlock from '$site/CodeBlock.svelte';
	import CodeTabs from '$site/CodeTabs.svelte';
	import { UI } from '$site/ui.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
	const base = $derived(`/${data.style}`);
	const entry = $derived(data.entry);

	// The preview is not a special case: this page already *is* the style, so
	// the demo is simply the one written for it.
	const Demo = $derived(entry.demos[data.style]);
	const source = $derived(entry.sources[data.style]);

	// Optional second demo, one file per component. Absent for most of them,
	// and the section is simply not rendered when it is.
	const Variants = $derived(entry.variants[data.style]);
	const variantSource = $derived(entry.variantSources[data.style]);

	// The package goes in once; `nqm-ui add` prints the import for this
	// component in this style. Four managers, same two steps.
	const managers = $derived([
		{ value: 'npm', label: 'npm', install: 'npm install', run: 'npx' },
		{ value: 'pnpm', label: 'pnpm', install: 'pnpm add', run: 'pnpm dlx' },
		{ value: 'bun', label: 'bun', install: 'bun add', run: 'bunx' },
		{ value: 'yarn', label: 'yarn', install: 'yarn add', run: 'yarn dlx' }
	]);

	const installTabs = $derived(
		managers.map(({ value, label, install, run }) => ({
			value,
			label,
			code: `${install} @nqmcreative/ui\n${run} nqm-ui add ${entry.slug} --style ${data.style}`
		}))
	);

	// Two ways in: the style barrel exports by name, the per-component subpath
	// exports a default. Mixing the two — named braces on the subpath — is the
	// one combination that does not work.
	const importLines = $derived(
		[
			`import { ${entry.name} } from '@nqmcreative/ui/${data.style}';`,
			`import ${entry.name} from '${entry.subpaths[data.style]}';`
		].join('\n')
	);

	const panels = [
		{ value: 'preview', label: 'Preview' },
		{ value: 'code', label: 'Code' }
	];

	let demoPanel = $state('preview');
	let variantPanel = $state('preview');
</script>

<svelte:head>
	<title>{entry.name} — nqm.ui</title>
	<meta name="description" content={entry.description} />
</svelte:head>

<article class="flex flex-col gap-10">
	<header class="flex flex-col gap-3">
		<h1 class="font-heading text-3xl font-medium tracking-tight">{entry.name}</h1>
		<p class="max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
			{entry.description}
		</p>
	</header>

	<!-- 1. install -->
	<section class="flex flex-col gap-4">
		<h2 class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Installation</h2>
		<CodeTabs style={data.style} tabs={installTabs} label="terminal" />
	</section>

	<!-- 2. import -->
	<section class="flex flex-col gap-4">
		<h2 class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Import</h2>
		<CodeBlock code={importLines} label="barrel or subpath" />
	</section>

	<!-- 3. live preview, with the source behind a tab -->
	<section class="flex flex-col gap-4">
		<h2 class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Usage</h2>
		{#if Demo}
			<div class="flex flex-col gap-3">
				<ui.Tabs bind:value={demoPanel} variant="segmented" items={panels} class="self-start" />
				<div role="tabpanel">
					{#if demoPanel === 'preview'}
						<div class="flex min-h-40 items-center justify-center border border-hairline bg-bg p-8">
							<Demo />
						</div>
					{:else if source}
						<CodeBlock code={source} label="{entry.slug}.svelte" />
					{/if}
				</div>
			</div>
		{:else}
			<div
				class="flex min-h-40 items-center justify-center border border-dashed border-hairline-strong p-8 font-sans text-sm text-text-muted"
			>
				No demo for this component yet.
			</div>
		{/if}
	</section>

	<!-- 4. variants -->
	{#if Variants}
		<section class="flex flex-col gap-4">
			<h2 class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Variants</h2>
			<div class="flex flex-col gap-3">
				<ui.Tabs bind:value={variantPanel} variant="segmented" items={panels} class="self-start" />
				<div role="tabpanel">
					{#if variantPanel === 'preview'}
						<div class="flex min-h-40 flex-col justify-center border border-hairline bg-bg p-8">
							<Variants />
						</div>
					{:else if variantSource}
						<CodeBlock code={variantSource} label="{entry.slug}.variants.svelte" />
					{/if}
				</div>
			</div>
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
