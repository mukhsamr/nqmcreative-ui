<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneFill, type Tone } from '../../core/tones.js';
	import { percentOf } from '../../core/number.js';

	export type ProgressSize = 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		value?: number;
		max?: number;
		tone?: Tone;
		size?: ProgressSize;
		label?: string;
		/** Prints the percentage on the right of the label row. */
		showValue?: boolean;
		/** Ignores `value` and runs a looping sweep. */
		indeterminate?: boolean;
	}

	let {
		value = 0,
		max = 100,
		tone = 'brand',
		size = 'md',
		label,
		showValue = false,
		indeterminate = false,
		class: className = '',
		...rest
	}: Props = $props();

	const sizes: Record<ProgressSize, string> = { sm: 'h-1', md: 'h-2', lg: 'h-3' };
	const pct = $derived(percentOf(value, 0, max));
</script>

<div class="flex w-full flex-col gap-2 {className}" {...rest}>
	{#if label || showValue}
		<div class="flex items-baseline justify-between gap-4 font-sans text-sm">
			{#if label}<span class="text-text-secondary">{label}</span>{/if}
			{#if showValue}<span class="font-mono text-xs text-text-muted">{Math.round(pct)}%</span>{/if}
		</div>
	{/if}
	<div
		role="progressbar"
		aria-valuenow={indeterminate ? undefined : Math.round(pct)}
		aria-valuemin={0}
		aria-valuemax={100}
		aria-label={label}
		class="w-full overflow-hidden bg-bg-inset {sizes[size]}"
	>
		<div
			class="h-full transition-[width] duration-300 ease-brand {toneFill[tone]}
				{indeterminate ? 'w-1/3 animate-pulse' : ''}"
			style={indeterminate ? undefined : `width:${pct}%`}
		></div>
	</div>
</div>
