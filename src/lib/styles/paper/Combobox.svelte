<script lang="ts">
	import type { Snippet } from 'svelte';
	import { anchored } from '../../core/actions/anchor.js';
	import { clickOutside, portal } from '../../core/actions/dismissable.js';
	import { ListCursor, groupItems, matchQuery, revealIndex } from '../../core/list.svelte.js';
	import { toneFocusWithinBorder, toneSoft, toneText, type Tone } from '../../core/tones.js';
	import { iconMd } from './icon.js';

	export interface ComboboxOption {
		value: string;
		label: string;
		/** Leading icon, 16px. */
		icon?: Snippet;
		/** Second line under the label. */
		description?: string;
		disabled?: boolean;
		/** Options sharing a group are rendered under one heading. */
		group?: string;
	}

	interface Props {
		/** Bindable — the selected option's `value`, or `''`. */
		value?: string;
		options: ComboboxOption[];
		placeholder?: string;
		tone?: Tone;
		invalid?: boolean;
		disabled?: boolean;
		/** Shows a clear button once something is selected. */
		clearable?: boolean;
		emptyText?: string;
		id?: string;
		name?: string;
		onchange?: (value: string) => void;
		class?: string;
	}

	let {
		value = $bindable(''),
		options,
		placeholder,
		tone = 'brand',
		invalid = false,
		disabled = false,
		clearable = true,
		emptyText,
		id,
		name,
		onchange,
		class: className = ''
	}: Props = $props();

	let open = $state(false);
	let query = $state('');
	let wrapper: HTMLElement | null = $state(null);
	let inputEl: HTMLInputElement | null = $state(null);
	let listEl: HTMLElement | null = $state(null);

	const selected = $derived(options.find((option) => option.value === value));

	const matches = $derived(
		matchQuery(options, query, (option) => `${option.label} ${option.description ?? ''}`)
	);

	/** Options in render order, grouped when any option declares a `group`. */
	const groups = $derived(groupItems(matches));
	const flat = $derived(groups.flatMap(([, items]) => items));

	const cursor = new ListCursor(() => flat);
	const active = $derived(cursor.index);

	/**
	 * Set while we hand focus back to the field after a choice. Focusing fires
	 * `focus` synchronously, and this field opens on focus — without the guard,
	 * picking an option would immediately reopen the list it just closed.
	 */
	let restoring = false;

	function openList() {
		if (disabled || open || restoring) return;
		open = true;
		query = '';
		cursor.reset((option) => option.value === value);
	}

	function choose(option: ComboboxOption) {
		if (option.disabled) return;
		value = option.value;
		onchange?.(option.value);
		open = false;
		query = '';
		restoring = true;
		inputEl?.focus();
		restoring = false;
	}

	function clear(event: MouseEvent) {
		event.stopPropagation();
		value = '';
		query = '';
		onchange?.('');
		restoring = true;
		inputEl?.focus();
		restoring = false;
	}

	function move(step: number) {
		cursor.move(step);
		revealIndex(listEl, cursor.index);
	}

	function onKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				if (!open) openList();
				else move(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (open) move(-1);
				break;
			case 'Enter':
				if (open && cursor.current) {
					event.preventDefault();
					choose(cursor.current);
				}
				break;
			case 'Escape':
				if (open) {
					event.preventDefault();
					event.stopPropagation();
					open = false;
					query = '';
				}
				break;
			case 'Tab':
				open = false;
				break;
		}
	}
</script>

<div
	bind:this={wrapper}
	class="relative inline-flex w-full items-center gap-2 rounded-md border bg-bg pr-1.5 pl-3 shadow-xs transition-colors duration-150 ease-brand-out
		{invalid ? 'border-danger' : `border-hairline-strong ${toneFocusWithinBorder[tone]}`}
		{disabled ? 'pointer-events-none opacity-50' : ''} {className}"
>
	<input
		bind:this={inputEl}
		{id}
		{disabled}
		type="text"
		role="combobox"
		autocomplete="off"
		aria-expanded={open}
		aria-controls="{id ?? 'combobox'}-listbox"
		aria-activedescendant={open && flat[active] ? `${id ?? 'combobox'}-opt-${active}` : undefined}
		aria-invalid={invalid ? 'true' : undefined}
		placeholder={selected ? selected.label : (placeholder ?? 'Search…')}
		value={open ? query : (selected?.label ?? '')}
		oninput={(event) => {
			query = event.currentTarget.value;
			open = true;
			cursor.index = 0;
		}}
		onfocus={openList}
		onkeydown={onKeydown}
		class="h-10 w-full min-w-0 bg-transparent font-sans text-sm text-text placeholder:text-text-muted focus:outline-none"
	/>

	{#if name}<input type="hidden" {name} {value} />{/if}

	{#if clearable && value && !disabled}
		<button
			type="button"
			onclick={clear}
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

	<svg
		class="pointer-events-none mr-1.5 size-4 shrink-0 text-text-muted transition-transform duration-150 {open
			? 'rotate-180'
			: ''}"
		viewBox="0 0 16 16"
		fill="none"
		aria-hidden="true"
	>
		<path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	</svg>
</div>

{#if open}
	<div
		bind:this={listEl}
		use:portal
		use:anchored={{ anchor: wrapper, placement: 'bottom-start', offset: 4, matchWidth: true }}
		use:clickOutside={{ onoutside: () => (open = false), ignore: [wrapper] }}
		id="{id ?? 'combobox'}-listbox"
		role="listbox"
		class="z-50 max-h-64 overflow-y-auto rounded-lg border border-hairline bg-bg py-1 font-sans shadow-lg"
	>
		{#if flat.length === 0}
			<p class="px-3 py-6 text-center text-sm text-text-muted">
				{emptyText ?? 'No matches'}
			</p>
		{:else}
			{#each groups as [group, items] (group)}
				{#if group}
					<p class="px-3 pt-2 pb-1 text-[11px] font-semibold text-text-muted">{group}</p>
				{/if}
				{#each items as option (option.value)}
					{@const index = flat.indexOf(option)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						id="{id ?? 'combobox'}-opt-{index}"
						data-index={index}
						role="option"
						tabindex="-1"
						aria-selected={option.value === value}
						aria-disabled={option.disabled}
						onclick={() => choose(option)}
						onpointermove={() => (cursor.index = index)}
						class="mx-1 flex cursor-pointer flex-col gap-0.5 rounded-md px-2.5 py-2 text-sm transition-colors duration-100
							{option.disabled ? 'pointer-events-none opacity-40' : ''}
							{index === active ? toneSoft[tone] : 'text-text-secondary'}"
					>
						<span class="flex items-center gap-2">
							{#if option.icon}<span class={iconMd}>{@render option.icon()}</span>{/if}
							<span class="min-w-0 flex-1 truncate">{option.label}</span>
							{#if option.value === value}
								<svg
									class="size-3.5 shrink-0 {toneText[tone]}"
									viewBox="0 0 14 14"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="m2 7 3.2 3.2L12 3.6"
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{/if}
						</span>
						{#if option.description}
							<span class="truncate text-xs text-text-muted">{option.description}</span>
						{/if}
					</div>
				{/each}
			{/each}
		{/if}
	</div>
{/if}
