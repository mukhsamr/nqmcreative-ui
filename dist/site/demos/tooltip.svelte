<script lang="ts">
	import Button from '../../components/Button.svelte';
	import Tooltip from '../../components/Tooltip.svelte';
</script>

<div class="flex flex-wrap items-center gap-4">
	<Tooltip content="On top"><Button variant="outline" tone="neutral">Top</Button></Tooltip>
	<Tooltip content="On the right" placement="right"
		><Button variant="outline" tone="neutral">Right</Button></Tooltip
	>
</div>
