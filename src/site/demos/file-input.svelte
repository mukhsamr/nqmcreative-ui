<script lang="ts">
	import FileInput from '$lib/styles/matte/FileInput.svelte';

	let files = $state<File[]>([]);
</script>

<div class="w-full max-w-md">
	<FileInput bind:files accept="image/*,.pdf" maxSize={2 * 1024 * 1024} tone="accent" />
</div>
