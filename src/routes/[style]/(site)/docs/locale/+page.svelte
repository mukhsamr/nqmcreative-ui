<script lang="ts">
	import { UI } from '$site/ui.js';
	import CodeBlock from '$site/CodeBlock.svelte';
	import * as code from '$site/snippets.js';
	import { enUS, idID } from '$lib/core/locale.svelte.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);

	let lang = $state('id');
	let page = $state(3);
</script>

<svelte:head>
	<title>Locale — nqm.ui</title>
	<meta name="description" content="Every built-in string, in one object you can override." />
</svelte:head>

<header class="flex flex-col gap-3">
	<h1 class="font-heading text-3xl font-medium tracking-tight">Locale</h1>
	<p class="font-sans text-lg leading-relaxed text-text-secondary">
		Every string a component renders on its own — ARIA names, <em>No data</em>, the words inside a
		rejected-file message — comes from one object. Nothing is hardcoded inside a component.
	</p>
</header>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">One global locale</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The common case. Call it once, at start-up.
	</p>
	<CodeBlock code={code.localeGlobal} label="src/routes/+layout.svelte" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Or scoped to a subtree</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The right choice under SSR, where module state is shared between requests.
	</p>
	<CodeBlock code={code.localeProvider} label="+layout.svelte" />

	<div class="flex flex-col gap-4 border border-hairline p-6">
		<ui.SegmentedControl
			bind:value={lang}
			size="sm"
			label="Language"
			options={[
				{ value: 'en', label: 'EN' },
				{ value: 'id', label: 'ID' }
			]}
		/>
		<ui.LocaleProvider locale={lang === 'id' ? idID : enUS}>
			<ui.Pagination bind:page total={12} />
			<ui.Table columns={[{ key: 'a', label: 'Kosong' }]} rows={[]} />
		</ui.LocaleProvider>
		<p class="font-mono text-xs text-text-muted">
			the empty-table text and the arrows' labels follow the switch
		</p>
	</div>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Just a few keys</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Pass a partial — anything you leave out keeps its English default.
	</p>
	<CodeBlock code={code.localePartial} label="anywhere" />
	<ui.Alert tone="info" title="Precedence">
		Per-instance prop → provider → global → <code class="font-mono">enUS</code>. So
		<code class="font-mono">&lt;Table empty="…" /&gt;</code> still wins over everything.
	</ui.Alert>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		<code class="font-mono text-brand">enUS</code> and
		<code class="font-mono text-brand">idID</code>
		ship with the package. The locale also carries
		<code class="font-mono text-brand">dateLocale</code> and
		<code class="font-mono text-brand">dateFormat</code>, which is why switching to Indonesian also
		changes the calendar's month names and the date input's part order.
	</p>
</section>
