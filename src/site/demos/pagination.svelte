<script lang="ts">
	import Pagination from '$lib/components/Pagination.svelte';

	let page = $state(3);
</script>

<Pagination bind:page total={12} />
