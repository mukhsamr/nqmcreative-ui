<script lang="ts">
	import Dropzone from '$lib/styles/matte/Dropzone.svelte';
</script>

<div class="w-full max-w-md">
	<Dropzone accept="image/*,.pdf" maxSize={5 * 1024 * 1024} maxFiles={4} tone="accent" />
</div>
