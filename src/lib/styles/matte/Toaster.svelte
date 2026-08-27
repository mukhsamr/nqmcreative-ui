<script lang="ts">
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { portal } from '../../core/actions/dismissable.js';
	import { toast } from '../../core/toast.svelte.js';
	import { toneBorderSoft, toneSurface, toneText } from '../../core/tones.js';
	import { iconMd } from './icon.js';
	import Spinner from './Spinner.svelte';
	import { useLocale } from '../../core/locale.svelte.js';

	export type ToasterPosition =
		'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

	interface Props {
		position?: ToasterPosition;
		class?: string;
	}

	let { position = 'bottom-right', class: className = '' }: Props = $props();

	const t = useLocale();

	const positions: Record<ToasterPosition, string> = {
		'top-left': 'top-4 left-4 items-start',
		'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
		'top-right': 'top-4 right-4 items-end',
		'bottom-left': 'bottom-4 left-4 items-start',
		'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
		'bottom-right': 'bottom-4 right-4 items-end'
	};

	const fromTop = $derived(position.startsWith('top'));
	const fromLeft = $derived(position.endsWith('left'));
	const fromCenter = $derived(position.endsWith('center'));

	const enter = $derived(
		fromCenter ? { y: fromTop ? -16 : 16, x: 0 } : { x: fromLeft ? -16 : 16, y: 0 }
	);
</script>

<div
	use:portal
	aria-live="polite"
	aria-label={t.current.notifications}
	class="pointer-events-none fixed z-[100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 {positions[
		position
	]} {fromTop ? '' : 'flex-col-reverse'} {className}"
>
	{#each toast.items as item (item.id)}
		<div
			animate:flip={{ duration: 200 }}
			in:fly={{ ...enter, duration: 220 }}
			out:fly={{ ...enter, duration: 160 }}
			role={item.tone === 'danger' ? 'alert' : 'status'}
			class="pointer-events-auto flex w-full items-start gap-3 border p-4 font-sans
				{toneSurface[item.tone]} {toneBorderSoft[item.tone]}"
		>
			<span class="mt-0.5 shrink-0 {toneText[item.tone]}">
				{#if item.loading}
					<Spinner size="sm" label="" />
				{:else if item.icon}
					<span class={iconMd}>{@render item.icon()}</span>
				{:else if item.tone === 'success'}
					<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="m3 8.5 3.2 3.2L13 5" stroke="currentColor" stroke-width="1.6" />
					</svg>
				{:else if item.tone === 'danger'}
					<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<path d="m3.5 3.5 9 9M12.5 3.5l-9 9" stroke="currentColor" stroke-width="1.6" />
					</svg>
				{:else}
					<svg class="size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
						<circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" />
						<path d="M8 4.5v4.5" stroke="currentColor" stroke-width="1.5" />
						<circle cx="8" cy="11.5" r="0.9" fill="currentColor" />
					</svg>
				{/if}
			</span>

			<div class="flex min-w-0 flex-1 flex-col gap-1">
				<p class="text-[15px] leading-snug font-medium {toneText[item.tone]}">{item.title}</p>
				{#if item.description}
					<p class="text-sm leading-relaxed text-text-secondary">{item.description}</p>
				{/if}
				{#if item.action}
					<button
						type="button"
						onclick={() => {
							item.action?.onclick();
							toast.dismiss(item.id);
						}}
						class="mt-1 self-start font-sans text-sm font-medium underline underline-offset-4 {toneText[
							item.tone
						]}"
					>
						{item.action.label}
					</button>
				{/if}
			</div>

			<button
				type="button"
				onclick={() => toast.dismiss(item.id)}
				aria-label={t.current.dismiss}
				class="-m-1 shrink-0 p-1 text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
			>
				<svg class="size-3.5" viewBox="0 0 14 14" fill="none" aria-hidden="true">
					<path d="m2 2 10 10M12 2 2 12" stroke="currentColor" stroke-width="1.5" />
				</svg>
			</button>
		</div>
	{/each}
</div>
