<script lang="ts">
	import Badge from '$lib/styles/matte/Badge.svelte';
	import { TONES } from '$lib/core/tones.js';
</script>

<div class="flex w-full flex-col gap-6">
	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">variant</p>
		<div class="flex flex-wrap items-center gap-2">
			<Badge variant="soft">Soft</Badge>
			<Badge variant="solid">Solid</Badge>
			<Badge variant="outline">Outline</Badge>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">size</p>
		<div class="flex flex-wrap items-center gap-2">
			<Badge size="sm">Small</Badge>
			<Badge size="md">Medium</Badge>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">tone</p>
		<div class="flex flex-wrap items-center gap-2">
			{#each TONES as tone (tone)}
				<Badge {tone}>{tone}</Badge>
			{/each}
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">dot</p>
		<div class="flex flex-wrap items-center gap-2">
			<Badge dot>Live</Badge>
			<Badge dot tone="warning" variant="outline">Queued</Badge>
			<Badge dot tone="danger" variant="solid">Failed</Badge>
		</div>
	</div>
</div>
