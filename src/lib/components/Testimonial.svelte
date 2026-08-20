<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import Avatar from './Avatar.svelte';
	import { toneBorderLeft, toneSurface, toneText, type Tone } from '../tones.js';

	export type TestimonialVariant = 'plain' | 'card' | 'accent';

	interface Props extends HTMLAttributes<HTMLElement> {
		quote: string;
		author: string;
		role?: string;
		/** Avatar image. Falls back to the author's initials. */
		avatar?: string;
		tone?: Tone;
		variant?: TestimonialVariant;
		/** Bigger type, for a single pull quote. */
		large?: boolean;
		children?: Snippet;
	}

	let {
		quote,
		author,
		role,
		avatar,
		tone = 'brand',
		variant = 'plain',
		large = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const variants = $derived({
		plain: '',
		card: 'border border-hairline bg-bg p-6',
		accent: `${toneSurface[tone]} border-l-2 ${toneBorderLeft[tone]} p-6`
	});
</script>

<figure class="flex flex-col gap-5 {variants[variant]} {className}" {...rest}>
	<blockquote
		class="font-sans leading-relaxed text-pretty text-text-secondary {large
			? 'text-xl leading-relaxed sm:text-2xl'
			: ''}"
	>
		<span class="{toneText[tone]} select-none" aria-hidden="true">“</span>{quote}<span
			class="{toneText[tone]} select-none"
			aria-hidden="true">”</span
		>
	</blockquote>

	{#if children}
		{@render children()}
	{/if}

	<figcaption class="flex items-center gap-3">
		<Avatar src={avatar} name={author} size="sm" {tone} />
		<div class="flex min-w-0 flex-col">
			<span class="font-sans text-sm font-medium text-text">{author}</span>
			{#if role}
				<span class="font-sans text-xs text-text-muted">{role}</span>
			{/if}
		</div>
	</figcaption>
</figure>
