<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { peerFocusRing, tonePeerChecked, tonePeerFocus, type Tone } from '../../core/tones.js';

	interface Props extends Omit<HTMLInputAttributes, 'type' | 'size'> {
		checked?: boolean;
		/** Renders the dash state — visual only, `checked` stays false. */
		indeterminate?: boolean;
		label?: string;
		description?: string;
		tone?: Tone;
		children?: Snippet;
	}

	let {
		checked = $bindable(false),
		indeterminate = false,
		label,
		description,
		tone = 'brand',
		disabled = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const uid = $props.id();

	let el: HTMLInputElement | null = $state(null);

	$effect(() => {
		if (el) el.indeterminate = indeterminate;
	});
</script>

<div
	class="inline-block font-sans text-[15px] {disabled
		? 'pointer-events-none opacity-50'
		: ''} {className}"
>
	<label class="group inline-flex items-start gap-3 {disabled ? '' : 'cursor-pointer'}">
		<input
			bind:this={el}
			type="checkbox"
			bind:checked
			{disabled}
			aria-describedby={description ? `${uid}-description` : undefined}
			class="peer sr-only"
			{...rest}
		/>
		<span
			class="mt-0.5 flex size-[18px] shrink-0 items-center justify-center border border-hairline-strong bg-bg transition-colors duration-150 ease-brand-out
			{tonePeerChecked[tone]} {peerFocusRing} {tonePeerFocus[tone]}"
			aria-hidden="true"
		>
			{#if indeterminate}
				<span class="h-px w-2.5 bg-text-muted"></span>
			{:else}
				<svg
					class="size-3 text-text-inverse opacity-0 transition-opacity duration-150 group-has-[:checked]:opacity-100"
					viewBox="0 0 12 12"
					fill="none"
				>
					<path d="m2 6 2.6 2.6L10 3.2" stroke="currentColor" stroke-width="1.8" />
				</svg>
			{/if}
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
		<!-- ponytail: the indent tracks the 18px box plus the label's gap; move one, move both. -->
		<span
			id="{uid}-description"
			class="mt-0.5 block pl-[30px] text-sm leading-snug text-text-muted"
		>
			{description}
		</span>
	{/if}
</div>
