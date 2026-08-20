<script lang="ts">
	import Field from '../../components/Field.svelte';
	import Input from '../../components/Input.svelte';
</script>

<div class="grid w-full gap-5 sm:grid-cols-2">
	<Field label="Full name" hint="Shown on the invoice." required for="d-name">
		<Input id="d-name" placeholder="Nadia Q." />
	</Field>
	<Field label="Work email" error="That address is already registered." for="d-mail">
		<Input id="d-mail" invalid placeholder="you@studio.com" />
	</Field>
</div>
