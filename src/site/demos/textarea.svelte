<script lang="ts">
	import Textarea from '$lib/styles/matte/Textarea.svelte';

	let value = $state('');
</script>

<Textarea bind:value placeholder="Tell us about the project…" class="max-w-sm" />
