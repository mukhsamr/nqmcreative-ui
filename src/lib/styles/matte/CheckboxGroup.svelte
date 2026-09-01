<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import Checkbox from './Checkbox.svelte';
	import type { Tone } from '../../core/tones.js';
	import { iconLg } from './icon.js';

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

	const uid = $props.id();
	// The group's own hint and error sit outside every control in it, so the
	// fieldset is what has to point at them.
	const messageId = $derived(error ? `${uid}-error` : hint ? `${uid}-hint` : undefined);

	const full = $derived(max > 0 && value.length >= max);

	function toggle(option: CheckboxOption) {
		value = value.includes(option.value)
			? value.filter((v) => v !== option.value)
			: [...value, option.value];
		onchange?.(value);
	}
</script>

<fieldset
	aria-describedby={messageId}
	class="flex flex-col gap-3 border-0 p-0 {className}"
	{...rest}
>
	{#if legend}
		<legend class="mb-1 font-sans text-sm font-medium text-text">
			{legend}
			{#if required}<span class="text-danger" aria-hidden="true">*</span><span class="sr-only"
					>(required)</span
				>{/if}
		</legend>
	{/if}

	<div class="flex gap-3 {orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'}">
		{#if options}
			{#each options as option (option.value)}
				{@const checked = value.includes(option.value)}
				{@const disabled = option.disabled || (full && !checked)}
				{#if boxed}
					<label
						class="flex flex-1 cursor-pointer items-start gap-3 border p-4 transition-colors duration-150 ease-brand-out
							{checked ? 'border-text bg-bg-alt' : 'border-hairline hover:border-hairline-strong'}
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
		<p id="{uid}-error" role="alert" class="font-sans text-sm text-danger">{error}</p>
	{:else if hint}
		<p id="{uid}-hint" class="font-sans text-sm text-text-muted">{hint}</p>
	{/if}
</fieldset>
