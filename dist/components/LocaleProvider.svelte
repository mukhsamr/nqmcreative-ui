<script lang="ts">
	import type { Snippet } from 'svelte';
	import { provideLocale, type Locale } from '../locale.svelte.js';

	interface Props {
		/** Full locale or just the keys you want to change. */
		locale: Partial<Locale>;
		children: Snippet;
	}

	let { locale, children }: Props = $props();

	// Seeded during init so the first render already has the right strings —
	// an effect would leave one frame (and the SSR output) in the default
	// language. The effect below only handles later changes, e.g. a switcher.
	// svelte-ignore state_referenced_locally
	const store = provideLocale(locale);

	$effect(() => {
		store.replace(locale);
	});
</script>

{@render children()}
