<script lang="ts">
	import Alert from '$lib/components/Alert.svelte';
	import Steps from '$lib/components/Steps.svelte';
	import CodeBlock from '$lib/site/CodeBlock.svelte';
	import * as code from '$lib/site/snippets.js';
</script>

<svelte:head>
	<title>Adding a component — nqm.ui</title>
	<meta
		name="description"
		content="Conventions for adding a component to the library, and the two mistakes that fail silently."
	/>
</svelte:head>

<header class="flex flex-col gap-3">
	<h1 class="font-heading text-3xl font-medium tracking-tight">Adding a component</h1>
	<p class="font-sans text-lg leading-relaxed text-text-secondary">
		This page is for working on the library itself. If you only want to use a component in your own
		project, the <a href="/docs/installation" class="text-brand underline underline-offset-4">
			installation page
		</a> is what you want.
	</p>
</header>

<section class="flex flex-col gap-6">
	<Steps
		orientation="vertical"
		current={4}
		bare
		items={[
			{ label: 'Write the component', description: 'src/lib/components/Callout.svelte' },
			{ label: 'Export it', description: 'src/lib/index.ts, under a category comment' },
			{ label: 'Write a demo', description: 'src/lib/site/demos/callout.svelte' },
			{ label: 'Regenerate and build', description: 'registry, exports, dist' }
		]}
	/>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">1. The component</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Svelte 5 runes, a <code class="font-mono text-sm text-brand">Props</code> interface extending
		the matching HTML attributes, <code class="font-mono text-sm text-brand">class</code> merged
		last so callers can override, and <code class="font-mono text-sm text-brand">...rest</code> spread
		onto the root element.
	</p>
	<CodeBlock code={code.newComponent} label="src/lib/components/Callout.svelte" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Take colours from the tone maps, never as raw hex. Take any user-visible string from
		<code class="font-mono text-brand">useLocale()</code> rather than writing it inline — that is what
		keeps the library translatable.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">2. Export it</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Put it under the right category comment — the site reads those comments to group the sidebar and
		the catalogue, so the placement is the categorisation.
	</p>
	<CodeBlock code={code.newExport} label="src/lib/index.ts" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">3. A demo</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		One file, named after the subpath. It is rendered live on the component's page
		<em>and</em> shown as the code sample, so the two can never drift apart. Import from
		<code class="font-mono text-sm text-brand">$lib/components/…</code>, not from the package.
	</p>
	<CodeBlock code={code.newDemo} label="src/lib/site/demos/callout.svelte" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">4. Regenerate</h2>
	<CodeBlock code={code.newBuild} label="terminal" />
	<p class="font-sans leading-relaxed text-text-secondary">
		After that the component appears in the nav, the index, the ⌘K palette and the CLI without any
		further wiring. <code class="font-mono text-sm text-brand">dist/</code> is committed, so rebuild and
		commit it with your change — bun cannot build the package at install time.
	</p>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Add a one-line description in
		<code class="font-mono text-brand">scripts/generate-registry.mjs</code>; the whole catalogue is
		kept there so the wording can be read together.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Two traps that fail silently</h2>

	<h3 class="font-sans text-sm font-medium text-text">Interpolated class names</h3>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Tailwind scans source text. A class it never sees written out is never generated — no error,
		just an unstyled element.
	</p>
	<CodeBlock code={code.toneRule} label="never do the first" />

	<h3 class="pt-2 font-sans text-sm font-medium text-text">Two colours for one property</h3>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Which wins is decided by the order the rules appear in the stylesheet, not the order in your
		class attribute. Set the colour once per variant, or use a side-specific utility.
	</p>
	<CodeBlock code={code.borderRule} label="the fix is on the right" />

	<Alert tone="success" title="The guards will catch some of this">
		<code class="font-mono">bun run lint</code> fails when the exports map or the registry is stale, so
		a component cannot ship without its subpath. It cannot catch a missing Tailwind class — only looking
		at the result does.
	</Alert>
</section>
