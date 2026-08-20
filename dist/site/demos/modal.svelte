<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Modal from '../../components/Modal.svelte';

	let open = $state(false);
</script>

<Button onclick={() => (open = true)}>Open modal</Button>

<Modal
	bind:open
	title="Archive this project?"
	description="It stays readable but stops accepting work."
>
	Archiving moves it out of the active list. You can restore it at any time.
	{#snippet footer()}
		<Button variant="ghost" tone="neutral" onclick={() => (open = false)}>Cancel</Button>
		<Button tone="danger" onclick={() => (open = false)}>Archive</Button>
	{/snippet}
</Modal>
