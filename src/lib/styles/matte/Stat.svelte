<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneText, type Tone } from '../../core/tones.js';
	import { iconMd } from './icon.js';

	export type StatTrend = 'up' | 'down' | 'flat';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		label: string;
		value: string | number;
		/** Secondary figure, e.g. `'+12.4%'`. */
		delta?: string;
		trend?: StatTrend;
		hint?: string;
		/** Leading icon on the label row. */
		icon?: Snippet;
		/** Colour of the value itself. Leave unset for plain `text`. */
		tone?: Tone;
	}

	let {
		label,
		value,
		delta,
		trend = 'flat',
		hint,
		icon,
		tone,
		class: className = '',
		...rest
	}: Props = $props();

	const trendTone: Record<StatTrend, Tone> = { up: 'success', down: 'danger', flat: 'neutral' };
	// Drawn rather than typed. `↑` renders in whatever face the reader's system
	// substitutes for it and is announced as "up arrow" or nothing at all, and
	// the colour beside it says nothing either — so the word ships with it.
	const trendPath: Record<StatTrend, string> = {
		up: 'M7 11V3.5M7 3l3.5 3.5M7 3 3.5 6.5',
		down: 'M7 3v7.5M7 11l3.5-3.5M7 11 3.5 7.5',
		flat: 'M3 7h7.5M11 7 7.5 3.5M11 7l-3.5 3.5'
	};
	const trendWord: Record<StatTrend, string> = { up: 'up', down: 'down', flat: 'no change' };
</script>

<div class="flex flex-col gap-1 font-sans {className}" {...rest}>
	<span class="flex items-center gap-2 font-mono text-xs tracking-wide text-text-muted uppercase"
		>{#if icon}<span class={iconMd}>{@render icon()}</span>{/if}{label}</span
	>
	<div class="flex items-baseline gap-2">
		<span
			class="font-heading text-3xl font-medium tracking-tight tabular-nums {tone
				? toneText[tone]
				: 'text-text'}"
		>
			{value}
		</span>
		{#if delta}
			<span class="font-mono text-xs {toneText[trendTone[trend]]}">
				<svg
					class="inline-block size-[1em] align-[-0.115em]"
					viewBox="0 0 14 14"
					fill="none"
					aria-hidden="true"
				>
					<path
						d={trendPath[trend]}
						stroke="currentColor"
						stroke-width="1.6"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span class="sr-only">{trendWord[trend]}</span>
				{delta}
			</span>
		{/if}
	</div>
	{#if hint}<span class="text-sm text-text-muted">{hint}</span>{/if}
</div>
