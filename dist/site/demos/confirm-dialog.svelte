<script lang="ts">
	import Button from '../../components/Button.svelte';
	import ConfirmDialog from '../../components/ConfirmDialog.svelte';

	let open = $state(false);
</script>

<Button tone="danger" variant="soft" onclick={() => (open = true)}>Delete project…</Button>

<ConfirmDialog
	bind:open
	title="Delete this project?"
	description="Everything in it goes too. This cannot be undone."
	confirmLabel="Delete"
	onconfirm={() => new Promise((r) => setTimeout(r, 900))}
/>
