<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Stat from './Stat.svelte';
	import type { StatTrend } from './Stat.svelte';
	import type { Tone } from '../../core/tones.js';

	export interface BandStat {
		label: string;
		value: string | number;
		delta?: string;
		trend?: StatTrend;
		hint?: string;
		tone?: Tone;
	}

	interface Props extends HTMLAttributes<HTMLElement> {
		stats: BandStat[];
		title?: string;
		/** Figures in one bordered card rather than free-standing. */
		bordered?: boolean;
	}

	let { stats, title, bordered = true, class: className = '', ...rest }: Props = $props();

	const cols = $derived(
		stats.length === 2
			? 'sm:grid-cols-2'
			: stats.length === 4
				? 'sm:grid-cols-2 lg:grid-cols-4'
				: 'sm:grid-cols-3'
	);
</script>

<section class="w-full px-6 py-16 {className}" {...rest}>
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-8">
		{#if title}
			<h2
				class="max-w-xl font-heading text-3xl font-semibold tracking-tight text-balance text-text"
			>
				{title}
			</h2>
		{/if}

		<div
			class="grid {cols} {bordered
				? 'gap-px overflow-hidden rounded-lg border border-hairline bg-hairline shadow-xs'
				: 'gap-8'}"
		>
			{#each stats as stat (stat.label)}
				<div class={bordered ? 'bg-bg p-6' : ''}>
					<Stat
						label={stat.label}
						value={stat.value}
						delta={stat.delta}
						trend={stat.trend}
						hint={stat.hint}
						tone={stat.tone}
					/>
				</div>
			{/each}
		</div>
	</div>
</section>
