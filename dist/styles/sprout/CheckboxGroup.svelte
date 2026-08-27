<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import Checkbox from './Checkbox.svelte';
	import { toneBorder, toneSurface, type Tone } from '../../core/tones.js';
	import { iconLg } from './icon.js';
	import { edge } from './lift.js';

	export interface CheckboxOption {
		value: string;
		label: string;
		/** Leading icon, 20px. Drawn in `boxed` mode only. */
		icon?: Snippet;
		description?: string;
		disabled?: boolean;
	}

	interface Props extends Omit<HTMLFieldsetAttributes, 'onchange'> {
		/** Bindable — the `value` of every checked option. */
		value?: string[];
		options?: CheckboxOption[];
		legend?: string;
		hint?: string;
		error?: string;
		required?: boolean;
		tone?: Tone;
		orientation?: 'vertical' | 'horizontal';
		/** Wraps each option in a bordered, clickable card. */
		boxed?: boolean;
		/** Cap on how many may be checked at once. `0` means no limit. */
		max?: number;
		onchange?: (value: string[]) => void;
		/** Pass your own `Checkbox`es instead of `options`. */
		children?: Snippet;
	}

	let {
		value = $bindable([]),
		options,
		legend,
		hint,
		error,
		required = false,
		tone = 'brand',
		orientation = 'vertical',
		boxed = false,
		max = 0,
		onchange,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const full = $derived(max > 0 && value.length >= max);

	function toggle(option: CheckboxOption) {
		value = value.includes(option.value)
			? value.filter((v) => v !== option.value)
			: [...value, option.value];
		onchange?.(value);
	}
</script>

<fieldset class="flex flex-col gap-3 border-0 p-0 {className}" {...rest}>
	{#if legend}
		<legend class="mb-1 font-sans text-sm font-medium text-text">
			{legend}
			{#if required}<span class="ml-0.5 text-danger" aria-hidden="true">*</span>{/if}
		</legend>
	{/if}

	<div class="flex gap-2.5 {orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'}">
		{#if options}
			{#each options as option (option.value)}
				{@const checked = value.includes(option.value)}
				{@const disabled = option.disabled || (full && !checked)}
				{#if boxed}
					<label
						class="flex flex-1 cursor-pointer items-start gap-3 rounded-[20px] border p-4 {edge} transition-colors duration-150 ease-brand-out
							{checked
							? `${toneBorder[tone]} ${toneSurface[tone]}`
							: 'border-hairline bg-bg hover:border-hairline-strong'}
							{disabled ? 'pointer-events-none opacity-50' : ''}"
					>
						{#if option.icon}
							<span class={iconLg}>{@render option.icon()}</span>
						{/if}
						<Checkbox
							{checked}
							{disabled}
							{tone}
							label={option.label}
							description={option.description}
							onchange={() => toggle(option)}
						/>
					</label>
				{:else}
					<Checkbox
						{checked}
						{disabled}
						{tone}
						label={option.label}
						description={option.description}
						onchange={() => toggle(option)}
					/>
				{/if}
			{/each}
		{:else if children}
			{@render children()}
		{/if}
	</div>

	{#if error}
		<p class="font-sans text-[13px] text-danger">{error}</p>
	{:else if hint}
		<p class="font-sans text-[13px] text-text-muted">{hint}</p>
	{/if}
</fieldset>
