<script lang="ts">
	import { UI } from '$site/ui.js';
	import CodeBlock from '$site/CodeBlock.svelte';
	import * as code from '$site/snippets.js';
	import { styles } from '$site/catalogue.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
	const base = $derived(`/${data.style}`);
</script>

<svelte:head>
	<title>Adding a component — nqm.ui</title>
	<meta
		name="description"
		content="Conventions for adding a component to every style, and the two mistakes that fail silently."
	/>
</svelte:head>

<header class="flex flex-col gap-3">
	<h1 class="font-heading text-3xl font-medium tracking-tight">Adding a component</h1>
	<p class="font-sans text-lg leading-relaxed text-text-secondary">
		This page is for working on the library itself. If you only want to use a component in your own
		project, the <a href="{base}/docs/installation" class="text-brand underline underline-offset-4">
			installation page
		</a> is what you want.
	</p>
</header>

<section class="flex flex-col gap-6">
	<ui.Steps
		orientation="vertical"
		current={5}
		bare
		items={[
			{ label: 'Add it to the catalogue', description: 'scripts/catalogue.mjs' },
			{ label: 'Put the behaviour in core', description: 'src/lib/core/ — if it has any' },
			{
				label: 'Write it in every style',
				description: styles.map((s) => `src/lib/styles/${s.name}/Callout.svelte`).join(', ')
			},
			{ label: 'Write a demo', description: 'src/site/demos/callout.svelte' },
			{ label: 'Regenerate and build', description: 'index, registry, exports, dist' }
		]}
	/>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">1. The catalogue</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		<code class="font-mono text-sm text-brand">scripts/catalogue.mjs</code> is the list of what this
		library <em>is</em>, independent of how any style draws it. Adding a line there is what makes
		the component appear in the sidebar, the registry, the ⌘K palette and the CLI.
	</p>
	<CodeBlock code={code.newCatalogue} label="scripts/catalogue.mjs" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Write the description in terms of what the component <em>does</em>, never what it looks like —
		every style shares this one line.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">2. Behaviour goes to core</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Anything with no opinion about looks — keyboard handling, focus containment, parsing, sorting,
		validation — belongs in
		<code class="font-mono text-sm text-brand">src/lib/core/</code>. There is no matte version of a
		focus trap, and writing one per style is how the styles quietly drift apart in quality.
	</p>
	<CodeBlock code={code.newBehaviour} label="src/lib/core/callout.ts" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">3. One file per style</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Svelte 5 runes, a <code class="font-mono text-sm text-brand">Props</code> interface extending
		the matching HTML attributes, <code class="font-mono text-sm text-brand">class</code> merged
		last so callers can override, and <code class="font-mono text-sm text-brand">...rest</code> spread
		onto the root element. The props and the behaviour must match across styles; the markup and the classes
		are free to differ completely.
	</p>
	<CodeBlock code={code.newComponent} label="src/lib/styles/matte/Callout.svelte" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Take colours from the tone maps, never as raw hex. Any user-visible string the component renders
		on its own — a label, an <code class="font-mono text-brand">aria-label</code>, an empty-state
		line — is written inline in English, and exposed as a prop when a caller would plausibly want to
		change it.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">4. A demo</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Write it once, against <code class="font-mono text-sm text-brand">matte</code>. It is rendered
		live on the component's page <em>and</em> shown as the code sample, so the two can never drift
		apart. <code class="font-mono text-sm text-brand">bun run demos</code> copies it into every
		other style with the import path rewritten — which is why the
		<code class="font-mono text-sm text-brand">/paper</code> page really mounts paper's component rather
		than repainting matte's.
	</p>
	<CodeBlock code={code.newDemo} label="src/site/demos/callout.svelte" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">5. Regenerate</h2>
	<CodeBlock code={code.newBuild} label="terminal" />
	<p class="font-sans leading-relaxed text-text-secondary">
		Every style's barrel is generated, so there is no export list to keep in step by hand. After
		this the component appears in the nav, the ⌘K palette and the CLI without further wiring.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Traps that fail silently</h2>

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

	<ui.Alert tone="success" title="The guards catch the structural half">
		<code class="font-mono">bun run lint</code> fails when a style is missing a component from the catalogue,
		and when the barrels, the exports map or the registry are stale — so a component cannot ship in one
		style and not another. The parity suite then mounts every style and asserts they behave the same.
		None of that can catch a missing Tailwind class; only looking at the result does.
	</ui.Alert>
</section>
