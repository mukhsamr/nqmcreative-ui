<script lang="ts">
	import CurrencyInput from '$lib/styles/matte/CurrencyInput.svelte';

	let price = $state<number | null>(1250000);
</script>

<div class="flex w-full max-w-sm flex-col gap-2">
	<CurrencyInput bind:value={price} currency="Rp" group="." decimal="," precision={0} min={0} />
	<p class="font-mono text-xs text-text-muted">bound value: {price ?? 'null'}</p>
</div>
