<script lang="ts">
	import DatePicker from '../../components/DatePicker.svelte';

	let value = $state('2026-08-15');
</script>

<div class="w-full max-w-xs">
	<DatePicker bind:value />
</div>
