<script lang="ts">
	import Link from '$lib/styles/matte/Link.svelte';
</script>

<div class="flex flex-wrap items-center gap-5">
	<Link href="#">Default</Link>
	<Link href="#" tone="accent" underline="always">Accent</Link>
	<Link href="https://nqmcreative.com" external>External</Link>
</div>
