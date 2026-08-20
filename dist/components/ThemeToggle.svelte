<script module lang="ts">
	export type Theme = 'light' | 'dark' | 'system';

	const STORAGE_KEY = 'nqm-theme';

	/** Writes the theme classes `theme.css` reads. Safe to call before mount. */
	export function applyTheme(theme: Theme) {
		const root = document.documentElement;
		root.classList.toggle('dark', theme === 'dark');
		root.classList.toggle('light', theme === 'light');
	}

	/** The stored choice, or `'system'` when the visitor has never picked one. */
	export function storedTheme(): Theme {
		if (typeof localStorage === 'undefined') return 'system';
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved === 'light' || saved === 'dark' ? saved : 'system';
	}
</script>

<script lang="ts">
	import { focusRing, toneRing, toneSoft, type Tone } from '../tones.js';
	import { useLocale } from '../locale.svelte.js';

	interface Props {
		/** Bindable. `'system'` follows the OS until the visitor chooses. */
		theme?: Theme;
		/** `'button'` cycles light → dark → system; `'segmented'` shows all three. */
		variant?: 'button' | 'segmented';
		tone?: Tone;
		/** Remember the choice in `localStorage`. Default true. */
		persist?: boolean;
		onchange?: (theme: Theme) => void;
		class?: string;
	}

	let {
		theme = $bindable(storedTheme()),
		variant = 'button',
		tone = 'neutral',
		persist = true,
		onchange,
		class: className = ''
	}: Props = $props();

	const t = useLocale();

	$effect(() => {
		applyTheme(theme);
		if (persist && typeof localStorage !== 'undefined') {
			if (theme === 'system') localStorage.removeItem(STORAGE_KEY);
			else localStorage.setItem(STORAGE_KEY, theme);
		}
	});

	function set(next: Theme) {
		theme = next;
		onchange?.(next);
	}

	function cycle() {
		set(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
	}

	const options = $derived([
		{ value: 'light' as Theme, label: t.current.lightMode },
		{ value: 'dark' as Theme, label: t.current.darkMode },
		{ value: 'system' as Theme, label: 'Auto' }
	]);
</script>

{#snippet glyph(which: Theme)}
	{#if which === 'light'}
		<svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<circle cx="10" cy="10" r="3.5" stroke="currentColor" stroke-width="1.5" />
			<path
				d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5 6 6M14 14l1.5 1.5M15.5 4.5 14 6M6 14l-1.5 1.5"
				stroke="currentColor"
				stroke-width="1.5"
			/>
		</svg>
	{:else if which === 'dark'}
		<svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<path
				d="M16 12.3A6.8 6.8 0 0 1 7.7 4a6.8 6.8 0 1 0 8.3 8.3Z"
				stroke="currentColor"
				stroke-width="1.5"
			/>
		</svg>
	{:else}
		<svg class="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
			<rect x="2.5" y="4" width="15" height="10" stroke="currentColor" stroke-width="1.5" />
			<path d="M7 17h6" stroke="currentColor" stroke-width="1.5" />
		</svg>
	{/if}
{/snippet}

{#if variant === 'segmented'}
	<div
		role="radiogroup"
		aria-label={t.current.toggleTheme}
		class="inline-flex items-center gap-0 border border-hairline bg-bg-alt p-1 {className}"
	>
		{#each options as option (option.value)}
			<button
				type="button"
				role="radio"
				aria-checked={theme === option.value}
				aria-label={option.label}
				onclick={() => set(option.value)}
				class="inline-flex h-8 items-center gap-1.5 px-3 font-sans text-[13px] transition-colors duration-150 ease-brand-out {focusRing} {toneRing[
					tone
				]}
					{theme === option.value ? 'bg-bg font-medium text-text' : 'text-text-secondary hover:text-text'}"
			>
				{@render glyph(option.value)}
				<span class="hidden sm:inline">{option.label}</span>
			</button>
		{/each}
	</div>
{:else}
	<button
		type="button"
		onclick={cycle}
		aria-label="{t.current.toggleTheme} ({theme})"
		title={t.current.toggleTheme}
		class="inline-flex size-9 items-center justify-center border border-hairline transition-colors duration-150 ease-brand-out {focusRing} {toneRing[
			tone
		]} {toneSoft[tone]} {className}"
	>
		{@render glyph(theme)}
	</button>
{/if}
