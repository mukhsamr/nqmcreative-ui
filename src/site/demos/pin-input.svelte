<script lang="ts">
	import PinInput from '$lib/styles/matte/PinInput.svelte';

	let code = $state('');
	let done = $state('');
</script>

<div class="flex flex-col gap-3">
	<PinInput bind:value={code} length={6} groupAfter={3} oncomplete={(value) => (done = value)} />
	<p class="font-mono text-xs text-text-muted">
		{done ? `submitted ${done}` : `${code.length}/6`}
	</p>
</div>
