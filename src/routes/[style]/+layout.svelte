<script lang="ts">
	import { UI } from '$site/ui.js';

	let { data, children } = $props();

	const ui = $derived(UI[data.style]);

	/**
	 * `data-style` is written server-side (src/hooks.server.ts) so the first
	 * paint is already right — but a server hook does not run on a client-side
	 * navigation. Cross-style links carry `data-sveltekit-reload` for that
	 * reason; this effect is the safety net, so a link that ever misses the
	 * attribute leaves the components and the tokens disagreeing for one frame
	 * rather than for the whole visit.
	 */
	$effect(() => {
		document.documentElement.dataset.style = data.style;
	});
</script>

{@render children()}

<!--
	One Toaster per page, from the style this route belongs to. It portals to
	<body>, which is why `data-style` goes on <html> (see src/hooks.server.ts)
	rather than on a wrapper — a toast has to reach the tokens too.
-->
<ui.Toaster position="bottom-right" />
