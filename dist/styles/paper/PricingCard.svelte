<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneBorder, toneSoft, toneSolid, type Tone } from '../../core/tones.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		name: string;
		/** Already formatted — the component does not do currency. */
		price: string;
		/** `/ month`, `per seat`, whatever follows the figure. */
		period?: string;
		description?: string;
		/** One line each. Rendered with a tick. */
		features?: string[];
		/** Pill in the top corner, e.g. "Most popular". */
		badge?: string;
		/** Ring, lift and a tinted header — for the plan you want chosen. */
		featured?: boolean;
		tone?: Tone;
		/** The button. */
		action?: Snippet;
		/** Extra content under the feature list. */
		children?: Snippet;
	}

	let {
		name,
		price,
		period,
		description,
		features = [],
		badge,
		featured = false,
		tone = 'brand',
		action,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<div
	class="flex flex-col rounded-xl bg-bg {featured
		? `border-2 shadow-lg ${toneBorder[tone]}`
		: 'border border-hairline shadow-xs'} {className}"
	{...rest}
>
	<div class="flex flex-col gap-4 p-6">
		<div class="flex items-start justify-between gap-3">
			<h3 class="font-heading text-base font-semibold text-text">{name}</h3>
			{#if badge}
				<span
					class="shrink-0 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-medium {featured
						? toneSolid[tone]
						: toneSoft[tone]}"
				>
					{badge}
				</span>
			{/if}
		</div>

		<div class="flex items-baseline gap-1.5">
			<span class="font-heading text-4xl font-semibold tracking-tight text-text tabular-nums">
				{price}
			</span>
			{#if period}
				<span class="font-sans text-sm text-text-muted">{period}</span>
			{/if}
		</div>

		{#if description}
			<p class="font-sans text-sm leading-relaxed text-text-secondary">{description}</p>
		{/if}
	</div>

	{#if features.length}
		<ul class="flex flex-1 flex-col gap-3 border-t border-hairline p-6">
			{#each features as feature (feature)}
				<li class="flex items-start gap-3 font-sans text-sm text-text-secondary">
					<span
						class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full {toneSoft[
							tone
						]}"
					>
						<svg class="size-2.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<path
								d="m3 8 3.2 3.2L13 4.4"
								stroke="currentColor"
								stroke-width="2.4"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</span>
					<span class="leading-snug">{feature}</span>
				</li>
			{/each}
		</ul>
	{/if}

	{#if children}
		<div class="px-6 pb-2">{@render children()}</div>
	{/if}

	{#if action}
		<div class="p-6 pt-2">{@render action()}</div>
	{/if}
</div>
