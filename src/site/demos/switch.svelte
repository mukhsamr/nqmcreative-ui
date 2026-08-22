<script lang="ts">
	import Switch from '$lib/styles/matte/Switch.svelte';

	let checked = $state(true);
</script>

<Switch bind:checked label="Email notifications" description="Weekly digest only." tone="info" />
