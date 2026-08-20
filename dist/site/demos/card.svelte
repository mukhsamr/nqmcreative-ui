<script lang="ts">
	import Card from '../../components/Card.svelte';
</script>

<div class="grid w-full gap-4 sm:grid-cols-3">
	<Card eyebrow="Outline" title="Default" interactive>
		<p class="text-sm text-text-secondary">Hairline border.</p>
	</Card>
	<Card variant="filled" eyebrow="Filled" title="Alt">
		<p class="text-sm text-text-secondary">Alt surface.</p>
	</Card>
	<Card variant="tinted" tone="accent" eyebrow="Tinted" title="Accent">
		<p class="text-sm text-text-secondary">Tone light step.</p>
	</Card>
</div>
