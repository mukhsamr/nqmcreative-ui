<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneSoft, type Tone } from '../../core/tones.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		title: string;
		description?: string;
		tone?: Tone;
		/** Glyph inside the tinted circle. Defaults to a plain outline. */
		icon?: Snippet;
		/** Buttons or links under the copy. */
		action?: Snippet;
		/** Draws a dashed placeholder border around the block. */
		bordered?: boolean;
		children?: Snippet;
	}

	let {
		title,
		description,
		tone = 'neutral',
		icon,
		action,
		bordered = true,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<div
	class="flex flex-col items-center gap-4 rounded-[28px] px-6 py-12 text-center font-sans
		{bordered ? 'border border-dashed border-hairline-strong bg-bg-alt/50' : ''} {className}"
	{...rest}
>
	<span class="flex size-12 items-center justify-center rounded-full {toneSoft[tone]}">
		{#if icon}
			{@render icon()}
		{:else}
			<svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<rect
					x="3"
					y="3"
					width="14"
					height="14"
					rx="2.5"
					stroke="currentColor"
					stroke-width="1.5"
				/>
				<path
					d="M3 13.5 7 9.5l3 3 3-3 4 4"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		{/if}
	</span>
	<div class="flex flex-col gap-1.5">
		<p class="font-heading text-base font-semibold text-text">{title}</p>
		{#if description}
			<p class="max-w-sm text-sm leading-relaxed text-text-secondary">{description}</p>
		{/if}
	</div>
	{#if children}{@render children()}{/if}
	{#if action}
		<div class="flex flex-wrap items-center justify-center gap-3 pt-1">{@render action()}</div>
	{/if}
</div>
