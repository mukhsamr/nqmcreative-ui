<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import Radio from './Radio.svelte';
	import { toneBorder, toneSurface, type Tone } from '../../core/tones.js';
	import { iconLg } from './icon.js';

	export interface RadioOption {
		value: string;
		label: string;
		/** Leading icon, 20px. Drawn in `boxed` mode only. */
		icon?: Snippet;
		description?: string;
		disabled?: boolean;
	}

	interface Props extends HTMLFieldsetAttributes {
		/** Bindable — the selected option's `value`. */
		value?: string;
		options?: RadioOption[];
		legend?: string;
		hint?: string;
		error?: string;
		required?: boolean;
		tone?: Tone;
		orientation?: 'vertical' | 'horizontal';
		/** Wraps each option in a bordered, clickable card. */
		boxed?: boolean;
		/** Pass your own `Radio`s instead of `options`. */
		children?: Snippet;
	}

	let {
		value = $bindable(''),
		options,
		legend,
		hint,
		error,
		required = false,
		tone = 'brand',
		orientation = 'vertical',
		boxed = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();
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
				{#if boxed}
					<label
						class="flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-4 shadow-xs transition-colors duration-150 ease-brand-out
							{value === option.value
							? `${toneBorder[tone]} ${toneSurface[tone]}`
							: 'border-hairline bg-bg hover:border-hairline-strong'}
							{option.disabled ? 'pointer-events-none opacity-50' : ''}"
					>
						{#if option.icon}
							<span class={iconLg}>{@render option.icon()}</span>
						{/if}
						<Radio
							bind:group={value}
							value={option.value}
							label={option.label}
							description={option.description}
							disabled={option.disabled}
							{tone}
						/>
					</label>
				{:else}
					<Radio
						bind:group={value}
						value={option.value}
						label={option.label}
						description={option.description}
						disabled={option.disabled}
						{tone}
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
