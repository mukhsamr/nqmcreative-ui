<script module lang="ts">
	export interface NavItem {
		label: string;
		href?: string;
		/** Marks the current page — also sets `aria-current`. */
		active?: boolean;
		disabled?: boolean;
		/** Renders a dropdown instead of a plain link. */
		items?: NavItem[];
		/** Small count or tag after the label. */
		badge?: string | number;
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useLocale } from '../../core/locale.svelte.js';
	import { focusRing, toneRing, toneSoft, toneText, type Tone } from '../../core/tones.js';
	import Drawer from './Drawer.svelte';
	import Dropdown from './Dropdown.svelte';
	import MenuItem from './MenuItem.svelte';

	interface Props {
		items?: NavItem[];
		/** Logo or wordmark on the left. */
		brand?: Snippet;
		/** Buttons on the right — sign in, theme toggle, avatar. */
		actions?: Snippet;
		/** Extra content inside the mobile drawer, under the links. */
		mobileExtra?: Snippet;
		tone?: Tone;
		/** Sticks to the top of the viewport. */
		sticky?: boolean;
		/** Hairline along the bottom edge. Default true. */
		bordered?: boolean;
		/** Bindable — the mobile drawer's state. */
		menuOpen?: boolean;
		class?: string;
	}

	let {
		items = [],
		brand,
		actions,
		mobileExtra,
		tone = 'brand',
		sticky = false,
		bordered = true,
		menuOpen = $bindable(false),
		class: className = ''
	}: Props = $props();

	const t = useLocale();

	// sprout gives the active link a filled pill rather than a colour change, so
	// the current page is legible without relying on hue alone.
	const link =
		'inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-heading text-sm font-medium transition-colors duration-150 ease-brand-out';
</script>

<header
	class="w-full bg-bg {sticky ? 'sticky top-0 z-40' : ''} {bordered
		? 'border-b border-hairline'
		: ''} {className}"
>
	<nav
		aria-label={t.current.navigation}
		class="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6"
	>
		{#if brand}
			<div class="flex shrink-0 items-center">{@render brand()}</div>
		{/if}

		<!-- desktop links -->
		<ul class="hidden flex-1 items-center gap-1 md:flex">
			{#each items as item (item.label)}
				<li>
					{#if item.items?.length}
						<Dropdown label={item.label}>
							{#snippet trigger()}
								<button
									type="button"
									class="{link} {focusRing} {toneRing[tone]} {item.active
										? `${toneSoft[tone]}`
										: 'text-text-secondary hover:bg-bg-inset hover:text-text'}"
								>
									{item.label}
									<svg class="size-3" viewBox="0 0 16 16" fill="none" aria-hidden="true">
										<path
											d="m4 6 4 4 4-4"
											stroke="currentColor"
											stroke-width="1.8"
											stroke-linecap="round"
										/>
									</svg>
								</button>
							{/snippet}
							{#each item.items as child (child.label)}
								<MenuItem href={child.href} disabled={child.disabled} selected={child.active}>
									{child.label}
								</MenuItem>
							{/each}
						</Dropdown>
					{:else}
						<a
							href={item.href}
							aria-current={item.active ? 'page' : undefined}
							class="{link} {focusRing} {toneRing[tone]} {item.active
								? toneSoft[tone]
								: 'text-text-secondary hover:bg-bg-inset hover:text-text'} {item.disabled
								? 'pointer-events-none opacity-50'
								: ''}"
						>
							{item.label}
							{#if item.badge !== undefined}
								<span class="text-[11px] text-text-muted tabular-nums">{item.badge}</span>
							{/if}
						</a>
					{/if}
				</li>
			{/each}
		</ul>

		<div class="ml-auto flex items-center gap-3">
			{#if actions}
				<div class="hidden items-center gap-2 md:flex">{@render actions()}</div>
			{/if}

			<!-- mobile trigger -->
			<button
				type="button"
				onclick={() => (menuOpen = true)}
				aria-label={t.current.openMenu}
				aria-expanded={menuOpen}
				class="inline-flex size-9 items-center justify-center rounded-xl text-text-secondary transition-colors duration-150 hover:bg-bg-inset hover:text-text md:hidden {focusRing} {toneRing[
					tone
				]}"
			>
				<svg class="size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M3 6h14M3 10h14M3 14h14"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
	</nav>
</header>

<Drawer bind:open={menuOpen} side="right" size="sm" title={t.current.navigation}>
	<ul class="flex flex-col gap-0.5">
		{#each items as item (item.label)}
			<li>
				<a
					href={item.href}
					onclick={() => (menuOpen = false)}
					aria-current={item.active ? 'page' : undefined}
					class="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 font-sans text-sm font-medium {item.active
						? `${toneSoft[tone]}`
						: 'text-text-secondary hover:bg-bg-inset'} {item.disabled
						? 'pointer-events-none opacity-50'
						: ''}"
				>
					{item.label}
					{#if item.badge !== undefined}
						<span class="text-[11px] text-text-muted tabular-nums">{item.badge}</span>
					{/if}
				</a>
				{#if item.items?.length}
					<ul class="flex flex-col pb-1 pl-3">
						{#each item.items as child (child.label)}
							<li>
								<a
									href={child.href}
									onclick={() => (menuOpen = false)}
									class="block rounded-xl px-3 py-2 font-sans text-[13px] text-text-muted hover:bg-bg-inset {toneText[
										tone
									]}"
								>
									{child.label}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</li>
		{/each}
	</ul>

	{#if actions || mobileExtra}
		<div class="mt-6 flex flex-col gap-3 border-t border-hairline pt-6">
			{#if mobileExtra}
				{@render mobileExtra()}
			{:else if actions}
				{@render actions()}
			{/if}
		</div>
	{/if}
</Drawer>
