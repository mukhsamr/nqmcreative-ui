<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { toneText, type Tone } from '../../core/tones.js';
	import { percentOf } from '../../core/number.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'min' | 'max'> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		tone?: Tone;
		label?: string;
		/** Prints the current value on the right of the label row. */
		showValue?: boolean;
		/** Appended to the printed value, e.g. `'%'`. */
		unit?: string;
		/** Tick labels under the track — usually just `[min, max]`. */
		marks?: (number | string)[];
	}

	let {
		value = $bindable(50),
		min = 0,
		max = 100,
		step = 1,
		tone = 'brand',
		label,
		showValue = false,
		unit = '',
		marks,
		disabled = false,
		class: className = '',
		...rest
	}: Props = $props();

	const pct = $derived(percentOf(value, min, max));

	// The filled part of the track and the thumb both paint with `currentColor`,
	// so a single tone class on the input drives every vendor pseudo-element.
	// The gradient classes below are spelled out twice on purpose: Tailwind only
	// sees literal class strings, so a shared JS constant would produce nothing.
</script>

<div class="flex w-full flex-col gap-2 {disabled ? 'opacity-50' : ''} {className}">
	{#if label || showValue}
		<div class="flex items-baseline justify-between gap-4 font-sans text-sm">
			{#if label}<span class="text-text-secondary">{label}</span>{/if}
			{#if showValue}
				<span class="text-sm font-medium tabular-nums {toneText[tone]}">{value}{unit}</span>
			{/if}
		</div>
	{/if}

	<input
		type="range"
		bind:value
		{min}
		{max}
		{step}
		{disabled}
		aria-label={label}
		style="--pct:{pct}%"
		class="h-5 w-full cursor-pointer appearance-none bg-transparent focus:outline-none disabled:cursor-not-allowed
			{toneText[tone]}
			focus-visible:outline-2 focus-visible:outline-offset-4
			[&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full
			[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-bg [&::-moz-range-thumb]:bg-current [&::-moz-range-thumb]:shadow-sm [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-[linear-gradient(to_right,currentColor_var(--pct),var(--color-bg-inset)_var(--pct))] [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[linear-gradient(to_right,currentColor_var(--pct),var(--color-bg-inset)_var(--pct))]
			[&::-webkit-slider-thumb]:-mt-[5px] [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2
			[&::-webkit-slider-thumb]:border-bg [&::-webkit-slider-thumb]:bg-current [&::-webkit-slider-thumb]:shadow-sm"
		{...rest}
	/>

	{#if marks?.length}
		<div class="flex justify-between text-[11px] text-text-muted tabular-nums">
			{#each marks as mark (mark)}
				<span>{mark}</span>
			{/each}
		</div>
	{/if}
</div>
