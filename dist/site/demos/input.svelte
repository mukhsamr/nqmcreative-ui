<script lang="ts">
	import Input from '../../components/Input.svelte';

	let value = $state('');
</script>

<div class="flex w-full max-w-sm flex-col gap-3">
	<Input bind:value placeholder="you@studio.com" />
	<Input placeholder="50.000.000" tone="accent">
		{#snippet prefix()}<span class="font-mono text-xs">Rp</span>{/snippet}
	</Input>
	<Input invalid placeholder="Invalid" />
</div>
