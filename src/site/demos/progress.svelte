<script lang="ts">
	import Progress from '$lib/components/Progress.svelte';
</script>

<div class="flex w-full max-w-sm flex-col gap-5">
	<Progress value={72} label="Storage" showValue />
	<Progress value={38} label="Queue" tone="accent" size="lg" showValue />
</div>
