<script module lang="ts">
	import type { Snippet } from 'svelte';

	export type SidebarVariant = 'plain' | 'filled' | 'floating';

	export interface SidebarItem {
		/** Stable id used for the active state. Falls back to `href`. */
		id?: string;
		label: string;
		href?: string;
		disabled?: boolean;
		badge?: string | number;
		/**
		 * Leading glyph, 16px. The one thing a collapsed rail still shows, so
		 * an item that has to survive `collapsed` needs one.
		 */
		icon?: Snippet;
		/** Nested links — the parent becomes a collapsible group. */
		items?: SidebarItem[];
		/** Open the group on first render. */
		open?: boolean;
		/**
		 * `false` pins a group open: the parent stops being a button and the
		 * children are always on show. For navigation a reader should not be
		 * able to lose.
		 */
		collapsible?: boolean;
	}

	export interface SidebarSection {
		/** Small heading above a run of items. */
		label?: string;
		items: SidebarItem[];
	}
</script>

<script lang="ts">
	import { iconMd } from './icon.js';
	import { soft } from './lift.js';
	import { focusRing, toneRing, toneSoft, type Tone } from '../../core/tones.js';

	interface Props {
		sections: SidebarSection[];
		/** Bindable — the `id` (or `href`) of the current item. */
		value?: string;
		/** Bindable — narrow rail mode. */
		collapsed?: boolean;
		/** Show the collapse button. */
		collapsible?: boolean;
		/** Surface treatment: bare, the framed default, or a detached card. */
		variant?: SidebarVariant;
		tone?: Tone;
		header?: Snippet;
		footer?: Snippet;
		onnavigate?: (item: SidebarItem) => void;
		class?: string;
	}

	let {
		sections,
		value = $bindable(''),
		collapsed = $bindable(false),
		collapsible = true,
		variant = 'filled',
		tone = 'brand',
		header,
		footer,
		onnavigate,
		class: className = ''
	}: Props = $props();

	const keyOf = (item: SidebarItem) => item.id ?? item.href ?? item.label;

	/** Groups start open when asked, or when they contain the active item. */
	let opened = $state<Record<string, boolean>>({});

	const isOpen = (item: SidebarItem) =>
		item.collapsible === false ||
		(opened[keyOf(item)] ?? (item.open || item.items!.some((child) => keyOf(child) === value)));

	function toggle(item: SidebarItem) {
		opened = { ...opened, [keyOf(item)]: !isOpen(item) };
	}

	function go(item: SidebarItem) {
		if (item.disabled) return;
		value = keyOf(item);
		onnavigate?.(item);
	}

	const surfaces: Record<SidebarVariant, string> = {
		plain: 'h-full bg-transparent',
		filled: 'h-full border-r border-hairline bg-bg-alt',
		floating: `m-3 h-[calc(100%-1.5rem)] rounded-2xl border border-hairline bg-bg-alt ${soft}`
	};

	const row =
		'flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left font-sans text-sm transition-colors duration-150 ease-brand-out disabled:pointer-events-none disabled:opacity-40';
</script>

<!-- Nested links. One copy, rendered by both kinds of group. -->
{#snippet subitems(item: SidebarItem)}
	<div class="ml-4 flex flex-col gap-0.5 border-l border-hairline pl-2">
		{#each item.items as child (keyOf(child))}
			<a
				href={child.href}
				onclick={() => go(child)}
				aria-current={value === keyOf(child) ? 'page' : undefined}
				class="{row} {focusRing} {toneRing[tone]} {value === keyOf(child)
					? `${toneSoft[tone]} font-medium`
					: 'text-text-muted hover:bg-bg-inset hover:text-text'} {child.disabled
					? 'pointer-events-none opacity-40'
					: ''}"
			>
				{@render glyph(child)}
				<span class="min-w-0 flex-1 truncate">{child.label}</span>
				{#if child.badge !== undefined}
					<span class="shrink-0 text-[11px] tabular-nums">{child.badge}</span>
				{/if}
			</a>
		{/each}
	</div>
{/snippet}

<!-- One box for every glyph, so rows line up whether or not an item has one. -->
{#snippet glyph(item: SidebarItem)}
	{#if item.icon}
		<span class={iconMd}>{@render item.icon()}</span>
	{/if}
{/snippet}

<aside
	class="flex shrink-0 flex-col transition-[width] duration-200 ease-brand-out
		{surfaces[variant]} {collapsed ? 'w-16' : 'w-60'} {className}"
>
	{#if header}
		<div class="flex h-16 shrink-0 items-center gap-3 border-b border-hairline px-3">
			{@render header()}
		</div>
	{/if}

	<nav aria-label="Navigation" class="flex-1 overflow-y-auto p-2">
		{#each sections as section, i (section.label ?? i)}
			<div class="flex flex-col gap-0.5 {i > 0 ? 'mt-4' : ''}">
				{#if section.label && !collapsed}
					<p class="px-2.5 pb-1 font-sans text-[11px] font-semibold text-text-muted">
						{section.label}
					</p>
				{:else if section.label && collapsed && i > 0}
					<div class="mx-2 mb-1 h-px bg-hairline" role="separator"></div>
				{/if}

				{#each section.items as item (keyOf(item))}
					{#if item.items?.length && item.collapsible === false}
						<div class="{row} {collapsed ? 'justify-center' : ''} font-medium text-text-muted">
							{@render glyph(item)}
							<span class="min-w-0 flex-1 truncate {collapsed ? 'sr-only' : ''}">{item.label}</span>
						</div>
						{#if isOpen(item) && !collapsed}
							{@render subitems(item)}
						{/if}
					{:else if item.items?.length}
						<button
							type="button"
							onclick={() => toggle(item)}
							aria-expanded={isOpen(item)}
							title={collapsed ? item.label : undefined}
							class="{row} {collapsed ? 'justify-center' : ''} {focusRing} {toneRing[
								tone
							]} text-text-secondary hover:bg-bg-inset hover:text-text"
						>
							{@render glyph(item)}
							<span class="min-w-0 flex-1 truncate {collapsed ? 'sr-only' : ''}">{item.label}</span>
							{#if !collapsed}
								<svg
									class="size-3.5 shrink-0 transition-transform duration-200 {isOpen(item)
										? 'rotate-90'
										: ''}"
									viewBox="0 0 16 16"
									fill="none"
									aria-hidden="true"
								>
									<path
										d="m6 4 4 4-4 4"
										stroke="currentColor"
										stroke-width="1.6"
										stroke-linecap="round"
									/>
								</svg>
							{/if}
						</button>

						{#if isOpen(item) && !collapsed}
							{@render subitems(item)}
						{/if}
					{:else}
						<a
							href={item.href}
							onclick={() => go(item)}
							aria-current={value === keyOf(item) ? 'page' : undefined}
							title={collapsed ? item.label : undefined}
							class="{row} {collapsed ? 'justify-center' : ''} {focusRing} {toneRing[
								tone
							]} {value === keyOf(item)
								? `${toneSoft[tone]} font-medium`
								: 'text-text-secondary hover:bg-bg-inset hover:text-text'} {item.disabled
								? 'pointer-events-none opacity-40'
								: ''}"
						>
							{@render glyph(item)}
							<span class="min-w-0 flex-1 truncate {collapsed ? 'sr-only' : ''}">{item.label}</span>
							{#if item.badge !== undefined && !collapsed}
								<span class="shrink-0 text-[11px] text-text-muted tabular-nums">{item.badge}</span>
							{/if}
						</a>
					{/if}
				{/each}
			</div>
		{/each}
	</nav>

	{#if footer || collapsible}
		<div class="flex shrink-0 flex-col gap-2 border-t border-hairline p-2">
			{#if footer}
				{@render footer()}
			{/if}
			{#if collapsible}
				<button
					type="button"
					onclick={() => (collapsed = !collapsed)}
					aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					class="inline-flex h-8 items-center justify-center gap-2 rounded-xl font-sans text-xs text-text-muted transition-colors duration-150 hover:bg-bg-inset hover:text-text {focusRing} {toneRing[
						tone
					]}"
				>
					<svg
						class="size-4 transition-transform duration-200 {collapsed ? 'rotate-180' : ''}"
						viewBox="0 0 16 16"
						fill="none"
						aria-hidden="true"
					>
						<path
							d="m10 4-4 4 4 4"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
						/>
					</svg>
					{#if !collapsed}<span>Collapse sidebar</span>{/if}
				</button>
			{/if}
		</div>
	{/if}
</aside>
