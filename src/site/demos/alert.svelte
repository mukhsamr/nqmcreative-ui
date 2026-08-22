<script lang="ts">
	import Alert from '$lib/styles/matte/Alert.svelte';
</script>

<div class="flex w-full flex-col gap-3">
	<Alert tone="info" title="Heads up">Rendering takes about two minutes.</Alert>
	<Alert tone="success" variant="accent" title="Deployed">Live on production.</Alert>
	<Alert tone="warning" variant="outline" title="Quota at 85%" dismissible>Upgrade soon.</Alert>
</div>
