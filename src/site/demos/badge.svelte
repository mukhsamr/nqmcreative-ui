<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import { TONES } from '$lib/tones.js';
</script>

<div class="flex flex-wrap items-center gap-2">
	{#each TONES as tone (tone)}
		<Badge {tone} dot>{tone}</Badge>
	{/each}
	<Badge variant="solid">Solid</Badge>
	<Badge variant="outline" tone="accent">Outline</Badge>
</div>
