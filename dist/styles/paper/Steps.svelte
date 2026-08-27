<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface StepItem {
		label: string;
		description?: string;
		/** Replaces the step number. A finished step still shows its check. */
		icon?: Snippet;
		/** Marks the step as failed — shown in `danger` regardless of position. */
		error?: boolean;
		disabled?: boolean;
	}
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { iconMd } from './icon.js';
	import { focusRing, toneFill, toneRing, toneText, type Tone } from '../../core/tones.js';

	interface Props extends Omit<HTMLAttributes<HTMLElement>, 'onchange'> {
		items: StepItem[];
		/** Bindable, zero-based. Steps before it count as done. */
		current?: number;
		orientation?: 'horizontal' | 'vertical';
		tone?: Tone;
		/** Let the user jump to a completed step by clicking it. */
		clickable?: boolean;
		/** Hide the connecting rule between steps. */
		bare?: boolean;
		onchange?: (index: number) => void;
	}

	let {
		items,
		current = $bindable(0),
		orientation = 'horizontal',
		tone = 'brand',
		clickable = false,
		bare = false,
		class: className = '',
		onchange,
		...rest
	}: Props = $props();

	function status(index: number): 'done' | 'current' | 'todo' {
		if (index < current) return 'done';
		if (index === current) return 'current';
		return 'todo';
	}

	const marker =
		'flex size-8 shrink-0 items-center justify-center rounded-full border font-sans text-xs font-semibold transition-colors duration-150 ease-brand-out';

	function markerTone(state: 'done' | 'current' | 'todo', item: StepItem) {
		if (item.error) return 'border-danger bg-danger-light text-danger';
		if (state === 'done') return `${toneFill[tone]} border-transparent text-text-inverse shadow-xs`;
		if (state === 'current') return `border-2 border-current bg-bg ${toneText[tone]}`;
		return 'border-hairline-strong bg-bg text-text-muted';
	}

	function go(index: number, item: StepItem) {
		if (!clickable || item.disabled || index > current) return;
		current = index;
		onchange?.(index);
	}
</script>

{#snippet glyph(index: number, state: 'done' | 'current' | 'todo', item: StepItem)}
	{#if item.error}
		!
	{:else if state === 'done'}
		<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
			<path
				d="m2 7 3.2 3.2L12 3.6"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{:else if item.icon}
		<span class={iconMd}>{@render item.icon()}</span>
	{:else}
		{index + 1}
	{/if}
{/snippet}

<nav
	aria-label="Progress"
	class="flex w-full {orientation === 'vertical' ? 'flex-col gap-0' : 'flex-row'} {className}"
	{...rest}
>
	{#each items as item, i (item.label)}
		{@const state = status(i)}
		<div
			class="flex min-w-0 {orientation === 'vertical' ? 'flex-row gap-3' : 'flex-1 flex-col gap-2'}"
		>
			<!-- marker + rule -->
			<div
				class="flex shrink-0 items-center {orientation === 'vertical'
					? 'flex-col self-stretch'
					: 'w-full flex-row'}"
			>
				{#if clickable && state !== 'todo' && !item.disabled}
					<button
						type="button"
						onclick={() => go(i, item)}
						aria-current={state === 'current' ? 'step' : undefined}
						class="{marker} cursor-pointer {markerTone(state, item)} {focusRing} {toneRing[tone]}"
					>
						{@render glyph(i, state, item)}
					</button>
				{:else}
					<div
						aria-current={state === 'current' ? 'step' : undefined}
						class="{marker} {markerTone(state, item)}"
					>
						{@render glyph(i, state, item)}
					</div>
				{/if}

				{#if !bare && i < items.length - 1}
					<span
						class="rounded-full {orientation === 'vertical'
							? 'my-1 w-0.5 flex-1'
							: 'mx-3 h-0.5 flex-1'} {i < current ? toneFill[tone] : 'bg-hairline'}"
					></span>
				{/if}
			</div>

			<!-- copy -->
			<div class="flex min-w-0 flex-col gap-0.5 {orientation === 'vertical' ? 'pb-6' : 'pr-3'}">
				<span
					class="font-sans text-sm leading-snug break-words {state === 'todo'
						? 'text-text-muted'
						: 'font-medium text-text'}"
				>
					{item.label}
				</span>
				{#if item.description}
					<span class="font-sans text-[13px] leading-snug break-words text-text-muted">
						{item.description}
					</span>
				{/if}
			</div>
		</div>
	{/each}
</nav>
