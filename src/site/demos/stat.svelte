<script lang="ts">
	import Stat from '$lib/components/Stat.svelte';
</script>

<div class="flex flex-wrap gap-10">
	<Stat label="Revenue" value="1,2M" delta="12.4%" trend="up" />
	<Stat label="Churn" value="2.1%" delta="0.4%" trend="down" tone="danger" />
</div>
