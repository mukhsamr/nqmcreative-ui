<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import InputGroup from '$lib/components/InputGroup.svelte';

	let value = $state('');
</script>

<InputGroup class="max-w-sm">
	<Input bind:value placeholder="you@studio.com" />
	<Button>Subscribe</Button>
</InputGroup>
