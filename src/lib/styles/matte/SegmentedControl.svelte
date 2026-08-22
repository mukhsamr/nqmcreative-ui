<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { focusRing, toneRing, toneSoft, type Tone } from '../../core/tones.js';

	export interface SegmentOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	export type SegmentedSize = 'sm' | 'md';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		/** Bindable — the selected option's `value`. */
		value?: string;
		options: SegmentOption[];
		/** Submits with a form when set. */
		name?: string;
		size?: SegmentedSize;
		tone?: Tone;
		/** Spread the segments evenly across the full width. */
		fullWidth?: boolean;
		label?: string;
		disabled?: boolean;
		onchange?: (value: string) => void;
	}

	let {
		value = $bindable(''),
		options,
		name,
		size = 'md',
		tone = 'brand',
		fullWidth = false,
		label,
		disabled = false,
		class: className = '',
		onchange,
		...rest
	}: Props = $props();

	const sizes: Record<SegmentedSize, string> = {
		sm: 'h-8 px-3 text-[13px]',
		md: 'h-10 px-4 text-sm'
	};

	function select(option: SegmentOption) {
		if (option.disabled || disabled) return;
		value = option.value;
		onchange?.(option.value);
	}

	function onKeydown(event: KeyboardEvent) {
		const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const usable = options.filter((option) => !option.disabled);
		const index = usable.findIndex((option) => option.value === value);
		select(usable[(index + step + usable.length) % usable.length]);
	}
</script>

<div
	role="radiogroup"
	aria-label={label}
	onkeydown={onKeydown}
	class="inline-flex items-center border border-hairline bg-bg-alt p-1
		{fullWidth ? 'flex w-full *:flex-1' : ''}
		{disabled ? 'pointer-events-none opacity-50' : ''} {className}"
	{...rest}
>
	{#each options as option (option.value)}
		<button
			type="button"
			role="radio"
			aria-checked={value === option.value}
			disabled={option.disabled || disabled}
			tabindex={value === option.value ? 0 : -1}
			onclick={() => select(option)}
			class="inline-flex items-center justify-center font-sans whitespace-nowrap transition-colors duration-150 ease-brand-out disabled:pointer-events-none disabled:opacity-40
				{sizes[size]} {focusRing} {toneRing[tone]}
				{value === option.value ? `${toneSoft[tone]} font-medium` : 'text-text-secondary hover:text-text'}"
		>
			{option.label}
		</button>
	{/each}
	{#if name}<input type="hidden" {name} {value} />{/if}
</div>
