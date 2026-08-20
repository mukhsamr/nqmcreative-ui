<script lang="ts">
	import Pagination from '../../components/Pagination.svelte';

	let page = $state(3);
</script>

<Pagination bind:page total={12} />
