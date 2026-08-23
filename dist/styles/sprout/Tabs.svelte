<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { edge } from './lift.js';
	import {
		focusRing,
		toneBorder,
		toneRing,
		toneSoft,
		toneText,
		type Tone
	} from '../../core/tones.js';

	export interface TabItem {
		value: string;
		label: string;
		disabled?: boolean;
		/** Small count/label rendered after the tab title. */
		badge?: string | number;
	}

	export type TabsVariant = 'underline' | 'pill' | 'segmented';

	interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'onchange'> {
		items: TabItem[];
		/** Bindable — the `value` of the active tab. */
		value?: string;
		variant?: TabsVariant;
		tone?: Tone;
		/** Spread tabs evenly across the full width. */
		fullWidth?: boolean;
		onchange?: (value: string) => void;
	}

	let {
		items,
		value = $bindable(items[0]?.value ?? ''),
		variant = 'underline',
		tone = 'brand',
		fullWidth = false,
		onchange,
		class: className = '',
		...rest
	}: Props = $props();

	function select(item: TabItem) {
		if (item.disabled) return;
		value = item.value;
		onchange?.(item.value);
	}

	const listClass = $derived(
		{
			underline: 'gap-5 border-b border-hairline',
			pill: 'gap-1.5',
			segmented: 'gap-1 rounded-2xl border border-hairline bg-bg-inset p-1'
		}[variant]
	);

	function tabClass(active: boolean) {
		const base = `inline-flex items-center justify-center gap-2 font-sans text-sm font-medium whitespace-nowrap transition-all duration-150 ease-brand-out disabled:opacity-40 disabled:pointer-events-none ${focusRing} ${toneRing[tone]}`;
		if (variant === 'underline') {
			return `${base} -mb-px rounded-t-xl border-b-2 px-1 pb-2.5 ${
				active
					? `${toneBorder[tone]} ${toneText[tone]}`
					: 'border-transparent text-text-muted hover:text-text'
			}`;
		}
		if (variant === 'pill') {
			return `${base} h-9 rounded-full px-3.5 ${
				active ? toneSoft[tone] : 'text-text-muted hover:bg-bg-inset hover:text-text'
			}`;
		}
		return `${base} h-8 rounded-xl px-3.5 ${
			active ? `bg-bg text-text ${edge}` : 'text-text-muted hover:text-text'
		}`;
	}
</script>

<div
	role="tablist"
	class="flex items-center overflow-x-auto {listClass} {fullWidth ? '*:flex-1' : ''} {className}"
	{...rest}
>
	{#each items as item (item.value)}
		<button
			type="button"
			role="tab"
			aria-selected={value === item.value}
			disabled={item.disabled}
			onclick={() => select(item)}
			class={tabClass(value === item.value)}
		>
			{item.label}
			{#if item.badge !== undefined}
				<span
					class="rounded-full bg-bg-inset px-1.5 text-[11px] font-normal text-text-muted tabular-nums"
				>
					{item.badge}
				</span>
			{/if}
		</button>
	{/each}
</div>
