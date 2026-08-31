<script lang="ts">
	import Input from '$lib/styles/matte/Input.svelte';
	import InputAddon from '$lib/styles/matte/InputAddon.svelte';
	import InputGroup from '$lib/styles/matte/InputGroup.svelte';

	let handle = $state('');
	let weight = $state('');
</script>

<div class="flex w-full max-w-sm flex-col gap-3">
	<InputGroup>
		<InputAddon>https://</InputAddon>
		<Input bind:value={handle} placeholder="studio" />
		<InputAddon>.com</InputAddon>
	</InputGroup>

	<InputGroup>
		<Input bind:value={weight} placeholder="0" inputmode="decimal" />
		<InputAddon>kg</InputAddon>
	</InputGroup>
</div>
