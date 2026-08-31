<script lang="ts">
	import { UI } from '$site/ui.js';
	import CodeBlock from '$site/CodeBlock.svelte';
	import CodeTabs from '$site/CodeTabs.svelte';
	import * as code from '$site/snippets.js';
	import { count, styles } from '$site/catalogue.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);

	const updateTabs = [
		{ value: 'npm', label: 'npm', code: 'npm install @nqmcreative/ui@latest' },
		{ value: 'pnpm', label: 'pnpm', code: 'pnpm update @nqmcreative/ui --latest' },
		{ value: 'bun', label: 'bun', code: 'bun update @nqmcreative/ui' },
		{ value: 'yarn', label: 'yarn', code: 'yarn up @nqmcreative/ui' }
	];
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
		Then let the CLI do the wiring — it writes the entry
		<code class="font-mono text-sm text-brand">app.css</code>, patches the document
		<code class="font-mono text-sm text-brand">&lt;head&gt;</code>, and makes sure that CSS is
		loaded once:
	</p>
	<CodeBlock code={code.cliInit} label="terminal" />
	<p class="font-sans leading-relaxed text-text-secondary">
		It recognises SvelteKit, a plain Vite app and Laravel, and wires whichever set of files that one
		has. It will not rewrite your Vite config — it prints the two lines to paste. Every write is
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
		worth having whichever you pick — Work Sans sets running text in all three, and the headings are
		Sora in matte, Plus Jakarta Sans in paper, Fredoka in sprout. Skip the import and the tokens
		fall back to the system stack with no error anywhere.
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
	<h2 class="font-heading text-xl font-medium tracking-tight">Outside SvelteKit</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Nothing in the library imports <code class="font-mono text-sm text-brand">$app/*</code>,
		<code class="font-mono text-sm text-brand">$env/*</code> or
		<code class="font-mono text-sm text-brand">@sveltejs/kit</code>. The only peer dependency is
		<code class="font-mono text-sm text-brand">svelte ^5</code>, and every DOM call sits inside an
		action or an effect — so a plain Vite app works, and so does Laravel with Vite as its front end.
		<code class="font-mono text-sm text-brand">nqm-ui init</code> recognises all three and wires the files
		that project shape actually has.
	</p>
	<ui.Alert tone="info" title="One extra dependency out here">
		The components ship as <code class="font-mono">.svelte</code> source, published under a
		<code class="font-mono">svelte</code> export condition.
		<code class="font-mono">@sveltejs/vite-plugin-svelte</code> is what resolves that condition and compiles
		them. SvelteKit brings it along; everywhere else it is an install.
	</ui.Alert>

	<h3 class="pt-2 font-sans text-sm font-medium text-text">Svelte + Vite</h3>
	<CodeBlock code={code.viteScaffold} label="terminal" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		<code class="font-mono text-brand">init</code> writes
		<code class="font-mono text-brand">src/app.css</code>, patches the
		<code class="font-mono text-brand">&lt;head&gt;</code> in
		<code class="font-mono text-brand">index.html</code>, and puts the CSS import at the top of
		<code class="font-mono text-brand">src/main.ts</code>. The Vite config is the one thing it
		prints rather than rewrites.
	</p>
	<CodeBlock code={code.viteConfigPlain} label="vite.config.ts" />
	<CodeBlock code={code.viteEntry} label="src/main.ts" />

	<h3 class="pt-2 font-sans text-sm font-medium text-text">Laravel</h3>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Vite is already how Laravel builds its front end, so Svelte and this package are the only
		additions. Blade renders the shell; Svelte takes the node it is handed.
	</p>
	<CodeBlock code={code.laravelInstall} label="terminal" />
	<CodeBlock code={code.laravelViteConfig} label="vite.config.js" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		The entry CSS is <code class="font-mono text-brand">resources/css/app.css</code>, two levels
		below the project root — so
		<code class="font-mono text-brand">@source</code> walks two up rather than one.
	</p>
	<CodeBlock code={code.laravelCss} label="resources/css/app.css — matte" />
	<ui.Alert tone="warning" title="Point Tailwind at your own markup too">
		Blade templates and Svelte islands sit outside
		<code class="font-mono">resources/css</code>, so the two
		<code class="font-mono">@source</code> lines below the package's are not optional either — without
		them the classes you write yourself go missing exactly the way the package's would.
	</ui.Alert>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Nothing imports that CSS from JavaScript: the
		<code class="font-mono text-brand">@vite</code> directive hands the path to Vite, and the
		<code class="font-mono text-brand">&lt;head&gt;</code> it sits in is the one
		<code class="font-mono text-brand">init</code> patches with the preconnect and the no-flash theme
		script.
	</p>
	<CodeBlock code={code.laravelBlade} label="resources/views/app.blade.php" />
	<CodeBlock code={code.laravelMount} label="resources/js/app.js" />
	<CodeBlock code={code.laravelIsland} label="resources/js/App.svelte" />
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
	<p class="font-sans leading-relaxed text-text-secondary">
		Nothing was copied into your project: <code class="font-mono text-brand">add</code> printed an
		import, and the components themselves live in
		<code class="font-mono text-brand">node_modules</code>. So upgrading the package is the whole
		job — every Button in your app is the new Button on the next build.
	</p>
	<CodeTabs style={data.style} tabs={updateTabs} label="terminal" />

	<h3 class="pt-2 font-sans text-sm font-medium text-text">Then rewrite the wiring</h3>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		<code class="font-mono text-brand">nqm-ui update</code> is
		<code class="font-mono text-brand">init</code> under the name you reach for afterwards. It
		overwrites the lines it owns in
		<code class="font-mono text-brand">src/app.css</code> — the
		<code class="font-mono text-brand">tailwindcss</code> import, this style's
		<code class="font-mono text-brand">theme.css</code> and
		<code class="font-mono text-brand">fonts.css</code>, and the
		<code class="font-mono text-brand">@source</code> line — and leaves everything below them alone,
		your own <code class="font-mono text-brand">@theme</code> overrides included.
	</p>
	<CodeBlock code={code.cliUpdate} label="terminal" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Run it after every upgrade, not just when something looks wrong. If a release changes which
		files a style imports, or where <code class="font-mono text-brand">@source</code> has to point, the
		old lines would sit there resolving to nothing and your components would come up unstyled — which
		reads like a broken install rather than a stale config.
	</p>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Leave <code class="font-mono text-brand">--style</code> off and it asks, listing the three and taking
		a number or a name.
	</p>
	<CodeBlock code={code.cliUpdateAsk} label="terminal" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Restart the dev server afterwards so Tailwind rescans, and delete
		<code class="font-mono text-brand">node_modules/.vite</code> if class names still look like the old
		release.
	</p>

	<h3 class="pt-2 font-sans text-sm font-medium text-text">What an upgrade can change</h3>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Looks ride along without asking: a release that tightens a style's control scale moves every
		button in your app on the next build. Prop names, types and behaviour are the contract and only
		move on a major. If your layout depends on a control being an exact height, pin the version and
		read the release notes before moving.
	</p>
</section>
