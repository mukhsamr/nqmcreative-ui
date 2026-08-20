<script lang="ts">
	import Radio from '../../components/Radio.svelte';

	let group = $state('monthly');
</script>

<div class="flex flex-col gap-3">
	<Radio bind:group value="monthly" label="Monthly billing" />
	<Radio bind:group value="yearly" label="Yearly billing" description="Save 20%." tone="success" />
</div>
