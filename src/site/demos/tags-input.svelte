<script lang="ts">
	import TagsInput from '$lib/styles/matte/TagsInput.svelte';

	let tags = $state(['svelte', 'tailwind']);
</script>

<div class="w-full max-w-sm">
	<TagsInput bind:tags max={6} placeholder="Add a topic, then Enter" tone="accent" />
</div>
