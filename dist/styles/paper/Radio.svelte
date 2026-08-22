<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { peerFocusRing, tonePeerChecked, tonePeerFocus, type Tone } from '../../core/tones.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size'> {
		/** Bind the same variable across a set of radios. */
		group?: string;
		value: string;
		label?: string;
		description?: string;
		tone?: Tone;
		children?: Snippet;
	}

	let {
		group = $bindable(''),
		value,
		label,
		description,
		tone = 'brand',
		disabled = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<label
	class="group inline-flex items-start gap-2.5 font-sans text-sm
		{disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer'} {className}"
>
	<input type="radio" bind:group {value} {disabled} class="peer sr-only" {...rest} />
	<span
		class="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-bg shadow-xs transition-colors duration-150 ease-brand-out
			{tonePeerChecked[tone]} {peerFocusRing} {tonePeerFocus[tone]}"
		aria-hidden="true"
	>
		<span
			class="size-1.5 rounded-full bg-text-inverse opacity-0 transition-opacity duration-150 group-has-[:checked]:opacity-100"
		></span>
	</span>
	{#if label || description || children}
		<span class="flex flex-col gap-0.5">
			{#if children}
				{@render children()}
			{:else if label}
				<span class="leading-snug text-text">{label}</span>
			{/if}
			{#if description}
				<span class="text-[13px] leading-snug text-text-muted">{description}</span>
			{/if}
		</span>
	{/if}
</label>
