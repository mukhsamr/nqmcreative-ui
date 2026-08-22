<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneText, type Tone } from '../../core/tones.js';

	export type StatTrend = 'up' | 'down' | 'flat';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		label: string;
		value: string | number;
		/** Secondary figure, e.g. `'+12.4%'`. */
		delta?: string;
		trend?: StatTrend;
		hint?: string;
		/** Colour of the value itself. Leave unset for plain `text`. */
		tone?: Tone;
	}

	let {
		label,
		value,
		delta,
		trend = 'flat',
		hint,
		tone,
		class: className = '',
		...rest
	}: Props = $props();

	const trendTone: Record<StatTrend, Tone> = { up: 'success', down: 'danger', flat: 'neutral' };
	const trendGlyph: Record<StatTrend, string> = { up: '↑', down: '↓', flat: '→' };
</script>

<div class="flex flex-col gap-1 font-sans {className}" {...rest}>
	<span class="font-mono text-xs tracking-wide text-text-muted uppercase">{label}</span>
	<div class="flex items-baseline gap-2">
		<span
			class="font-heading text-3xl font-medium tracking-tight {tone ? toneText[tone] : 'text-text'}"
		>
			{value}
		</span>
		{#if delta}
			<span class="font-mono text-xs {toneText[trendTone[trend]]}">
				{trendGlyph[trend]}
				{delta}
			</span>
		{/if}
	</div>
	{#if hint}<span class="text-sm text-text-muted">{hint}</span>{/if}
</div>
