<script lang="ts">
	import './layout.css';
	import Toaster from '$lib/components/Toaster.svelte';

	const { children } = $props();
</script>

{@render children()}

<Toaster position="bottom-right" />
