<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
</script>

<EmptyState
	title="No projects yet"
	description="Create your first project to see it here."
	tone="brand"
>
	{#snippet action()}
		<Button size="sm">New project</Button>
	{/snippet}
</EmptyState>
