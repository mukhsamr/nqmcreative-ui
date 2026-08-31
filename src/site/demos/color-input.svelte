<script lang="ts">
	import ColorInput from '$lib/styles/matte/ColorInput.svelte';

	let colour = $state('#0f766e');
</script>

<div class="w-full max-w-xs">
	<ColorInput
		bind:value={colour}
		swatches={['#0f766e', '#b45309', '#1d4ed8', '#be123c', '#111827']}
	/>
</div>
