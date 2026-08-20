<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Input from '../../components/Input.svelte';
	import InputGroup from '../../components/InputGroup.svelte';

	let value = $state('');
</script>

<InputGroup class="max-w-sm">
	<Input bind:value placeholder="you@studio.com" />
	<Button>Subscribe</Button>
</InputGroup>
