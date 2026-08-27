<script lang="ts">
	import MultiSelect from '$lib/styles/matte/MultiSelect.svelte';

	let value = $state(['brand', 'motion']);
</script>

{#snippet palette()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path
			d="M8 2a6 6 0 1 0 0 12c1 0 1.5-.6 1.5-1.3 0-1.2 1-1.2 2-1.2A2.5 2.5 0 0 0 14 9 6 6 0 0 0 8 2Z"
			stroke="currentColor"
			stroke-width="1.4"
		/>
		<circle cx="5.5" cy="7" r="0.9" fill="currentColor" />
		<circle cx="8.5" cy="5" r="0.9" fill="currentColor" />
	</svg>
{/snippet}

{#snippet pen()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="M11 2.5 13.5 5 6 12.5 3 13l.5-3L11 2.5Z" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

{#snippet code()}
	<svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
		<path d="m6 4-4 4 4 4m4-8 4 4-4 4" stroke="currentColor" stroke-width="1.4" />
	</svg>
{/snippet}

<div class="w-full max-w-sm">
	<MultiSelect
		bind:value
		max={4}
		tone="violet"
		options={[
			{ value: 'brand', label: 'Brand identity', group: 'Design', icon: palette },
			{ value: 'ui', label: 'Product UI', group: 'Design', icon: palette },
			{ value: 'motion', label: 'Motion', group: 'Design', icon: palette },
			{ value: 'copy', label: 'Copywriting', group: 'Content', icon: pen },
			{ value: 'dev', label: 'Front-end build', group: 'Build', icon: code }
		]}
	/>
</div>
