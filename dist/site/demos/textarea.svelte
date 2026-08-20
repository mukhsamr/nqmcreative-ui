<script lang="ts">
	import Textarea from '../../components/Textarea.svelte';

	let value = $state('');
</script>

<Textarea bind:value placeholder="Tell us about the project…" class="max-w-sm" />
