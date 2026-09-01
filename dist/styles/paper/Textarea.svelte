<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';
	import { focusRing, toneFocusBorder, toneRing, type Tone } from '../../core/tones.js';

	interface Props extends HTMLTextareaAttributes {
		value?: string;
		tone?: Tone;
		invalid?: boolean;
		/** Grow with the content instead of showing a scrollbar. */
		autoresize?: boolean;
	}

	let {
		value = $bindable(''),
		tone = 'brand',
		invalid = false,
		autoresize = false,
		rows = 4,
		class: className = '',
		...rest
	}: Props = $props();

	/** Grows the field to fit its content on input, and once on mount. */
	function autosize(node: HTMLTextAreaElement, enabled: boolean) {
		let on = enabled;
		const resize = () => {
			if (!on) return;
			node.style.height = 'auto';
			node.style.height = `${node.scrollHeight}px`;
		};
		resize();
		node.addEventListener('input', resize);
		return {
			update(next: boolean) {
				on = next;
				if (on) resize();
				else node.style.height = '';
			},
			destroy() {
				node.removeEventListener('input', resize);
			}
		};
	}
</script>

<textarea
	use:autosize={autoresize}
	bind:value
	{rows}
	aria-invalid={invalid ? 'true' : undefined}
	class="{focusRing} {toneRing[
		tone
	]} w-full rounded-md border bg-bg px-3 py-2 font-sans text-sm text-text shadow-xs transition-colors duration-150 ease-brand-out placeholder:text-text-muted disabled:pointer-events-none disabled:opacity-50
		{autoresize ? 'resize-none overflow-hidden' : 'resize-y'}
		{invalid ? 'border-danger' : `border-hairline-strong ${toneFocusBorder[tone]}`} {className}"
	{...rest}></textarea>
