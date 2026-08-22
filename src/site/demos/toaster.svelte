<script lang="ts">
	import Button from '$lib/styles/matte/Button.svelte';
	import { toast } from '$lib/core/toast.svelte.js';
</script>

<div class="flex flex-wrap gap-3">
	<Button size="sm" onclick={() => toast.success('Saved')}>Success</Button>
	<Button size="sm" variant="soft" tone="danger" onclick={() => toast.error('Upload failed')}
		>Error</Button
	>
	<Button size="sm" variant="soft" tone="info" onclick={() => toast.info('Rendering started')}
		>Info</Button
	>
</div>
<p class="mt-3 font-sans text-sm text-text-muted">
	Toaster is already mounted in this site’s layout.
</p>
