<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import Input from '$lib/styles/matte/Input.svelte';
	import InputGroup from '$lib/styles/matte/InputGroup.svelte';

	let value = $state('');
</script>

<InputGroup class="max-w-sm">
	<Input bind:value placeholder="you@studio.com" />
	<Button>Subscribe</Button>
</InputGroup>
