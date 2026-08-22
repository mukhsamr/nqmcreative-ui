<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { toneFocusWithinBorder, type Tone } from '../../core/tones.js';
	import { useLocale } from '../../core/locale.svelte.js';
	import { clampToStep } from '../../core/number.js';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'type' | 'value' | 'min' | 'max'> {
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		tone?: Tone;
		invalid?: boolean;
		/** Short unit rendered inside the field, e.g. `'px'` or `'%'`. */
		unit?: string;
	}

	let {
		value = $bindable(0),
		min = -Infinity,
		max = Infinity,
		step = 1,
		tone = 'brand',
		invalid = false,
		unit,
		disabled = false,
		class: className = '',
		...rest
	}: Props = $props();

	const t = useLocale();

	const clamp = (next: number) => clampToStep(next, min, max, step);

	function nudge(direction: 1 | -1) {
		value = clamp(value + direction * step);
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			nudge(1);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			nudge(-1);
		}
	}

	const stepper =
		'flex size-8 shrink-0 items-center justify-center text-text-secondary transition-colors duration-150 hover:bg-bg-inset hover:text-text disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';
</script>

<span
	class="inline-flex w-full items-center border bg-bg pr-1 pl-4 transition-colors duration-150 ease-brand-out
		{invalid ? 'border-danger' : `border-hairline ${toneFocusWithinBorder[tone]}`}
		{disabled ? 'pointer-events-none opacity-50' : ''} {className}"
>
	<input
		type="number"
		{min}
		{max}
		{step}
		{disabled}
		{value}
		oninput={(event) => (value = clamp(event.currentTarget.valueAsNumber))}
		onkeydown={onKeydown}
		aria-invalid={invalid ? 'true' : undefined}
		class="h-11 w-full min-w-0 [appearance:textfield] bg-transparent font-sans text-[15px] text-text tabular-nums placeholder:text-text-muted focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
		{...rest}
	/>
	{#if unit}
		<span class="shrink-0 px-2 font-mono text-xs text-text-muted">{unit}</span>
	{/if}
	<button
		type="button"
		class={stepper}
		onclick={() => nudge(-1)}
		disabled={disabled || value <= min}
		aria-label={t.current.decrease}
	>
		<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<path d="M2.5 7h9" stroke="currentColor" stroke-width="1.5" />
		</svg>
	</button>
	<button
		type="button"
		class={stepper}
		onclick={() => nudge(1)}
		disabled={disabled || value >= max}
		aria-label={t.current.increase}
	>
		<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<path d="M7 2.5v9M2.5 7h9" stroke="currentColor" stroke-width="1.5" />
		</svg>
	</button>
</span>
