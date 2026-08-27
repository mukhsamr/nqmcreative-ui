<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface CommandItem {
		id: string;
		label: string;
		/** Leading icon, 16px. */
		icon?: Snippet;
		/** Second line under the label. */
		description?: string;
		/** Items sharing a group are rendered under one heading. */
		group?: string;
		/** Right-aligned hint, e.g. `'⌘K'`. */
		shortcut?: string;
		/** Extra words to match on that aren't in the label. */
		keywords?: string;
		disabled?: boolean;
		onselect?: () => void;
	}
</script>

<script lang="ts">
	import { focusTrap } from '../../core/actions/dismissable.js';
	import { syncDialog } from '../../core/dialog.svelte.js';
	import { ListCursor, groupItems, matchQuery, revealIndex } from '../../core/list.svelte.js';
	import { useLocale } from '../../core/locale.svelte.js';
	import { toneSoft, type Tone } from '../../core/tones.js';
	import { isTypingTarget } from '../../core/trigger.js';
	import { iconMd } from './icon.js';
	import Kbd from './Kbd.svelte';
	import { float } from './lift.js';

	interface Props {
		open?: boolean;
		items: CommandItem[];
		placeholder?: string;
		emptyText?: string;
		tone?: Tone;
		/**
		 * Key that opens the palette with Cmd/Ctrl held. Default `'k'`.
		 * Pass `null` to wire your own trigger only.
		 */
		hotkey?: string | null;
		/**
		 * Key that opens the palette on its own, pressed anywhere the reader
		 * isn't typing. Default `'/'`. Pass `null` to turn it off.
		 */
		quickKey?: string | null;
		onselect?: (item: CommandItem) => void;
		class?: string;
	}

	let {
		open = $bindable(false),
		items,
		placeholder,
		emptyText,
		tone = 'brand',
		hotkey = 'k',
		quickKey = '/',
		onselect,
		class: className = ''
	}: Props = $props();

	const t = useLocale();

	let dialog: HTMLDialogElement | null = $state(null);
	let inputEl: HTMLInputElement | null = $state(null);
	let listEl: HTMLElement | null = $state(null);
	let query = $state('');

	const matches = $derived(
		matchQuery(
			items,
			query,
			(item) => `${item.label} ${item.description ?? ''} ${item.keywords ?? ''} ${item.group ?? ''}`
		)
	);

	const groups = $derived(groupItems(matches));
	const flat = $derived(groups.flatMap(([, group]) => group));

	const cursor = new ListCursor(() => flat);
	const active = $derived(cursor.index);

	$effect(() => {
		if (!dialog) return;
		const wasOpen = dialog.open;
		syncDialog(dialog, open);
		if (open && !wasOpen) {
			query = '';
			cursor.reset();
			queueMicrotask(() => inputEl?.focus());
		}
	});

	$effect(() => {
		if (!hotkey && !quickKey) return;
		const onKeydown = (event: KeyboardEvent) => {
			const key = event.key.toLowerCase();

			if ((event.metaKey || event.ctrlKey) && key === hotkey?.toLowerCase()) {
				event.preventDefault();
				open = !open;
				return;
			}

			// A bare key can only open the palette, never close it: while it is
			// open the keystroke belongs to the query field.
			if (
				key === quickKey?.toLowerCase() &&
				!event.metaKey &&
				!event.ctrlKey &&
				!event.altKey &&
				!isTypingTarget(event.target)
			) {
				event.preventDefault();
				open = true;
			}
		};
		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});

	function run(item: CommandItem) {
		if (item.disabled) return;
		open = false;
		item.onselect?.();
		onselect?.(item);
	}

	function move(step: number) {
		cursor.move(step);
		revealIndex(listEl, cursor.index);
	}

	function onKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				move(1);
				break;
			case 'ArrowUp':
				event.preventDefault();
				move(-1);
				break;
			case 'Enter':
				if (cursor.current) {
					event.preventDefault();
					run(cursor.current);
				}
				break;
			case 'Escape':
				event.preventDefault();
				open = false;
				break;
		}
	}
</script>

<dialog
	bind:this={dialog}
	onclose={() => (open = false)}
	onclick={(event) => {
		if (event.target === dialog) open = false;
	}}
	class="mx-auto mt-[12vh] mb-auto w-[min(36rem,calc(100vw-2rem))] max-w-none rounded-[28px] border border-hairline bg-bg p-0 text-text {float} backdrop:bg-text/30 backdrop:backdrop-blur-[1px] {className}"
>
	<div use:focusTrap={{ autofocus: false }} onkeydown={onKeydown} role="none" class="flex flex-col">
		<div class="flex items-center gap-3 border-b border-hairline px-4">
			<svg
				class="size-4 shrink-0 text-text-muted"
				viewBox="0 0 16 16"
				fill="none"
				aria-hidden="true"
			>
				<circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5" />
				<path d="m10.5 10.5 3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
			<input
				bind:this={inputEl}
				bind:value={query}
				oninput={() => cursor.reset()}
				type="text"
				autocomplete="off"
				aria-label={placeholder ?? t.current.commandPlaceholder}
				placeholder={placeholder ?? t.current.commandPlaceholder}
				class="h-12 w-full min-w-0 bg-transparent font-sans text-sm text-text placeholder:text-text-muted focus:outline-none"
			/>
			<Kbd>esc</Kbd>
		</div>

		<div
			bind:this={listEl}
			role="listbox"
			aria-label="Commands"
			class="max-h-80 overflow-y-auto py-1"
		>
			{#if flat.length === 0}
				<p class="px-4 py-10 text-center font-sans text-sm text-text-muted">
					{emptyText ?? t.current.noResults}
				</p>
			{:else}
				{#each groups as [group, groupItems] (group)}
					{#if group}
						<p class="px-4 pt-3 pb-1 text-[11px] font-semibold text-text-muted">{group}</p>
					{/if}
					{#each groupItems as item (item.id)}
						{@const index = flat.indexOf(item)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							data-index={index}
							role="option"
							tabindex="-1"
							aria-selected={index === active}
							aria-disabled={item.disabled}
							onclick={() => run(item)}
							onpointermove={() => (cursor.index = index)}
							class="mx-2 flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 font-sans text-sm transition-colors duration-100
								{item.disabled ? 'pointer-events-none opacity-40' : ''}
								{index === active ? toneSoft[tone] : 'text-text-secondary'}"
						>
							{#if item.icon}<span class={iconMd}>{@render item.icon()}</span>{/if}
							<span class="flex min-w-0 flex-1 flex-col gap-0.5">
								<span class="truncate">{item.label}</span>
								{#if item.description}
									<span class="truncate text-xs text-text-muted">{item.description}</span>
								{/if}
							</span>
							{#if item.shortcut}
								<span class="shrink-0 text-[11px] text-text-muted">{item.shortcut}</span>
							{/if}
						</div>
					{/each}
				{/each}
			{/if}
		</div>
	</div>
</dialog>
