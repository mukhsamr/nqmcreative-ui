<script lang="ts">
	import Tabs from '$lib/styles/matte/Tabs.svelte';

	let underline = $state('overview');
	let pill = $state('day');
	let segmented = $state('grid');
	let wide = $state('brief');
</script>

{#snippet chart()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M2 13h12M4 11V7m4 4V3m4 8V6" stroke="currentColor" stroke-width="1.5" />
	</svg>
{/snippet}

{#snippet image()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<rect x="2" y="3" width="12" height="10" stroke="currentColor" stroke-width="1.4" />
		<path d="m2 10 3-3 4 4M10 8l4 3" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

{#snippet receipt()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M3 2h10v12l-2-1-1.5 1L8 13l-1.5 1L5 13l-2 1V2Z"
			stroke="currentColor"
			stroke-width="1.4"
		/>
		<path d="M6 6h4M6 9h4" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

<div class="flex w-full flex-col gap-6">
	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">icon + badge</p>
		<Tabs
			bind:value={underline}
			items={[
				{ value: 'overview', label: 'Overview', icon: chart },
				{ value: 'assets', label: 'Assets', icon: image, badge: 24 },
				{ value: 'billing', label: 'Billing', icon: receipt },
				{ value: 'archive', label: 'Archive', disabled: true }
			]}
		/>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">variant</p>
		<div class="flex flex-wrap items-center gap-6">
			<Tabs
				variant="pill"
				tone="accent"
				bind:value={pill}
				items={[
					{ value: 'day', label: 'Day', icon: chart },
					{ value: 'week', label: 'Week' }
				]}
			/>
			<Tabs
				variant="segmented"
				tone="violet"
				bind:value={segmented}
				items={[
					{ value: 'grid', label: 'Grid', icon: image },
					{ value: 'list', label: 'List', icon: receipt }
				]}
			/>
		</div>
	</div>

	<div class="flex flex-col gap-2">
		<p class="font-mono text-[10px] tracking-wide text-text-muted uppercase">full width</p>
		<Tabs
			fullWidth
			bind:value={wide}
			items={[
				{ value: 'brief', label: 'Brief', icon: receipt },
				{ value: 'files', label: 'Files', icon: image, badge: 8 },
				{ value: 'report', label: 'Report', icon: chart }
			]}
		/>
	</div>
</div>
