<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formatGrouped, parseGrouped } from '../../core/number.js';
	import type { Tone } from '../../core/tones.js';
	import Input, { type InputSize } from './Input.svelte';

	interface Props extends Omit<
		HTMLInputAttributes,
		'size' | 'prefix' | 'suffix' | 'value' | 'min' | 'max'
	> {
		/** Bindable amount. `null` is an empty field, which is not the same as 0. */
		value?: number | null;
		min?: number;
		max?: number;
		/** Thousands separator. */
		group?: string;
		/** Decimal separator. */
		decimal?: string;
		/** Decimal places the amount settles to when the field loses focus. */
		precision?: number;
		/** Leading mark — `Rp`, `$`, `€`. */
		currency?: string;
		/** Trailing mark instead, for the locales that write it that way. */
		unit?: string;
		size?: InputSize;
		tone?: Tone;
		invalid?: boolean;
		class?: string;
	}

	let {
		value = $bindable(null),
		min,
		max,
		group = ',',
		decimal = '.',
		precision = 2,
		currency,
		unit,
		size = 'md',
		tone = 'brand',
		invalid = false,
		disabled = false,
		class: className = '',
		...rest
	}: Props = $props();

	const options = $derived({ group, decimal, precision });

	/**
	 * What the field shows. Two states on purpose: grouped and padded while the
	 * caret is elsewhere, and exactly what was typed while it is not — grouping
	 * a number as it is typed moves the caret out from under the fingers.
	 */
	let text = $state('');
	let editing = $state(false);

	$effect(() => {
		if (editing) return;
		text = value === null || value === undefined ? '' : formatGrouped(value, options);
	});

	// Read off the element, not off `text`: the binding that feeds `text` has
	// not flushed yet when this fires, so it still holds the previous keystroke.
	function onInput(event: Event & { currentTarget: HTMLInputElement }) {
		const parsed = parseGrouped(event.currentTarget.value, options);
		value = parsed === null ? null : clamp(parsed);
	}

	function clamp(amount: number) {
		if (min !== undefined && amount < min) return min;
		if (max !== undefined && amount > max) return max;
		return amount;
	}

	function settle() {
		editing = false;
		const parsed = parseGrouped(text, options);
		value = parsed === null ? null : clamp(parsed);
		text = value === null ? '' : formatGrouped(value, options);
	}
</script>

<Input
	bind:value={text}
	{size}
	{tone}
	{invalid}
	{disabled}
	inputmode="decimal"
	oninput={onInput}
	onfocus={() => (editing = true)}
	onblur={settle}
	class={className}
	{...rest}
>
	{#snippet prefix()}
		{#if currency}
			<span class="text-xs font-medium text-text-muted">{currency}</span>
		{/if}
	{/snippet}

	{#snippet suffix()}
		{#if unit}
			<span class="text-xs font-medium text-text-muted">{unit}</span>
		{/if}
	{/snippet}
</Input>
