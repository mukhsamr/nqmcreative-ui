<script lang="ts">
	import {
		addMonths,
		fromISO,
		isOutOfRange,
		isSameDay,
		monthGrid,
		monthLabel,
		toISO,
		today,
		weekdayNames
	} from '../../core/date.js';
	import { calendarKeyMove } from '../../core/calendar.js';
	import {
		focusRing,
		toneFill,
		toneRing,
		toneSoft,
		toneText,
		type Tone
	} from '../../core/tones.js';

	interface Props {
		/** Bindable `YYYY-MM-DD`, or `''` for nothing selected. */
		value?: string;
		/** Bindable `YYYY-MM-DD` inside the month on show. */
		month?: string;
		/** Inclusive bounds, `YYYY-MM-DD`. */
		min?: string;
		max?: string;
		/** Return true to grey out a specific day — weekends, holidays. */
		isDisabled?: (date: Date) => boolean;
		/** 1 = Monday (default), 0 = Sunday. */
		weekStart?: 0 | 1;
		tone?: Tone;
		/** Show the "Today" shortcut under the grid. */
		showToday?: boolean;
		onselect?: (value: string) => void;
		class?: string;
	}

	let {
		value = $bindable(''),
		month = $bindable(''),
		min,
		max,
		isDisabled,
		weekStart = 1,
		tone = 'brand',
		showToday = true,
		onselect,
		class: className = ''
	}: Props = $props();

	const selected = $derived(fromISO(value));
	const now = today();

	let view = $state(fromISO(month) ?? fromISO(value) ?? today());
	/** The day the arrow keys are on — not necessarily the selected one. */
	let focused = $state(fromISO(value) ?? today());
	let grid: HTMLElement | null = $state(null);

	// Follow the bound `month`/`value` when the parent changes them.
	$effect(() => {
		const next = fromISO(month) ?? fromISO(value);
		if (next && (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()))
			view = next;
	});

	const days = $derived(monthGrid(view, weekStart));
	const weekdays = $derived(weekdayNames(undefined, weekStart));

	function blocked(date: Date) {
		return isOutOfRange(date, min, max) || (isDisabled?.(date) ?? false);
	}

	function show(next: Date) {
		view = next;
		month = toISO(new Date(next.getFullYear(), next.getMonth(), 1));
	}

	function pick(date: Date) {
		if (blocked(date)) return;
		value = toISO(date);
		focused = date;
		if (date.getMonth() !== view.getMonth()) show(date);
		onselect?.(value);
	}

	function moveFocus(next: Date) {
		focused = next;
		if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear())
			show(next);
		queueMicrotask(() => grid?.querySelector<HTMLElement>('[data-focused="true"]')?.focus());
	}

	function onKeydown(event: KeyboardEvent) {
		const next = calendarKeyMove(event.key, focused, weekStart, event.shiftKey);
		if (next) {
			event.preventDefault();
			moveFocus(next);
			return;
		}
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			pick(focused);
		}
	}

	const arrow =
		'inline-flex size-8 items-center justify-center rounded-md text-text-secondary transition-colors duration-150 hover:bg-bg-inset hover:text-text';
</script>

<div class="flex w-[18rem] flex-col gap-3 p-3 font-sans {className}">
	<div class="flex items-center justify-between gap-2">
		<button
			type="button"
			onclick={() => show(addMonths(view, -1))}
			aria-label="Previous month"
			class="{arrow} {focusRing} {toneRing[tone]}"
		>
			<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="m10 4-4 4 4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
			</svg>
		</button>

		<span aria-live="polite" class="text-sm font-semibold text-text">
			{monthLabel(view)}
		</span>

		<button
			type="button"
			onclick={() => show(addMonths(view, 1))}
			aria-label="Next month"
			class="{arrow} {focusRing} {toneRing[tone]}"
		>
			<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="m6 4 4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
			</svg>
		</button>
	</div>

	<div class="grid grid-cols-7 gap-0.5">
		{#each weekdays as name, i (i)}
			<span class="pb-1 text-center text-[11px] font-medium text-text-muted">{name}</span>
		{/each}
	</div>

	<!-- Roving tabindex: the grid itself is never a tab stop, the focused day is. -->
	<div
		bind:this={grid}
		role="grid"
		tabindex="-1"
		aria-label="Select a date"
		onkeydown={onKeydown}
		class="grid grid-cols-7 gap-0.5 focus:outline-none"
	>
		{#each days as day (toISO(day))}
			{@const outside = day.getMonth() !== view.getMonth()}
			{@const off = blocked(day)}
			{@const isSelected = isSameDay(day, selected)}
			{@const isFocused = isSameDay(day, focused)}
			<button
				type="button"
				role="gridcell"
				data-focused={isFocused}
				tabindex={isFocused ? 0 : -1}
				disabled={off}
				aria-selected={isSelected}
				aria-current={isSameDay(day, now) ? 'date' : undefined}
				onclick={() => pick(day)}
				class="flex h-9 items-center justify-center rounded-md text-[13px] tabular-nums transition-colors duration-100 disabled:pointer-events-none disabled:opacity-30 {focusRing} {toneRing[
					tone
				]}
					{isSelected
					? `${toneFill[tone]} font-semibold text-text-inverse`
					: outside
						? 'text-text-muted/60 hover:bg-bg-inset'
						: 'text-text-secondary hover:bg-bg-inset hover:text-text'}
					{!isSelected && isSameDay(day, now) ? `${toneSoft[tone]} font-semibold` : ''}"
			>
				{day.getDate()}
			</button>
		{/each}
	</div>

	{#if showToday}
		<button
			type="button"
			onclick={() => pick(now)}
			disabled={blocked(now)}
			class="self-start rounded px-1 text-[13px] font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-40 {toneText[
				tone
			]} hover:underline hover:underline-offset-2 {focusRing} {toneRing[tone]}"
		>
			Today
		</button>
	{/if}
</div>
