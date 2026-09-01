<script lang="ts">
	import { anchored } from '../../core/actions/anchor.js';
	import { clickOutside, portal } from '../../core/actions/dismissable.js';
	import { dateHint } from '../../core/calendar.js';
	import { formatISO, parseFormatted, type DateFormat } from '../../core/date.js';
	import {
		focusWithinRing,
		toneFocusWithinBorder,
		toneFocusWithinRing,
		type Tone
	} from '../../core/tones.js';
	import Calendar from './Calendar.svelte';

	interface Props {
		/** Bindable `YYYY-MM-DD` — the same shape as `<input type="date">`. */
		value?: string;
		/** Inclusive bounds, `YYYY-MM-DD`. */
		min?: string;
		max?: string;
		isDisabled?: (date: Date) => boolean;
		weekStart?: 0 | 1;
		/** Order of the date parts the field accepts and prints. */
		format?: DateFormat;
		tone?: Tone;
		invalid?: boolean;
		disabled?: boolean;
		clearable?: boolean;
		placeholder?: string;
		id?: string;
		/** Submits the ISO value with a form. */
		name?: string;
		onchange?: (value: string) => void;
		class?: string;
	}

	let {
		value = $bindable(''),
		min,
		max,
		isDisabled,
		weekStart = 1,
		format = 'dmy',
		tone = 'brand',
		invalid = false,
		disabled = false,
		clearable = true,
		placeholder,
		id,
		name,
		onchange,
		class: className = ''
	}: Props = $props();

	let open = $state(false);
	let text = $state('');
	let editing = $state(false);
	let wrapper: HTMLElement | null = $state(null);
	let inputEl: HTMLInputElement | null = $state(null);

	/** While typing the field shows the raw text; otherwise the formatted value. */
	const display = $derived(editing ? text : formatISO(value, format));
	const hint = $derived(placeholder ?? dateHint(format));

	function commit() {
		editing = false;
		if (!text.trim()) {
			if (value) {
				value = '';
				onchange?.('');
			}
			return;
		}
		const parsed = parseFormatted(text, format);
		if (parsed && parsed !== value) {
			value = parsed;
			onchange?.(parsed);
		}
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && open) {
			event.preventDefault();
			event.stopPropagation();
			open = false;
			return;
		}
		if (event.key === 'Enter') {
			event.preventDefault();
			commit();
			open = false;
			return;
		}
		if (event.key === 'ArrowDown' && !open) {
			event.preventDefault();
			open = true;
		}
	}
</script>

<div
	bind:this={wrapper}
	class="inline-flex w-full items-center gap-1 rounded-md border bg-bg pr-1 pl-3 shadow-xs transition-colors duration-150 ease-brand-out {focusWithinRing} {toneFocusWithinRing[
		tone
	]}
		{invalid ? 'border-danger' : `border-hairline-strong ${toneFocusWithinBorder[tone]}`}
		{disabled ? 'pointer-events-none opacity-50' : ''} {className}"
>
	<input
		bind:this={inputEl}
		{id}
		{disabled}
		type="text"
		inputmode="numeric"
		autocomplete="off"
		role="combobox"
		aria-haspopup="dialog"
		aria-controls="{id ?? 'datepicker'}-calendar"
		aria-invalid={invalid ? 'true' : undefined}
		aria-expanded={open}
		placeholder={hint}
		value={display}
		oninput={(event) => {
			editing = true;
			text = event.currentTarget.value;
		}}
		onblur={commit}
		onkeydown={onKeydown}
		class="h-10 w-full min-w-0 bg-transparent font-sans text-sm text-text tabular-nums placeholder:text-text-muted focus:outline-none"
	/>

	{#if name}<input type="hidden" {name} {value} />{/if}

	{#if clearable && value && !disabled}
		<button
			type="button"
			onclick={() => {
				value = '';
				text = '';
				onchange?.('');
				inputEl?.focus();
			}}
			aria-label="Clear selection"
			class="shrink-0 rounded p-1 text-text-muted transition-colors duration-150 hover:bg-bg-inset hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
		>
			<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
				<path
					d="m2 2 10 10M12 2 2 12"
					stroke="currentColor"
					stroke-width="1.6"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	{/if}

	<button
		type="button"
		{disabled}
		onclick={() => (open = !open)}
		aria-label="Select a date"
		aria-expanded={open}
		class="shrink-0 rounded p-1.5 text-text-muted transition-colors duration-150 hover:bg-bg-inset hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
	>
		<svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<rect x="3" y="4.5" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.4" />
			<path
				d="M3 8.5h14M7 3v3M13 3v3"
				stroke="currentColor"
				stroke-width="1.4"
				stroke-linecap="round"
			/>
		</svg>
	</button>
</div>

{#if open}
	<div
		use:portal
		use:anchored={{ anchor: wrapper, placement: 'bottom-start', offset: 4 }}
		use:clickOutside={{ onoutside: () => (open = false), ignore: [wrapper] }}
		id="{id ?? 'datepicker'}-calendar"
		class="z-50 rounded-lg border border-hairline bg-bg shadow-lg"
	>
		<Calendar
			bind:value
			{min}
			{max}
			{isDisabled}
			{weekStart}
			{tone}
			onselect={(next) => {
				editing = false;
				open = false;
				onchange?.(next);
				inputEl?.focus();
			}}
		/>
	</div>
{/if}
