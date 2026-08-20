<script lang="ts">
	import PasswordInput from '$lib/components/PasswordInput.svelte';

	let value = $state('nqm');
</script>

<div class="w-full max-w-sm">
	<PasswordInput bind:value strength />
</div>
