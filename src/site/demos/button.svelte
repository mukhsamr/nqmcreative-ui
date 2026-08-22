<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
</script>

<div class="flex flex-wrap items-center gap-3">
	<Button>Solid</Button>
	<Button variant="soft" tone="accent">Soft</Button>
	<Button variant="outline" tone="violet">Outline</Button>
	<Button variant="ghost" tone="neutral">Ghost</Button>
	<Button variant="link">Link →</Button>
	<Button loading>Saving</Button>
	<Button tone="danger" disabled>Disabled</Button>
</div>
