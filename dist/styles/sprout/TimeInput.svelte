<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { useLocale } from '../../core/locale.svelte.js';
	import { clampTime, formatTime, parseTime, stepTime } from '../../core/time.js';
	import type { Tone } from '../../core/tones.js';
	import Input, { type InputSize } from './Input.svelte';

	interface Props extends Omit<
		HTMLInputAttributes,
		'size' | 'prefix' | 'suffix' | 'min' | 'max' | 'step'
	> {
		/** Bindable `HH:MM`, or `''` for empty. */
		value?: string;
		/** Inclusive bounds, `HH:MM`. */
		min?: string;
		max?: string;
		/** Minutes one press of a stepper moves, and what typing snaps to. */
		step?: number;
		size?: InputSize;
		tone?: Tone;
		invalid?: boolean;
		/** Hide the steppers and let the field be typed into only. */
		steppers?: boolean;
		class?: string;
	}

	let {
		value = $bindable(''),
		min,
		max,
		step = 15,
		size = 'md',
		tone = 'brand',
		invalid = false,
		disabled = false,
		steppers = true,
		class: className = '',
		...rest
	}: Props = $props();

	const t = useLocale();

	// Typed text and the bound value are separate until the field settles:
	// `9` is a valid thing to be halfway through typing and an invalid time.
	let text = $state('');
	let editing = $state(false);

	$effect(() => {
		if (!editing) text = value;
	});

	function settle() {
		editing = false;
		const minutes = parseTime(text);
		value = minutes === null ? '' : formatTime(clampTime(minutes, min, max, step));
		text = value;
	}

	function nudge(direction: 1 | -1) {
		value = stepTime(value, direction, step, min, max);
		text = value;
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowUp') {
			event.preventDefault();
			nudge(1);
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			nudge(-1);
		} else if (event.key === 'Enter') {
			settle();
		}
	}

	const stepper =
		'grid size-6 place-items-center rounded text-text-secondary transition-colors duration-150 hover:bg-bg-inset hover:text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current';
</script>

<Input
	bind:value={text}
	{size}
	{tone}
	{invalid}
	{disabled}
	inputmode="numeric"
	placeholder="--:--"
	onfocus={() => (editing = true)}
	onblur={settle}
	onkeydown={onKeydown}
	class="[&_input]:tabular-nums {className}"
	{...rest}
>
	{#snippet prefix()}
		<svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<circle
				cx="10"
				cy="10"
				r="6.5"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M10 6.5V10l2.5 1.5"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	{/snippet}

	{#snippet suffix()}
		{#if steppers}
			<span class="-mr-2 flex flex-col">
				<button
					type="button"
					class={stepper}
					{disabled}
					onclick={() => nudge(1)}
					aria-label={t.current.increase}
				>
					<svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
						<path
							d="m3 7.5 3-3 3 3"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
				<button
					type="button"
					class={stepper}
					{disabled}
					onclick={() => nudge(-1)}
					aria-label={t.current.decrease}
				>
					<svg class="size-3" viewBox="0 0 12 12" fill="none" aria-hidden="true">
						<path
							d="m3 4.5 3 3 3-3"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</span>
		{/if}
	{/snippet}
</Input>
