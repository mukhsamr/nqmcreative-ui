<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneBorder, toneFill, toneSoft, toneText, type Tone } from '../../core/tones.js';

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
		/** Thicker border and a tinted header — for the plan you want chosen. */
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
	class="flex flex-col bg-bg {featured
		? `border-2 ${toneBorder[tone]}`
		: 'border border-hairline'} {className}"
	{...rest}
>
	<div class="flex flex-col gap-4 p-6 {featured ? toneSoft[tone] : ''}">
		<div class="flex items-start justify-between gap-3">
			<h3 class="font-heading text-lg font-medium tracking-tight {featured ? '' : 'text-text'}">
				{name}
			</h3>
			{#if badge}
				<span
					class="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wide {featured
						? `${toneFill[tone]} text-text-inverse`
						: toneSoft[tone]}"
				>
					{badge}
				</span>
			{/if}
		</div>

		<div class="flex items-baseline gap-1.5">
			<span
				class="font-heading text-4xl font-medium tracking-tight {featured
					? toneText[tone]
					: 'text-text'}"
			>
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
					<svg
						class="mt-0.5 size-4 shrink-0 {toneText[tone]}"
						viewBox="0 0 16 16"
						fill="none"
						aria-hidden="true"
					>
						<path d="m3 8 3.2 3.2L13 4.4" stroke="currentColor" stroke-width="1.6" />
					</svg>
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
