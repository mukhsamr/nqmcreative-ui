<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLSelectAttributes } from 'svelte/elements';
	import { toneFocusBorder, type Tone } from '../../core/tones.js';

	export interface SelectOption {
		value: string;
		label: string;
		disabled?: boolean;
	}

	interface Props extends HTMLSelectAttributes {
		value?: string;
		/** Data-driven options. Omit and pass `children` to write `<option>`s yourself. */
		options?: SelectOption[];
		placeholder?: string;
		tone?: Tone;
		invalid?: boolean;
		children?: Snippet;
	}

	let {
		value = $bindable(''),
		options,
		placeholder,
		tone = 'brand',
		invalid = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<span class="relative inline-flex w-full items-center">
	<select
		bind:value
		aria-invalid={invalid ? 'true' : undefined}
		class="h-10 w-full appearance-none rounded-md border bg-bg py-0 pr-9 pl-3 font-sans text-sm text-text shadow-xs transition-colors duration-150 ease-brand-out focus:outline-none disabled:pointer-events-none disabled:opacity-50
			{invalid ? 'border-danger' : `border-hairline-strong ${toneFocusBorder[tone]}`} {className}"
		{...rest}
	>
		{#if placeholder}
			<option value="" disabled>{placeholder}</option>
		{/if}
		{#if options}
			{#each options as option (option.value)}
				<option value={option.value} disabled={option.disabled}>{option.label}</option>
			{/each}
		{:else if children}
			{@render children()}
		{/if}
	</select>
	<svg
		class="pointer-events-none absolute right-3 size-4 text-text-muted"
		viewBox="0 0 16 16"
		fill="none"
		aria-hidden="true"
	>
		<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	</svg>
</span>
