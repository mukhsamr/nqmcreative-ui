<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { focusRing, toneFill, toneRing, type Tone } from '../../core/tones.js';
	import { edge } from './lift.js';

	export type SwitchSize = 'sm' | 'md';

	interface Props extends Omit<HTMLButtonAttributes, 'onclick' | 'onchange'> {
		checked?: boolean;
		label?: string;
		description?: string;
		tone?: Tone;
		size?: SwitchSize;
		onchange?: (checked: boolean) => void;
	}

	let {
		checked = $bindable(false),
		label,
		description,
		tone = 'brand',
		size = 'md',
		disabled = false,
		onchange,
		class: className = '',
		...rest
	}: Props = $props();

	const sizes: Record<SwitchSize, { track: string; thumb: string; travel: string }> = {
		sm: { track: 'h-5 w-9', thumb: 'size-4', travel: 'translate-x-4' },
		md: { track: 'h-6 w-11', thumb: 'size-5', travel: 'translate-x-5' }
	};

	const uid = $props.id();

	function toggle() {
		checked = !checked;
		onchange?.(checked);
	}
</script>

<div class="inline-flex items-start gap-3 {disabled ? 'opacity-50' : ''} {className}">
	<button
		type="button"
		role="switch"
		aria-checked={checked}
		aria-label={label}
		aria-describedby={description ? `${uid}-description` : undefined}
		{disabled}
		onclick={toggle}
		class="relative mt-0.5 inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-brand-out disabled:pointer-events-none
			{sizes[size].track} {checked ? toneFill[tone] : 'bg-hairline-strong'} {focusRing} {toneRing[tone]}"
		{...rest}
	>
		<span
			class="rounded-full bg-bg {edge} transition-transform duration-200 ease-brand-out
				{sizes[size].thumb} {checked ? sizes[size].travel : 'translate-x-0'}"
		></span>
	</button>
	{#if label || description}
		<span class="flex flex-col gap-0.5 font-sans text-sm">
			{#if label}<span class="leading-snug text-text">{label}</span>{/if}
			{#if description}
				<span id="{uid}-description" class="text-[13px] leading-snug text-text-muted"
					>{description}</span
				>
			{/if}
		</span>
	{/if}
</div>
