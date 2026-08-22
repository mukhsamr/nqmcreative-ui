<script lang="ts">
	import NumberInput from '$lib/styles/matte/NumberInput.svelte';

	let value = $state(3);
</script>

<NumberInput bind:value min={0} max={10} class="max-w-40" />
