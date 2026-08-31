<script lang="ts">
	import TimeInput from '$lib/styles/matte/TimeInput.svelte';

	let start = $state('09:00');
</script>

<div class="flex w-full max-w-xs flex-col gap-2">
	<TimeInput bind:value={start} min="08:00" max="17:00" step={15} />
	<p class="font-mono text-xs text-text-muted">{start || 'empty'} · 08:00–17:00, 15 min</p>
</div>
