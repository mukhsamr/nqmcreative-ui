<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface MultiSelectOption {
		value: string;
		label: string;
		/** Leading icon, 16px. */
		icon?: Snippet;
		description?: string;
		disabled?: boolean;
		group?: string;
	}
</script>

<script lang="ts">
	import { anchored } from '../../core/actions/anchor.js';
	import { clickOutside, portal } from '../../core/actions/dismissable.js';
	import { ListCursor, groupItems, matchQuery, revealIndex } from '../../core/list.svelte.js';
	import { useLocale } from '../../core/locale.svelte.js';
	import { iconMd, iconSm } from './icon.js';
	import { toneFocusWithinBorder, toneSoft, toneText, type Tone } from '../../core/tones.js';
	import { edge, soft } from './lift.js';

	interface Props {
		/** Bindable — the `value` of every chosen option. */
		value?: string[];
		options: MultiSelectOption[];
		placeholder?: string;
		emptyText?: string;
		tone?: Tone;
		invalid?: boolean;
		disabled?: boolean;
		clearable?: boolean;
		/** Cap on how many may be chosen. `0` means no limit. */
		max?: number;
		/** Collapse to "n selected" past this many chips. `0` shows them all. */
		maxChips?: number;
		id?: string;
		/** Submits one hidden input per value. */
		name?: string;
		onchange?: (value: string[]) => void;
		class?: string;
	}

	let {
		value = $bindable([]),
		options,
		placeholder,
		emptyText,
		tone = 'brand',
		invalid = false,
		disabled = false,
		clearable = true,
		max = 0,
		maxChips = 0,
		id,
		name,
		onchange,
		class: className = ''
	}: Props = $props();

	const t = useLocale();

	let open = $state(false);
	let query = $state('');
	let wrapper: HTMLElement | null = $state(null);
	let inputEl: HTMLInputElement | null = $state(null);
	let listEl: HTMLElement | null = $state(null);

	const chosen = $derived(
		value.map((v) => options.find((o) => o.value === v)).filter(Boolean) as MultiSelectOption[]
	);
	const full = $derived(max > 0 && value.length >= max);
	const collapsed = $derived(maxChips > 0 && chosen.length > maxChips);

	const matches = $derived(
		matchQuery(options, query, (option) => `${option.label} ${option.description ?? ''}`)
	);

	const groups = $derived(groupItems(matches));
	const flat = $derived(groups.flatMap(([, items]) => items));

	const cursor = new ListCursor(() => flat);
	const active = $derived(cursor.index);

	function toggle(option: MultiSelectOption) {
		const has = value.includes(option.value);
		if (option.disabled || (!has && full)) return;
		value = has ? value.filter((v) => v !== option.value) : [...value, option.value];
		onchange?.(value);
	}

	function remove(option: MultiSelectOption) {
		value = value.filter((v) => v !== option.value);
		onchange?.(value);
	}

	function move(step: number) {
		cursor.move(step);
		revealIndex(listEl, cursor.index);
	}

	function onKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				if (!open) open = true;
				else move(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				if (open) move(-1);
				break;
			case 'Enter':
				if (open && cursor.current) {
					event.preventDefault();
					toggle(cursor.current);
				}
				break;
			case 'Backspace':
				// Empty query: peel the last chip off, the way tag inputs behave.
				if (!query && chosen.length) {
					event.preventDefault();
					remove(chosen[chosen.length - 1]);
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
	class="flex w-full flex-wrap items-center gap-1.5 rounded-xl border bg-bg py-1.5 pr-1 pl-2 {edge} transition-colors duration-150 ease-brand-out
		{invalid ? 'border-danger' : `border-hairline-strong ${toneFocusWithinBorder[tone]}`}
		{disabled ? 'pointer-events-none opacity-50' : ''} {className}"
>
	{#if collapsed}
		<span
			class="inline-flex items-center rounded-xl px-2 py-0.5 text-xs font-medium {toneSoft[tone]}"
		>
			{chosen.length}
			{t.current.selected}
		</span>
	{:else}
		{#each chosen as option (option.value)}
			<span
				class="inline-flex items-center gap-1 rounded-xl py-0.5 pr-0.5 pl-2 text-xs font-medium {toneSoft[
					tone
				]}"
			>
				{#if option.icon}<span class={iconSm}>{@render option.icon()}</span>{/if}{option.label}
				<button
					type="button"
					onclick={() => remove(option)}
					aria-label="{t.current.removeItem} {option.label}"
					class="inline-flex size-4 items-center justify-center rounded transition-colors duration-150 hover:bg-bg/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
				>
					<svg class="size-2.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
						<path
							d="m2 2 10 10M12 2 2 12"
							stroke="currentColor"
							stroke-width="2.2"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</span>
		{/each}
	{/if}

	<input
		bind:this={inputEl}
		bind:value={query}
		{id}
		{disabled}
		type="text"
		role="combobox"
		autocomplete="off"
		aria-expanded={open}
		aria-controls="{id ?? 'multiselect'}-listbox"
		aria-invalid={invalid ? 'true' : undefined}
		placeholder={chosen.length ? '' : (placeholder ?? t.current.comboboxPlaceholder)}
		oninput={() => {
			open = true;
			cursor.index = 0;
		}}
		onfocus={() => (open = true)}
		onkeydown={onKeydown}
		class="h-7 min-w-24 flex-1 bg-transparent px-1 font-sans text-sm text-text placeholder:text-text-muted focus:outline-none"
	/>

	{#if name}
		{#each value as v (v)}<input type="hidden" {name} value={v} />{/each}
	{/if}

	{#if clearable && chosen.length && !disabled}
		<button
			type="button"
			onclick={() => {
				value = [];
				onchange?.([]);
				inputEl?.focus();
			}}
			aria-label={t.current.clear}
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
</div>

{#if open}
	<div
		bind:this={listEl}
		use:portal
		use:anchored={{ anchor: wrapper, placement: 'bottom-start', offset: 4, matchWidth: true }}
		use:clickOutside={{ onoutside: () => (open = false), ignore: [wrapper] }}
		id="{id ?? 'multiselect'}-listbox"
		role="listbox"
		aria-multiselectable="true"
		class="z-50 max-h-64 overflow-y-auto rounded-2xl border border-hairline bg-bg py-1 font-sans {soft}"
	>
		{#if flat.length === 0}
			<p class="px-3 py-6 text-center text-sm text-text-muted">
				{emptyText ?? t.current.noMatches}
			</p>
		{:else}
			{#each groups as [group, items] (group)}
				{#if group}
					<p class="px-3 pt-2 pb-1 text-[11px] font-semibold text-text-muted">{group}</p>
				{/if}
				{#each items as option (option.value)}
					{@const index = flat.indexOf(option)}
					{@const checked = value.includes(option.value)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						data-index={index}
						role="option"
						tabindex="-1"
						aria-selected={checked}
						aria-disabled={option.disabled || (full && !checked)}
						onclick={() => toggle(option)}
						onpointermove={() => (cursor.index = index)}
						class="mx-1 flex cursor-pointer items-start gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-colors duration-100
							{option.disabled || (full && !checked) ? 'pointer-events-none opacity-40' : ''}
							{index === active ? toneSoft[tone] : 'text-text-secondary'}"
					>
						<span
							class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-100
								{checked ? `border-transparent ${toneText[tone]}` : 'border-hairline-strong'}"
						>
							{#if checked}
								<svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
									<path
										d="m2 6 2.6 2.6L10 3.2"
										stroke="currentColor"
										stroke-width="2"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							{/if}
						</span>
						{#if option.icon}<span class={iconMd}>{@render option.icon()}</span>{/if}
						<span class="flex min-w-0 flex-1 flex-col gap-0.5">
							<span class="truncate">{option.label}</span>
							{#if option.description}
								<span class="truncate text-xs text-text-muted">{option.description}</span>
							{/if}
						</span>
					</div>
				{/each}
			{/each}
		{/if}
	</div>
{/if}
