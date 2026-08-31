<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { useLocale } from '../../core/locale.svelte.js';
	import type { Tone } from '../../core/tones.js';
	import Input, { type InputSize } from './Input.svelte';

	interface Props extends Omit<HTMLInputAttributes, 'size' | 'prefix' | 'type'> {
		value?: string;
		size?: InputSize;
		tone?: Tone;
		invalid?: boolean;
		/**
		 * Milliseconds to wait after the last keystroke before `onsearch` fires.
		 * `0` fires on every one.
		 */
		debounce?: number;
		/** The debounced value. The bound `value` still updates immediately. */
		onsearch?: (value: string) => void;
		onclear?: () => void;
		/** Replaces the magnifier. */
		icon?: Snippet;
		class?: string;
	}

	let {
		value = $bindable(''),
		size = 'md',
		tone = 'brand',
		invalid = false,
		disabled = false,
		debounce = 0,
		onsearch,
		onclear,
		icon,
		class: className = '',
		...rest
	}: Props = $props();

	const t = useLocale();

	// The timer is cleared by the effect's own teardown, so a keystroke that
	// lands mid-wait restarts the clock rather than queueing a second call.
	$effect(() => {
		const next = value;
		if (!onsearch) return;
		if (debounce <= 0) {
			onsearch(next);
			return;
		}
		const timer = setTimeout(() => onsearch(next), debounce);
		return () => clearTimeout(timer);
	});

	function clear() {
		value = '';
		onclear?.();
	}
</script>

<Input bind:value type="search" {size} {tone} {invalid} {disabled} class={className} {...rest}>
	{#snippet prefix()}
		{#if icon}
			{@render icon()}
		{:else}
			<svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5" />
				<path d="m13 13 3.5 3.5" stroke="currentColor" stroke-width="1.5" />
			</svg>
		{/if}
	{/snippet}

	{#snippet suffix()}
		{#if value}
			<button
				type="button"
				onclick={clear}
				aria-label={t.current.clearSearch}
				class="-mr-1 p-1 text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
			>
				<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					<path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="1.5" />
				</svg>
			</button>
		{/if}
	{/snippet}
</Input>
