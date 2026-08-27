<script lang="ts">
	import Stat from '$lib/styles/matte/Stat.svelte';
</script>

{#snippet coin()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.4" />
		<path d="M8 5v6M6.5 6.5h3M6.5 9.5h3" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

{#snippet users()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<circle cx="6" cy="6" r="2.4" stroke="currentColor" stroke-width="1.4" />
		<path
			d="M2 13.5c0-2.2 1.8-3.5 4-3.5s4 1.3 4 3.5M11 5.2a2.2 2.2 0 0 1 0 4.1m1 4.2c0-1.5-.5-2.6-1.4-3.3"
			stroke="currentColor"
			stroke-width="1.4"
		/>
	</svg>
{/snippet}

{#snippet drop()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M8 2c2.5 3 4 5 4 7a4 4 0 1 1-8 0c0-2 1.5-4 4-7Z"
			stroke="currentColor"
			stroke-width="1.4"
		/>
	</svg>
{/snippet}

<div class="flex w-full flex-col gap-6">
	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">icon</p>
		<div class="flex flex-wrap gap-10">
			<Stat label="Revenue" value="1,2M" delta="12.4%" trend="up" icon={coin} />
			<Stat label="Active seats" value="248" delta="18" trend="up" icon={users} />
			<Stat label="Churn" value="2.1%" delta="0.4%" trend="down" tone="danger" icon={drop} />
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">tone + hint</p>
		<div class="flex flex-wrap gap-10">
			<Stat label="Runway" value="14 mo" hint="At the current burn." tone="brand" icon={coin} />
			<Stat label="Overdue" value="3" trend="flat" delta="unchanged" tone="warning" />
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">in a row of cells</p>
		<div class="grid gap-px border border-hairline bg-hairline sm:grid-cols-3">
			<div class="bg-bg p-5"><Stat label="Projects" value="32" icon={users} /></div>
			<div class="bg-bg p-5"><Stat label="Invoices" value="18" icon={coin} /></div>
			<div class="bg-bg p-5"><Stat label="Storage" value="64%" icon={drop} tone="accent" /></div>
		</div>
	</div>
</div>
