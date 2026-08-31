<script lang="ts">
	import { useLocale } from '../../core/locale.svelte.js';
	import { caretIndex, clearFrom, fillFrom, sanitisePin, type PinMode } from '../../core/pin.js';
	import { toneFocusBorder, type Tone } from '../../core/tones.js';
	import { edge } from './lift.js';

	interface Props {
		/** Bindable code. Shorter than `length` means still incomplete. */
		value?: string;
		/** How many boxes. */
		length?: number;
		/** What a box accepts. */
		mode?: PinMode;
		/** Render the characters as dots. */
		mask?: boolean;
		/** Draw a gap after this many boxes — `3` gives `123 456`. */
		groupAfter?: number;
		disabled?: boolean;
		invalid?: boolean;
		tone?: Tone;
		/** `name` for a plain form submit — one hidden field holding the code. */
		name?: string;
		/** Fires once the last box is filled. */
		oncomplete?: (value: string) => void;
		class?: string;
	}

	let {
		value = $bindable(''),
		length = 6,
		mode = 'numeric',
		mask = false,
		groupAfter = 0,
		disabled = false,
		invalid = false,
		tone = 'brand',
		name,
		oncomplete,
		class: className = ''
	}: Props = $props();

	const t = useLocale();

	let boxes: HTMLInputElement[] = $state([]);

	const chars = $derived(Array.from({ length }, (_, i) => value[i] ?? ''));

	function focusAt(index: number) {
		boxes[Math.max(0, Math.min(length - 1, index))]?.focus();
	}

	/**
	 * The DOM is written back on every keystroke, not only when the value
	 * changed: a refused character leaves the box holding text the state never
	 * accepted, and nothing else would clear it.
	 */
	function sync(box: HTMLInputElement, index: number) {
		box.value = value[index] ?? '';
	}

	function commit(next: string, from: number) {
		const was = value;
		value = next;
		if (value.length === length && was.length < length) oncomplete?.(value);
		// Land on the first empty box, or the one after whatever was just typed.
		focusAt(Math.min(Math.max(from, caretIndex(value, length)), length - 1));
	}

	function onInput(event: Event & { currentTarget: HTMLInputElement }, index: number) {
		const typed = sanitisePin(event.currentTarget.value, mode);
		if (!typed) {
			sync(event.currentTarget, index);
			return;
		}
		const next = fillFrom(value, index, typed, length, mode);
		commit(next, index + typed.length);
		for (const [at, box] of boxes.entries()) sync(box, at);
	}

	function onKeydown(event: KeyboardEvent, index: number) {
		if (event.key === 'Backspace') {
			event.preventDefault();
			// An empty box deletes the one before it, the way a caret would.
			const target = value[index] ? index : index - 1;
			if (target < 0) return;
			value = clearFrom(value, target);
			for (const [at, box] of boxes.entries()) sync(box, at);
			focusAt(target);
		} else if (event.key === 'ArrowLeft') {
			event.preventDefault();
			focusAt(index - 1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			focusAt(index + 1);
		}
	}

	function onPaste(event: ClipboardEvent, index: number) {
		event.preventDefault();
		const text = event.clipboardData?.getData('text') ?? '';
		const clean = sanitisePin(text, mode);
		if (!clean) return;
		commit(fillFrom(value, index, clean, length, mode), index + clean.length);
		for (const [at, box] of boxes.entries()) sync(box, at);
	}
</script>

<div class="flex items-center gap-2 {className}">
	{#each chars as char, index (index)}
		{#if groupAfter && index > 0 && index % groupAfter === 0}
			<span class="h-px w-2 bg-hairline-strong" aria-hidden="true"></span>
		{/if}
		<input
			bind:this={boxes[index]}
			value={char}
			{disabled}
			type={mask ? 'password' : 'text'}
			inputmode={mode === 'numeric' ? 'numeric' : 'text'}
			autocomplete={index === 0 ? 'one-time-code' : 'off'}
			autocapitalize="characters"
			spellcheck="false"
			maxlength={length}
			aria-label="{t.current.digit} {index + 1}"
			aria-invalid={invalid ? 'true' : undefined}
			oninput={(event) => onInput(event, index)}
			onkeydown={(event) => onKeydown(event, index)}
			onpaste={(event) => onPaste(event, index)}
			onfocus={(event) => event.currentTarget.select()}
			class="size-11 rounded-xl border bg-bg text-center font-sans text-base font-medium text-text tabular-nums {edge} transition-colors duration-150 ease-brand-out focus:outline-none
				{invalid ? 'border-danger' : `border-hairline-strong ${toneFocusBorder[tone]}`}
				{disabled ? 'pointer-events-none opacity-50' : ''}"
		/>
	{/each}

	{#if name}
		<input type="hidden" {name} {value} />
	{/if}
</div>
