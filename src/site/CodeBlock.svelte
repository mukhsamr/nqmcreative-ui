<script lang="ts">
	import { toast } from '$lib/core/toast.svelte.js';

	interface Props {
		code: string;
		/** Shown in the header strip. */
		label?: string;
		class?: string;
	}

	let { code, label, class: className = '' }: Props = $props();

	async function copy() {
		try {
			await navigator.clipboard.writeText(code);
			toast.success('Copied');
		} catch {
			toast.error('Could not copy — your browser blocked it');
		}
	}
</script>

<div class="flex flex-col border border-hairline bg-bg-alt {className}">
	<div class="flex items-center justify-between gap-4 border-b border-hairline px-4 py-2">
		<span class="font-mono text-[10px] tracking-wide text-text-muted uppercase"
			>{label ?? 'code'}</span
		>
		<button
			type="button"
			onclick={copy}
			class="inline-flex items-center gap-1.5 font-mono text-[11px] text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
		>
			<svg class="size-3" viewBox="0 0 14 14" fill="none" aria-hidden="true">
				<rect x="4.5" y="4.5" width="8" height="8" stroke="currentColor" stroke-width="1.3" />
				<path d="M9.5 1.5h-8v8" stroke="currentColor" stroke-width="1.3" />
			</svg>
			copy
		</button>
	</div>
	<pre class="overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-text-secondary"><code
			>{code}</code
		></pre>
</div>
