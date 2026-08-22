<script lang="ts">
	import Testimonial from '$lib/styles/matte/Testimonial.svelte';
</script>

<div class="flex w-full flex-col gap-8">
	<Testimonial
		large
		quote="They rebuilt our design system in six weeks. The old one took a year and we never shipped it."
		author="Nadia Q"
		role="Head of Product, Sundara"
	/>
	<div class="grid gap-6 sm:grid-cols-2">
		<Testimonial
			variant="card"
			quote="The handover was the least painful part of the project."
			author="Rafi A"
			role="Engineering Lead"
		/>
		<Testimonial
			variant="accent"
			tone="accent"
			quote="Every question we had was already answered in the docs."
			author="Sita M"
			role="Founder, Kelana"
		/>
	</div>
</div>
