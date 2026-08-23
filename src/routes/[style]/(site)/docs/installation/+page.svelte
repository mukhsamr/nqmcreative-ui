<script lang="ts">
	import { UI } from '$site/ui.js';
	import CodeBlock from '$site/CodeBlock.svelte';
	import * as code from '$site/snippets.js';
	import { count, styles } from '$site/catalogue.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
</script>

<svelte:head>
	<title>Installation — nqm.ui</title>
	<meta
		name="description"
		content="Install @nqmcreative/ui, wire up Tailwind v4, render the first component."
	/>
</svelte:head>

<header class="flex flex-col gap-3">
	<h1 class="font-heading text-3xl font-medium tracking-tight">Installation</h1>
	<p class="font-sans text-lg leading-relaxed text-text-secondary">
		Published on npm as <code class="font-mono text-brand">@nqmcreative/ui</code>. One package, one
		install — then you pick a style, and that choice is what every import names.
	</p>
</header>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">First, pick a style</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Every style ships the same {count} components with the same props and the same behaviour. What changes
		is the look — and nothing else.
	</p>
	<div class="grid gap-4 sm:grid-cols-2">
		{#each styles as style (style.name)}
			<ui.Card variant="outline" eyebrow={style.name} title={style.title}>
				<p class="font-sans text-sm leading-relaxed text-text-secondary">{style.description}</p>
			</ui.Card>
		{/each}
	</div>
	<CodeBlock code={code.noRoot} label="the import names the style" />
	<ui.Alert tone="info" title="There is no default">
		A root import resolves to nothing on purpose. Picking a style by accident — and shipping it — is
		the one mistake this layout exists to prevent.
	</ui.Alert>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">The fast path</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Four commands from nothing to a running app:
	</p>
	<CodeBlock code={code.scaffold} label="terminal" />
	<p class="font-sans leading-relaxed text-text-secondary">
		Then let the CLI do the wiring — it writes <code class="font-mono text-sm text-brand"
			>app.css</code
		>, patches <code class="font-mono text-sm text-brand">app.html</code>, and adds the CSS import
		to your root layout:
	</p>
	<CodeBlock code={code.cliInit} label="terminal" />
	<p class="font-sans leading-relaxed text-text-secondary">
		It will not rewrite your Vite config — it prints the two lines to paste. Every write is
		idempotent, so running it twice changes nothing. Add
		<code class="font-mono text-sm text-brand">--dry-run</code> to see what it would touch.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Or by hand</h2>

	<h3 class="font-sans text-sm font-medium text-text">1. Install</h3>
	<CodeBlock code={code.install} label="terminal" />

	<h3 class="pt-2 font-sans text-sm font-medium text-text">2. The Tailwind plugin</h3>
	<CodeBlock code={code.viteConfig} label="vite.config.ts" />

	<h3 class="pt-2 font-sans text-sm font-medium text-text">3. The entry CSS</h3>
	<CodeBlock code={code.appCss} label="src/app.css — matte" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Import exactly one style's tokens. They all define the same variable names, so two at once would
		fight over every colour.
	</p>
	<CodeBlock code={code.appCssPaper} label="src/app.css — paper" />
	<ui.Alert tone="warning" title="The @source line is not optional">
		Without it every component renders unstyled, with no error anywhere. Tailwind v4 skips
		node_modules, so it never sees the class names that live inside the package. Point it at the
		style you actually import — scanning the others only slows the build. Adjust the path to
		wherever node_modules sits relative to that CSS file.
	</ui.Alert>

	<h3 class="pt-2 font-sans text-sm font-medium text-text">4. Import the CSS once</h3>
	<CodeBlock code={code.layout} label="src/routes/+layout.svelte" />

	<h3 class="pt-2 font-sans text-sm font-medium text-text">
		5. Fonts and theme, before first paint
	</h3>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Every style ships a <code class="font-mono text-brand">fonts.css</code>, so the preconnect is
		worth having whichever you pick — matte loads Sora, Work Sans and JetBrains Mono, paper one
		variable file, sprout two. Skip the import and the tokens fall back to the system stack with no
		error anywhere.
	</p>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Both go in <code class="font-mono text-brand">src/app.html</code>, above
		<code class="font-mono text-brand">%sveltekit.head%</code>. Plain HTML rather than
		<code class="font-mono text-brand">&lt;svelte:head&gt;</code>, because Svelte parses a bare
		<code class="font-mono text-brand">crossorigin</code> attribute as boolean
		<code class="font-mono text-brand">true</code> and svelte-check rejects it.
	</p>
	<CodeBlock code={code.appHtml} label="src/app.html" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Using a component</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The style barrel is the usual way in — one import line for the whole app.
	</p>
	<CodeBlock code={code.usage} label="+page.svelte" />
	<p class="font-sans leading-relaxed text-text-secondary">
		Each component also has its own subpath: the style, then the file name in kebab-case, so
		<code class="font-mono text-sm text-brand">AvatarGroup</code> is
		<code class="font-mono text-sm text-brand">@nqmcreative/ui/matte/avatar-group</code>.
	</p>
	<CodeBlock code={code.subpaths} label="either way" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Both produce the same bundle — measured on one app, barrel and subpaths came out byte-identical,
		because the barrel tree-shakes. Subpaths are about being explicit, and they cut the module graph
		the bundler walks.
	</p>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Changing your mind later is a find-and-replace: the word after
		<code class="font-mono text-brand">@nqmcreative/ui/</code> is the only thing that differs.
	</p>
	<CodeBlock code={code.styleSwap} label="the whole migration" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">The CLI</h2>
	<CodeBlock code={code.cliOther} label="terminal" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		<code class="font-mono text-brand">add</code> is a convenience, not an installer: after
		<code class="font-mono text-brand">bun add</code> the whole library is already there, and a component
		pulls in whatever it renders internally. It writes the import line and tells you what comes along.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Updating</h2>
	<CodeBlock code={code.update} label="terminal" />
</section>
