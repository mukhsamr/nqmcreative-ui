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
	const trendGlyph: Record<StatTrend, string> = { up: '↑', down: '↓', flat: '→' };
</script>

<div class="flex flex-col gap-1 font-sans {className}" {...rest}>
	<span class="flex items-center gap-2 text-sm font-medium text-text-muted"
		>{#if icon}<span class={iconMd}>{@render icon()}</span>{/if}{label}</span
	>
	<div class="flex items-baseline gap-2">
		<span
			class="font-heading text-3xl font-semibold tracking-tight tabular-nums {tone
				? toneText[tone]
				: 'text-text'}"
		>
			{value}
		</span>
		{#if delta}
			<span class="text-sm font-medium {toneText[trendTone[trend]]}">
				{trendGlyph[trend]}
				{delta}
			</span>
		{/if}
	</div>
	{#if hint}<span class="text-sm text-text-muted">{hint}</span>{/if}
</div>
