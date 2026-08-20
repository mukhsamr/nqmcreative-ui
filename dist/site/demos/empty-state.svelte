<script lang="ts">
	import Button from '../../components/Button.svelte';
	import EmptyState from '../../components/EmptyState.svelte';
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
