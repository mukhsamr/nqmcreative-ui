<script lang="ts">
	import Calendar from '../../components/Calendar.svelte';

	let value = $state('2026-08-15');
</script>

<div class="border border-hairline">
	<Calendar bind:value tone="accent" />
</div>
