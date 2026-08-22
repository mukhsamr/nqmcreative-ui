<script lang="ts">
	import Badge from '$lib/styles/matte/Badge.svelte';
	import Table from '$lib/styles/matte/Table.svelte';

	const rows = [
		{ id: 'p1', project: 'Sundara', client: 'Sundara', status: 'Live', budget: 84 },
		{ id: 'p2', project: 'Nusantara', client: 'NC Group', status: 'In review', budget: 52 },
		{ id: 'p3', project: 'Kelana', client: 'Kelana', status: 'Draft', budget: 120 }
	];

	const tones = { Live: 'success', 'In review': 'warning', Draft: 'neutral' } as const;
</script>

<Table
	selectable
	columns={[
		{ key: 'project', label: 'Project', sortable: true },
		{ key: 'client', label: 'Client' },
		{ key: 'status', label: 'Status' },
		{ key: 'budget', label: 'Budget', sortable: true, align: 'right', class: 'font-mono text-sm' }
	]}
	{rows}
>
	{#snippet cell({ row, column, value })}
		{#if column.key === 'status'}
			<Badge tone={tones[row.status as keyof typeof tones]} size="sm">{row.status}</Badge>
		{:else}
			{value}
		{/if}
	{/snippet}
</Table>
