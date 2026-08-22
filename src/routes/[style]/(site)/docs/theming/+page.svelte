<script lang="ts">
	import { UI } from '$site/ui.js';
	import CodeBlock from '$site/CodeBlock.svelte';
	import * as code from '$site/snippets.js';
	import { TONES } from '$lib/core/tones.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
	const base = $derived(`/${data.style}`);

	const steps = [
		{
			tone: 'brand',
			base: 'bg-brand',
			hover: 'bg-brand-hover',
			light: 'bg-brand-light',
			border: 'bg-brand-border'
		},
		{
			tone: 'accent',
			base: 'bg-accent',
			hover: 'bg-accent-hover',
			light: 'bg-accent-light',
			border: 'bg-accent-border'
		},
		{
			tone: 'violet',
			base: 'bg-violet',
			hover: 'bg-violet-hover',
			light: 'bg-violet-light',
			border: 'bg-violet-border'
		},
		{
			tone: 'info',
			base: 'bg-info',
			hover: 'bg-info-hover',
			light: 'bg-info-light',
			border: 'bg-info-border'
		},
		{
			tone: 'success',
			base: 'bg-success',
			hover: 'bg-success-hover',
			light: 'bg-success-light',
			border: 'bg-success-border'
		},
		{
			tone: 'warning',
			base: 'bg-warning',
			hover: 'bg-warning-hover',
			light: 'bg-warning-light',
			border: 'bg-warning-border'
		},
		{
			tone: 'danger',
			base: 'bg-danger',
			hover: 'bg-danger-hover',
			light: 'bg-danger-light',
			border: 'bg-danger-border'
		},
		{
			tone: 'neutral',
			base: 'bg-neutral',
			hover: 'bg-neutral-hover',
			light: 'bg-neutral-light',
			border: 'bg-neutral-border'
		}
	];
</script>

<svelte:head>
	<title>Theming — nqm.ui</title>
	<meta name="description" content="Eight tones on one token system, plus light and dark." />
</svelte:head>

<header class="flex flex-col gap-3">
	<h1 class="font-heading text-3xl font-medium tracking-tight">Theming</h1>
	<p class="font-sans text-lg leading-relaxed text-text-secondary">
		Nothing in a component says <code class="font-mono text-brand">dark:</code>, and nothing
		hardcodes a hex value. Every utility is built on tokens, so the whole system moves together.
	</p>
</header>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Eight tones</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Every tonal component takes the same <code class="font-mono text-sm text-brand">tone</code> prop.
	</p>
	<CodeBlock code={code.tonesUsage} label="anywhere" />
	<div class="flex flex-wrap items-center gap-2">
		{#each TONES as tone (tone)}
			<ui.Badge {tone} dot>{tone}</ui.Badge>
		{/each}
	</div>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Four steps each</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Base, hover, light (a tinted surface) and border. Every one is a Tailwind utility:
		<code class="font-mono text-sm text-brand">bg-accent</code>,
		<code class="font-mono text-sm text-brand">hover:bg-accent-hover</code>,
		<code class="font-mono text-sm text-brand">bg-accent-light</code>,
		<code class="font-mono text-sm text-brand">border-accent-border</code>.
	</p>
	<div class="flex flex-col gap-px border border-hairline bg-hairline">
		{#each steps as row (row.tone)}
			<div class="flex items-center gap-4 bg-bg px-4 py-2">
				<span class="w-20 shrink-0 font-mono text-xs text-text-secondary">{row.tone}</span>
				<div class="flex h-6 flex-1 items-stretch">
					<span class="flex-1 {row.base}"></span>
					<span class="flex-1 {row.hover}"></span>
					<span class="flex-1 {row.light}"></span>
					<span class="flex-1 {row.border}"></span>
				</div>
			</div>
		{/each}
	</div>
	<CodeBlock code={code.themeTokens} label="matte/theme.css" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		The token <em>names</em> are the contract every style fills in — core and all 65 components are
		written against them, so a style only ever changes the values. That is also why exactly one
		style's <code class="font-mono text-brand">theme.css</code> may be imported: two would fight over
		every colour.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Making it yours</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Redeclare any token after importing the style's theme. Nothing else has to change — every
		component reading <code class="font-mono text-sm text-brand">brand</code> follows, in whichever style
		you picked.
	</p>
	<CodeBlock code={code.themeOverride} label="src/app.css" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		If you find yourself overriding most of the palette, that is a new style rather than a theme
		override — copy a style folder and change its markup too.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Light and dark</h2>
	<p class="font-sans leading-relaxed text-text-secondary">The root element decides:</p>
	<div class="overflow-x-auto border border-hairline">
		<table class="w-full border-collapse font-sans text-sm">
			<thead>
				<tr class="border-b border-hairline bg-bg-alt">
					<th class="px-4 py-2 text-left font-mono text-xs font-medium text-text-muted uppercase"
						>root</th
					>
					<th class="px-4 py-2 text-left font-mono text-xs font-medium text-text-muted uppercase"
						>result</th
					>
				</tr>
			</thead>
			<tbody class="text-text-secondary">
				<tr class="border-b border-hairline">
					<td class="px-4 py-2 font-mono text-xs">&lt;html class="dark"&gt;</td>
					<td class="px-4 py-2">dark, explicitly chosen</td>
				</tr>
				<tr class="border-b border-hairline">
					<td class="px-4 py-2 font-mono text-xs">&lt;html class="light"&gt;</td>
					<td class="px-4 py-2">light, explicitly chosen</td>
				</tr>
				<tr>
					<td class="px-4 py-2 font-mono text-xs">&lt;html&gt;</td>
					<td class="px-4 py-2">follows the OS preference</td>
				</tr>
			</tbody>
		</table>
	</div>
	<p class="font-sans leading-relaxed text-text-secondary">
		<code class="font-mono text-sm text-brand">ThemeToggle</code> writes that class and remembers
		the choice under <code class="font-mono text-sm text-brand">nqm-theme</code>:
	</p>
	<div class="flex flex-wrap items-center gap-5 border border-hairline p-6">
		<ui.ThemeToggle />
		<ui.ThemeToggle variant="segmented" />
	</div>
	<CodeBlock code={code.themeToggle} label="anywhere" />
	<ui.Alert tone="info" title="One light frame on first load">
		The class is applied after hydration, so someone who chose dark sees a light flash. The inline
		script in <code class="font-mono">app.html</code> from the installation page prevents it — and its
		key has to match what ThemeToggle writes.
	</ui.Alert>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">In your own components</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Import the tone maps rather than writing colour classes by hand.
	</p>
	<CodeBlock code={code.toneMaps} label="MyThing.svelte" />
	<ui.Alert tone="danger" title="Never interpolate a class name">
		Tailwind only sees literal strings in your source. A constructed class silently produces no CSS.
	</ui.Alert>
	<CodeBlock code={code.toneRule} label="the trap" />
	<div class="flex flex-wrap gap-3 pt-2">
		<ui.Button href="{base}/docs/adding-components" variant="soft">Adding a component →</ui.Button>
	</div>
</section>
