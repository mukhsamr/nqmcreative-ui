<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneHoverText, type Tone } from '../tones.js';
	import { useLocale } from '../locale.svelte.js';

	export interface BreadcrumbItem {
		label: string;
		href?: string;
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
	<ol class="flex flex-wrap items-center gap-2">
		{#each items as item, i (item.label)}
			<li class="flex items-center gap-2">
				{#if i > 0}
					<span class="text-text-muted select-none" aria-hidden="true">{separator}</span>
				{/if}
				{#if item.href && i < items.length - 1}
					<a
						href={item.href}
						class="text-text-secondary transition-colors duration-150 ease-brand-out {toneHoverText[
							tone
						]}"
					>
						{item.label}
					</a>
				{:else}
					<span class="text-text" aria-current={i === items.length - 1 ? 'page' : undefined}>
						{item.label}
					</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
