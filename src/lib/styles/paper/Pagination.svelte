<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { focusRing, toneRing, toneSolid, type Tone } from '../../core/tones.js';
	import { useLocale } from '../../core/locale.svelte.js';
	import { pageRange } from '../../core/pagination.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
		/** Bindable, 1-based. */
		page?: number;
		/** Total number of pages. */
		total: number;
		/** Pages shown either side of the current one before collapsing to `…`. */
		siblings?: number;
		tone?: Tone;
		onchange?: (page: number) => void;
	}

	let {
		page = $bindable(1),
		total,
		siblings = 1,
		tone = 'brand',
		class: className = '',
		onchange,
		...rest
	}: Props = $props();

	const t = useLocale();

	const pages = $derived(pageRange(page, total, siblings));

	function go(next: number) {
		const clamped = Math.min(total, Math.max(1, next));
		if (clamped === page) return;
		page = clamped;
		onchange?.(clamped);
	}

	const cell = `inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 font-sans text-sm font-medium tabular-nums transition-colors duration-150 ease-brand-out disabled:opacity-40 disabled:pointer-events-none ${focusRing}`;
</script>

<nav aria-label={t.current.pagination} class="flex items-center gap-1 {className}" {...rest}>
	<button
		type="button"
		class="{cell} {toneRing[tone]} text-text-secondary hover:bg-bg-inset"
		disabled={page <= 1}
		aria-label={t.current.previousPage}
		onclick={() => go(page - 1)}
	>
		<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="m10 4-4 4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
		</svg>
	</button>

	{#each pages as item, i (`${item}-${i}`)}
		{#if item === '…'}
			<span class="{cell} text-text-muted">…</span>
		{:else}
			<button
				type="button"
				aria-current={item === page ? 'page' : undefined}
				class="{cell} {toneRing[tone]} {item === page
					? `${toneSolid[tone]} shadow-xs`
					: 'text-text-secondary hover:bg-bg-inset'}"
				onclick={() => go(item)}
			>
				{item}
			</button>
		{/if}
	{/each}

	<button
		type="button"
		class="{cell} {toneRing[tone]} text-text-secondary hover:bg-bg-inset"
		disabled={page >= total}
		aria-label={t.current.nextPage}
		onclick={() => go(page + 1)}
	>
		<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
		</svg>
	</button>
</nav>
