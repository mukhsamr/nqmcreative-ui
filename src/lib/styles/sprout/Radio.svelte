<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { peerFocusRing, tonePeerChecked, tonePeerFocus, type Tone } from '../../core/tones.js';
	import { edge } from './lift.js';

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

	const uid = $props.id();
</script>

<div
	class="inline-block font-sans text-sm {disabled
		? 'pointer-events-none opacity-50'
		: ''} {className}"
>
	<label class="group inline-flex items-start gap-2.5 {disabled ? '' : 'cursor-pointer'}">
		<input
			type="radio"
			bind:group
			{value}
			{disabled}
			aria-describedby={description ? `${uid}-description` : undefined}
			class="peer sr-only"
			{...rest}
		/>
		<span
			class="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border border-hairline-strong bg-bg {edge} transition-colors duration-150 ease-brand-out
			{tonePeerChecked[tone]} {peerFocusRing} {tonePeerFocus[tone]}"
			aria-hidden="true"
		>
			<span
				class="size-1.5 rounded-full bg-text-inverse opacity-0 transition-opacity duration-150 group-has-[:checked]:opacity-100"
			></span>
		</span>
		{#if label || children}
			<span class="flex flex-col gap-0.5">
				{#if children}
					{@render children()}
				{:else if label}
					<span class="leading-snug text-text">{label}</span>
				{/if}
			</span>
		{/if}
	</label>
	{#if description}
		<!-- ponytail: the indent tracks the 18px dot plus the label's gap; move one, move both. -->
		<span
			id="{uid}-description"
			class="mt-0.5 block pl-[28px] text-[13px] leading-snug text-text-muted"
		>
			{description}
		</span>
	{/if}
</div>
