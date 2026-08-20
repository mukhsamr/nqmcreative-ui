<script lang="ts">
	import Slider from '../../components/Slider.svelte';

	let value = $state(40);
</script>

<div class="w-full max-w-sm">
	<Slider bind:value label="Budget" showValue tone="accent" />
</div>
