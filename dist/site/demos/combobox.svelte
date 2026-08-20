<script lang="ts">
	import Combobox from '../../components/Combobox.svelte';

	let value = $state('');
</script>

<div class="w-full max-w-xs">
	<Combobox
		bind:value
		options={[
			{ value: 'jkt', label: 'Jakarta' },
			{ value: 'bdg', label: 'Bandung' },
			{ value: 'sby', label: 'Surabaya' },
			{ value: 'dps', label: 'Denpasar' }
		]}
	/>
</div>
