<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import Modal from '$lib/styles/matte/Modal.svelte';

	let open = $state(false);
</script>

{#snippet archive()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<rect x="2" y="2.5" width="12" height="3" stroke="currentColor" stroke-width="1.4" />
		<path d="M3 5.5v8h10v-8M6.5 8.5h3" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

<Button onclick={() => (open = true)}>Open modal</Button>

<Modal
	bind:open
	icon={archive}
	title="Archive this project?"
	description="It stays readable but stops accepting work."
>
	Archiving moves it out of the active list. You can restore it at any time.
	{#snippet footer()}
		<Button variant="ghost" tone="neutral" onclick={() => (open = false)}>Cancel</Button>
		<Button tone="danger" onclick={() => (open = false)}>Archive</Button>
	{/snippet}
</Modal>
