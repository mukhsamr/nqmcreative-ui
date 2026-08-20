<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Card from '$lib/components/Card.svelte';
	import Link from '$lib/components/Link.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';

	let { data } = $props();

	const entry = $derived(data.entry);
	const importLine = $derived(`import ${entry.name} from '${entry.subpath}';`);
	const source = $derived(`https://github.com/mukhsamr/nqmcreative-ui/blob/main/${entry.file}`);
</script>

<svelte:head>
	<title>{entry.name} — nqm.ui</title>
	<meta name="description" content={entry.description} />
</svelte:head>

<article class="flex flex-col gap-10">
	<header class="flex flex-col gap-3">
		<Badge tone="neutral" size="sm">{entry.category}</Badge>
		<h1 class="font-heading text-3xl font-medium tracking-tight">{entry.name}</h1>
		<p class="max-w-xl font-sans text-lg leading-relaxed text-text-secondary">
			{entry.description}
		</p>
	</header>

	<CodeBlock code={importLine} label="import" />

	<!-- live preview -->
	<section class="flex flex-col gap-4">
		<h2 class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Preview</h2>
		{#if entry.demo}
			{@const Demo = entry.demo}
			<div class="flex min-h-40 items-center justify-center border border-hairline bg-bg p-8">
				<Demo />
			</div>
			{#if entry.demoSource}
				<CodeBlock code={entry.demoSource} label="{entry.slug}.svelte" />
			{/if}
		{:else}
			<div
				class="flex min-h-40 items-center justify-center border border-dashed border-hairline-strong p-8 font-sans text-sm text-text-muted"
			>
				No demo for this component yet.
			</div>
		{/if}
	</section>

	<!-- what it pulls in -->
	{#if entry.uses.length || entry.modules.length}
		<section class="grid gap-6 sm:grid-cols-2">
			{#if entry.uses.length}
				<Card variant="filled" eyebrow="Renders" title="Inside this component">
					<p class="font-sans text-sm leading-relaxed text-text-secondary">
						Uses {entry.uses.join(', ')} internally — nothing extra to install.
					</p>
				</Card>
			{/if}
			{#if entry.modules.length}
				<Card variant="filled" eyebrow="Imports" title="Shared modules">
					<ul class="flex flex-wrap gap-2">
						{#each entry.modules as module (module)}
							<li>
								<Badge tone="neutral" size="sm">{module}</Badge>
							</li>
						{/each}
					</ul>
				</Card>
			{/if}
		</section>
	{/if}

	<p class="font-sans text-sm text-text-muted">
		Source: <Link href={source} external>{entry.file}</Link>
	</p>

	<!-- prev / next -->
	<nav class="flex items-stretch gap-px border-t border-hairline pt-6">
		<div class="flex-1">
			{#if data.previous}
				<a
					href="/components/{data.previous.slug}"
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
					href="/components/{data.next.slug}"
					class="flex flex-col gap-1 py-2 font-sans transition-colors duration-150 hover:text-brand"
				>
					<span class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Next</span>
					<span class="text-sm">{data.next.name}</span>
				</a>
			{/if}
		</div>
	</nav>
</article>
