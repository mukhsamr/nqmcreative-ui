<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneHoverText, type Tone } from '../../core/tones.js';
	import { useLocale } from '../../core/locale.svelte.js';
	import { iconMd } from './icon.js';

	export interface BreadcrumbItem {
		label: string;
		href?: string;
		/** Leading icon — a home mark on the first crumb, say. */
		icon?: Snippet;
	}

	interface Props extends HTMLAttributes<HTMLElement> {
		items: BreadcrumbItem[];
		separator?: string;
		tone?: Tone;
	}

	let { items, separator = '/', tone = 'brand', class: className = '', ...rest }: Props = $props();

	const t = useLocale();
</script>

<nav aria-label={t.current.breadcrumb} class="font-sans text-sm {className}" {...rest}>
	<ol class="flex flex-wrap items-center gap-1.5">
		{#each items as item, i (item.label)}
			<li class="flex items-center gap-1.5">
				{#if i > 0}
					<span class="text-hairline-strong select-none" aria-hidden="true">{separator}</span>
				{/if}
				{#if item.href && i < items.length - 1}
					<a
						href={item.href}
						class="inline-flex items-center gap-1.5 rounded px-1 py-0.5 text-text-muted transition-colors duration-150 ease-brand-out hover:bg-bg-inset {toneHoverText[
							tone
						]}"
					>
						{#if item.icon}<span class={iconMd}>{@render item.icon()}</span>{/if}{item.label}
					</a>
				{:else}
					<span
						class="inline-flex items-center gap-1.5 px-1 py-0.5 font-medium text-text"
						aria-current={i === items.length - 1 ? 'page' : undefined}
					>
						{#if item.icon}<span class={iconMd}>{@render item.icon()}</span>{/if}{item.label}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
