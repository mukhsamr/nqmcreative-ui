<script lang="ts">
	import Skeleton from '$lib/components/Skeleton.svelte';
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
	<Skeleton variant="text" lines={3} />
	<Skeleton variant="circle" />
</div>
