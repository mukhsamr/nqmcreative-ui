<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneText, type Tone } from '../../core/tones.js';
	import { useLocale } from '../../core/locale.svelte.js';

	export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg';

	interface Props extends HTMLAttributes<HTMLSpanElement> {
		size?: SpinnerSize;
		/** Omit to inherit the parent's `currentColor` (e.g. inside a Button). */
		tone?: Tone;
		/** Defaults to the locale's loading string; pass `''` to hide it. */
		label?: string;
	}

	const t = useLocale();

	let { size = 'md', tone, label, class: className = '', ...rest }: Props = $props();

	const sizes: Record<SpinnerSize, string> = {
		xs: 'size-3 border-[1.5px]',
		sm: 'size-4 border-2',
		md: 'size-5 border-2',
		lg: 'size-8 border-[3px]'
	};
</script>

<span
	role="status"
	aria-label={label ?? t.current.loading}
	class="inline-block shrink-0 animate-spin rounded-full border-current/25 border-t-current
		{sizes[size]} {tone ? toneText[tone] : ''} {className}"
	{...rest}
></span>
