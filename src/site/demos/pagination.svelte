<script lang="ts">
	import Pagination from '$lib/styles/matte/Pagination.svelte';

	let page = $state(3);
</script>

<Pagination bind:page total={12} />
