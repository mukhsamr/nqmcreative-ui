<script lang="ts">
	import CodeBlock from '$site/CodeBlock.svelte';
	import { UI, type StyleName } from '$site/ui.js';

	interface Tab {
		value: string;
		label: string;
		code: string;
	}

	interface Props {
		/** Which style draws the tab strip — the page is written in one. */
		style: StyleName;
		tabs: Tab[];
		/** Header strip of the code block under the tabs. */
		label?: string;
	}

	let { style, tabs, label }: Props = $props();

	const ui = $derived(UI[style]);

	// The chosen tab is remembered per page only. Persisting a package manager
	// across the site would be nicer, but it is a preference, not a route, and
	// this page is prerendered. Empty means "whatever comes first", so a page
	// that swaps its tabs out never points at one that has gone.
	let active = $state('');

	const current = $derived(tabs.find((tab) => tab.value === active) ?? tabs[0]);
</script>

<div class="flex flex-col gap-3">
	<ui.Tabs
		value={current.value}
		onchange={(value) => (active = value)}
		variant="segmented"
		items={tabs.map(({ value, label: text }) => ({ value, label: text }))}
		class="self-start"
	/>
	<div role="tabpanel">
		<CodeBlock code={current.code} label={label ?? current.label} />
	</div>
</div>
