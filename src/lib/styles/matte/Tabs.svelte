<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import {
		focusRing,
		toneBorder,
		toneRing,
		toneSoft,
		toneText,
		type Tone
	} from '../../core/tones.js';
	import { iconMd } from './icon.js';

	export interface TabItem {
		value: string;
		label: string;
		/** Leading icon, 16px. */
		icon?: Snippet;
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
			underline: 'gap-6 border-b border-hairline',
			pill: 'gap-2',
			segmented: 'gap-0 border border-hairline bg-bg-alt p-1'
		}[variant]
	);

	function tabClass(active: boolean) {
		const base = `inline-flex items-center justify-center gap-2 font-sans text-[15px] whitespace-nowrap transition-all duration-150 ease-brand-out disabled:opacity-40 disabled:pointer-events-none ${focusRing} ${toneRing[tone]}`;
		if (variant === 'underline') {
			return `${base} -mb-px border-b-2 pb-3 ${
				active
					? `${toneBorder[tone]} ${toneText[tone]} font-medium`
					: 'border-transparent text-text-secondary hover:text-text'
			}`;
		}
		if (variant === 'pill') {
			return `${base} h-9 rounded-full px-4 ${
				active ? `${toneSoft[tone]} font-medium` : 'text-text-secondary hover:bg-bg-inset'
			}`;
		}
		return `${base} h-9 px-4 ${
			active ? `bg-bg font-medium ${toneText[tone]}` : 'text-text-secondary hover:text-text'
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
			{#if item.icon}<span class={iconMd}>{@render item.icon()}</span>{/if}
			{item.label}
			{#if item.badge !== undefined}
				<span class="font-mono text-[11px] text-text-muted">{item.badge}</span>
			{/if}
		</button>
	{/each}
</div>
