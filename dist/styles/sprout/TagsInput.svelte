<script lang="ts">
	import { addTag, splitTags, type TagRejection } from '../../core/tags.js';
	import { toneFocusWithinBorder, toneSoft, type Tone } from '../../core/tones.js';
	import { edge } from './lift.js';

	interface Props {
		/** Bindable list of tags, in the order they were added. */
		tags?: string[];
		placeholder?: string;
		/** Cap on how many may be held. `0` means no limit. */
		max?: number;
		/** Shortest a tag may be, after trimming. */
		minLength?: number;
		/** Keys that commit the tag under the caret, besides Enter. */
		separators?: string[];
		/** Refuse a tag that differs from an existing one only in case. */
		caseInsensitive?: boolean;
		/** Commit whatever is half-typed when the field loses focus. */
		commitOnBlur?: boolean;
		disabled?: boolean;
		invalid?: boolean;
		tone?: Tone;
		/** `name` for a plain form submit — one hidden field, comma-joined. */
		name?: string;
		onadd?: (tag: string) => void;
		onremove?: (tag: string) => void;
		onreject?: (reason: TagRejection, raw: string) => void;
		class?: string;
	}

	let {
		tags = $bindable([]),
		placeholder,
		max = 0,
		minLength = 1,
		separators = [','],
		caseInsensitive = true,
		commitOnBlur = true,
		disabled = false,
		invalid = false,
		tone = 'brand',
		name,
		onadd,
		onremove,
		onreject,
		class: className = ''
	}: Props = $props();

	let draft = $state('');
	let field: HTMLInputElement | null = $state(null);
	/** The last refusal, cleared as soon as the next keystroke lands. */
	let refused = $state<TagRejection | null>(null);

	const full = $derived(max > 0 && tags.length >= max);
	const rules = $derived({ max, minLength, caseInsensitive });

	function commit(raw: string) {
		const { tags: next, rejected } = addTag(tags, raw, rules);
		if (rejected) {
			// An empty commit is the Enter key on an empty field, not a mistake.
			if (rejected !== 'empty') {
				refused = rejected;
				onreject?.(rejected, raw);
			}
			return false;
		}
		tags = next;
		onadd?.(next[next.length - 1]);
		return true;
	}

	function remove(index: number) {
		const [gone] = tags.slice(index, index + 1);
		tags = tags.filter((_, at) => at !== index);
		if (gone !== undefined) onremove?.(gone);
	}

	function onKeydown(event: KeyboardEvent) {
		refused = null;

		if (event.key === 'Enter' || separators.includes(event.key)) {
			event.preventDefault();
			if (commit(draft)) draft = '';
			return;
		}

		// Empty field: Backspace peels the last chip off, the way chips behave
		// everywhere else in this library.
		if (event.key === 'Backspace' && draft === '' && tags.length) {
			event.preventDefault();
			remove(tags.length - 1);
		}
	}

	function onPaste(event: ClipboardEvent) {
		const text = event.clipboardData?.getData('text') ?? '';
		const parts = splitTags(text, separators);
		if (parts.length <= 1) return;

		event.preventDefault();
		for (const part of parts) commit(part);
		draft = '';
	}

	function onBlur() {
		if (commitOnBlur && draft.trim() && commit(draft)) draft = '';
	}

	const messages: Record<TagRejection, string> = $derived({
		empty: '',
		short: `${minLength}+`,
		duplicate: 'Already added',
		full: `$selected ${tags.length}/${max}`
	});
</script>

<div class="flex w-full flex-col gap-1.5 {className}">
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		onclick={() => field?.focus()}
		class="flex w-full flex-wrap items-center gap-1.5 rounded-xl border bg-bg py-1.5 pr-1.5 pl-2 {edge} transition-colors duration-150 ease-brand-out
			{invalid
			? 'border-danger focus-within:border-danger'
			: `border-hairline-strong ${toneFocusWithinBorder[tone]}`}
			{disabled ? 'pointer-events-none opacity-50' : ''}"
	>
		{#each tags as tag, index (tag)}
			<span
				class="inline-flex items-center gap-1 rounded-xl py-0.5 pr-0.5 pl-2 text-xs font-medium {toneSoft[
					tone
				]}"
			>
				{tag}
				<button
					type="button"
					onclick={() => remove(index)}
					aria-label="Remove {tag}"
					class="inline-flex size-4 items-center justify-center rounded transition-colors duration-150 hover:bg-bg/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-current"
				>
					<svg class="size-2.5" viewBox="0 0 10 10" fill="none" aria-hidden="true">
						<path
							d="m1.5 1.5 7 7M8.5 1.5l-7 7"
							stroke="currentColor"
							stroke-width="1.6"
							stroke-linecap="round"
						/>
					</svg>
				</button>
			</span>
		{/each}

		<input
			bind:this={field}
			bind:value={draft}
			{disabled}
			readonly={full}
			placeholder={tags.length === 0 ? (placeholder ?? 'Add a tag') : ''}
			aria-label={placeholder ?? 'Add a tag'}
			aria-invalid={invalid ? 'true' : undefined}
			onkeydown={onKeydown}
			onpaste={onPaste}
			onblur={onBlur}
			class="h-7 min-w-24 flex-1 bg-transparent font-sans text-sm text-text placeholder:text-text-muted focus:outline-none"
		/>

		{#if name}
			<input type="hidden" {name} value={tags.join(',')} />
		{/if}
	</div>

	{#if refused && messages[refused]}
		<span class="text-xs font-medium text-danger">{messages[refused]}</span>
	{:else if max}
		<span class="text-xs text-text-muted tabular-nums">{tags.length}/{max}</span>
	{/if}
</div>
