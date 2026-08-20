<script module lang="ts">
	export interface MultiSelectOption {
		value: string;
		label: string;
		description?: string;
		disabled?: boolean;
		group?: string;
	}
</script>

<script lang="ts">
	import { anchored } from '../actions/anchor.js';
	import { clickOutside, portal } from '../actions/dismissable.js';
	import { useLocale } from '../locale.svelte.js';
	import { toneFocusWithinBorder, toneSoft, toneText, type Tone } from '../tones.js';

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
	let active = $state(0);
	let wrapper: HTMLElement | null = $state(null);
	let inputEl: HTMLInputElement | null = $state(null);
	let listEl: HTMLElement | null = $state(null);

	const chosen = $derived(
		value.map((v) => options.find((o) => o.value === v)).filter(Boolean) as MultiSelectOption[]
	);
	const full = $derived(max > 0 && value.length >= max);
	const collapsed = $derived(maxChips > 0 && chosen.length > maxChips);

	const matches = $derived.by(() => {
		const needle = query.trim().toLowerCase();
		if (!needle) return options;
		return options.filter(
			(option) =>
				option.label.toLowerCase().includes(needle) ||
				option.description?.toLowerCase().includes(needle)
		);
	});

	const groups = $derived.by(() => {
		const out: [string, MultiSelectOption[]][] = [];
		for (const option of matches) {
			const key = option.group ?? '';
			const bucket = out.find(([n]) => n === key);
			if (bucket) bucket[1].push(option);
			else out.push([key, [option]]);
		}
		return out;
	});

	const flat = $derived(groups.flatMap(([, items]) => items));

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
		if (flat.length === 0) return;
		let next = active;
		for (let i = 0; i < flat.length; i++) {
			next = (next + step + flat.length) % flat.length;
			if (!flat[next].disabled) break;
		}
		active = next;
		listEl?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: 'nearest' });
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
				if (open && flat[active]) {
					event.preventDefault();
					toggle(flat[active]);
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
	class="flex w-full flex-wrap items-center gap-1.5 border bg-bg py-1.5 pr-1 pl-2 transition-colors duration-150 ease-brand-out
		{invalid ? 'border-danger' : `border-hairline ${toneFocusWithinBorder[tone]}`}
		{disabled ? 'pointer-events-none opacity-50' : ''} {className}"
>
	{#if collapsed}
		<span
			class="inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs {toneSoft[tone]}"
		>
			{chosen.length}
			{t.current.selected}
		</span>
	{:else}
		{#each chosen as option (option.value)}
			<span
				class="inline-flex items-center gap-1.5 rounded-full py-1 pr-1 pl-2.5 font-mono text-xs {toneSoft[
					tone
				]}"
			>
				{option.label}
				<button
					type="button"
					onclick={() => remove(option)}
					aria-label="{t.current.removeItem} {option.label}"
					class="inline-flex size-4 items-center justify-center rounded-full transition-colors duration-150 hover:bg-bg focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
				>
					<svg class="size-2.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
						<path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="2" />
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
			active = 0;
		}}
		onfocus={() => (open = true)}
		onkeydown={onKeydown}
		class="h-8 min-w-24 flex-1 bg-transparent px-1 font-sans text-[15px] text-text placeholder:text-text-muted focus:outline-none"
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
			class="shrink-0 p-1.5 text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
		>
			<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
				<path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="1.5" />
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
		class="z-50 max-h-64 overflow-y-auto border border-hairline bg-bg py-1 font-sans"
	>
		{#if flat.length === 0}
			<p class="px-3 py-6 text-center text-sm text-text-muted">
				{emptyText ?? t.current.noMatches}
			</p>
		{:else}
			{#each groups as [group, items] (group)}
				{#if group}
					<p class="px-3 pt-2 pb-1 font-mono text-[10px] tracking-wide text-text-muted uppercase">
						{group}
					</p>
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
						onpointermove={() => (active = index)}
						class="flex cursor-pointer items-start gap-2.5 px-3 py-2 text-[14px] transition-colors duration-100
							{option.disabled || (full && !checked) ? 'pointer-events-none opacity-40' : ''}
							{index === active ? toneSoft[tone] : 'text-text-secondary'}"
					>
						<span
							class="mt-0.5 flex size-4 shrink-0 items-center justify-center border transition-colors duration-100
								{checked ? `border-transparent ${toneText[tone]}` : 'border-hairline-strong'}"
						>
							{#if checked}
								<svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
									<path d="m2 6 2.6 2.6L10 3.2" stroke="currentColor" stroke-width="1.8" />
								</svg>
							{/if}
						</span>
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
