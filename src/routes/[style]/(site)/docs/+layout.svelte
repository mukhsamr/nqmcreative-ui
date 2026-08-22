<script lang="ts">
	import { page } from '$app/state';
	import { docs } from '$site/docs.js';

	let { data, children } = $props();

	const base = $derived(`/${data.style}`);

	const index = $derived(docs.findIndex((doc) => page.url.pathname.endsWith(doc.slug)));
	const previous = $derived(index > 0 ? docs[index - 1] : null);
	const next = $derived(index >= 0 && index < docs.length - 1 ? docs[index + 1] : null);
</script>

<div class="flex max-w-2xl flex-col gap-10">
	{@render children()}

	<nav class="flex items-stretch gap-px border-t border-hairline pt-6">
		<div class="flex-1">
			{#if previous}
				<a
					href="{base}/docs/{previous.slug}"
					class="flex flex-col gap-1 py-2 font-sans transition-colors duration-150 hover:text-brand"
				>
					<span class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Previous</span
					>
					<span class="text-sm">{previous.title}</span>
				</a>
			{/if}
		</div>
		<div class="flex-1 text-right">
			{#if next}
				<a
					href="{base}/docs/{next.slug}"
					class="flex flex-col gap-1 py-2 font-sans transition-colors duration-150 hover:text-brand"
				>
					<span class="font-mono text-[10px] tracking-wide text-text-muted uppercase">Next</span>
					<span class="text-sm">{next.title}</span>
				</a>
			{/if}
		</div>
	</nav>
</div>
