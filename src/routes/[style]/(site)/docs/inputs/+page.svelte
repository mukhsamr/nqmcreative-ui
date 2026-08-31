<script lang="ts">
	import { UI } from '$site/ui.js';
	import CodeBlock from '$site/CodeBlock.svelte';
	import * as code from '$site/snippets.js';

	let { data } = $props();

	const ui = $derived(UI[data.style]);
	const base = $derived(`/${data.style}`);

	/** The eight specialised fields, in the order the page walks through them. */
	const fields = [
		{
			slug: 'search-input',
			name: 'SearchInput',
			binds: 'string',
			adds: 'A clear button and a debounced callback beside the live value.'
		},
		{
			slug: 'input-addon',
			name: 'InputAddon',
			binds: '—',
			adds: 'A fixed label welded to an InputGroup: a prefix, a unit, a domain.'
		},
		{
			slug: 'pin-input',
			name: 'PinInput',
			binds: 'string',
			adds: 'One box per character, with paste spreading and arrow-key movement.'
		},
		{
			slug: 'tags-input',
			name: 'TagsInput',
			binds: 'string[]',
			adds: 'Free-text tokens committed on Enter, deduplicated and capped.'
		},
		{
			slug: 'currency-input',
			name: 'CurrencyInput',
			binds: 'number | null',
			adds: 'Grouping applied on blur, so the bound value stays a number.'
		},
		{
			slug: 'time-input',
			name: 'TimeInput',
			binds: 'string',
			adds: 'Steppers, inclusive bounds and a minute step, over an HH:MM string.'
		},
		{
			slug: 'color-input',
			name: 'ColorInput',
			binds: 'string',
			adds: 'The native swatch and a hex field kept in step with each other.'
		},
		{
			slug: 'file-input',
			name: 'FileInput',
			binds: 'File[]',
			adds: 'A one-line picker with the same type, size and count rules as Dropzone.'
		}
	];
</script>

<svelte:head>
	<title>Form inputs — nqm.ui</title>
	<meta
		name="description"
		content="The specialised fields: what each one adds over Input, and what it binds."
	/>
</svelte:head>

<header class="flex flex-col gap-3">
	<h1 class="font-heading text-3xl font-medium tracking-tight">Form inputs</h1>
	<p class="font-sans text-lg leading-relaxed text-text-secondary">
		<code class="font-mono text-brand">Input</code> takes any
		<code class="font-mono text-brand">type</code>, so an email or a URL field is a prop away and
		not a component. The eight below exist because they each add behaviour a
		<code class="font-mono text-brand">type</code> cannot: a second value, a keyboard rule, a format that
		has to survive a round trip.
	</p>
</header>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">Two shapes</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Four of them wrap <code class="font-mono text-sm text-brand">Input</code> and put something in its
		prefix or suffix slot, so a change to the field's border, height or focus ring reaches them for free.
		The other four draw their own box, because what they are is not one line of text.
	</p>
	<CodeBlock code={code.inputWrapping} label="what each one is" />
	<ui.Alert tone="info" title="Sizes and tones carry across">
		Every one of them takes <code class="font-mono">size</code>,
		<code class="font-mono">tone</code>, <code class="font-mono">invalid</code> and
		<code class="font-mono">disabled</code>, and means the same thing by them as
		<code class="font-mono">Input</code> does. Wrap any of them in
		<code class="font-mono">Field</code> for the label, hint and error.
	</ui.Alert>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">What each one binds</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The bound value is the part worth reading twice: three of these bind something other than a
		string, and one of them binds nothing at all.
	</p>
	<div class="overflow-x-auto">
		<table class="w-full border-collapse font-sans text-sm">
			<thead>
				<tr class="border-b border-hairline text-left">
					<th class="py-2 pr-4 font-medium text-text">Component</th>
					<th class="py-2 pr-4 font-medium text-text">Binds</th>
					<th class="py-2 font-medium text-text">What it adds</th>
				</tr>
			</thead>
			<tbody>
				{#each fields as field (field.slug)}
					<tr class="border-b border-hairline align-top last:border-b-0">
						<td class="py-2 pr-4 whitespace-nowrap">
							<a
								href="{base}/components/{field.slug}"
								class="font-mono text-brand transition-colors duration-150 hover:underline"
							>
								{field.name}
							</a>
						</td>
						<td class="py-2 pr-4 font-mono text-xs whitespace-nowrap text-text-secondary">
							{field.binds}
						</td>
						<td class="py-2 text-text-secondary">{field.adds}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<CodeBlock code={code.inputBindings} label="the eight bindings" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">SearchInput</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Two values, on purpose: <code class="font-mono text-sm text-brand">bind:value</code> follows
		every keystroke so the field stays responsive, and
		<code class="font-mono text-sm text-brand">onsearch</code> fires once the typing stops. The timer
		restarts on each keystroke rather than queueing, so a fast typist sends one request, not eight.
	</p>
	<CodeBlock code={code.searchInputUse} label="+page.svelte" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		The clear button appears only while there is something to clear, and calls
		<code class="font-mono text-brand">onclear</code> after emptying the field.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">InputAddon</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The piece <code class="font-mono text-sm text-brand">InputGroup</code> was missing. It is not
		the same as <code class="font-mono text-sm text-brand">Input</code>'s
		<code class="font-mono text-sm text-brand">prefix</code> snippet: that renders
		<em>inside</em> the field's border, while an addon is its own box welded to the outside.
	</p>
	<CodeBlock code={code.inputAddonUse} label="either side, or both" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Give it the same <code class="font-mono text-brand">size</code> as the field beside it — the
		heights have to agree, and nothing enforces that for you.
		<code class="font-mono text-brand">variant="plain"</code> drops the tint when the addon should read
		as part of the field rather than a label on it.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">PinInput</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The value is one compact string, so
		<code class="font-mono text-sm text-brand">code.length</code> is how many boxes are filled and
		<code class="font-mono text-sm text-brand">code.length === length</code> is "complete". A six-digit
		paste into the first box fills all six; a paste into the third fills the three that are left.
	</p>
	<CodeBlock code={code.pinInputUse} label="+page.svelte" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Backspace on a filled box clears it, and on an empty one takes the box before — the way a caret
		behaves in a single field. Arrow keys move without editing.
		<code class="font-mono text-brand">mode="alphanumeric"</code> takes letters,
		<code class="font-mono text-brand">mask</code> renders dots, and
		<code class="font-mono text-brand">name</code> adds one hidden field so a plain form posts the whole
		code rather than six fragments.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">TagsInput</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		For values that do not come from a list.
		<code class="font-mono text-sm text-brand">MultiSelect</code> is the one to reach for when the options
		are known up front; this is the one for topics, labels and anything a person invents as they go.
	</p>
	<CodeBlock code={code.tagsInputUse} label="+page.svelte" />
	<ui.Alert tone="warning" title="A refusal is not a silent no-op">
		A duplicate, a tag under <code class="font-mono">minLength</code>, and a full list are all
		refusals, and each one reaches
		<code class="font-mono">onreject</code> with its reason. A field that simply ignores the Enter key
		reads as broken, so say why.
	</ui.Alert>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Enter commits, as does any key in <code class="font-mono text-brand">separators</code>.
		Backspace in an empty field peels the last chip off. A paste is split on the same separators, so
		one paste can add several at once.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">CurrencyInput</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The bound value is a <code class="font-mono text-sm text-brand">number</code>, and
		<code class="font-mono text-sm text-brand">null</code> when the field is empty — which is not the
		same as zero, and the difference matters the moment the amount is optional.
	</p>
	<CodeBlock code={code.currencyInputUse} label="+page.svelte" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Grouping is applied when the field loses focus and dropped while it has it. Formatting under the
		caret is what pushes the caret around mid-word, and the version of this field that does it is
		the version people fight with.
	</p>
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		<code class="font-mono text-brand">group</code> and
		<code class="font-mono text-brand">decimal</code> are yours to set rather than
		<code class="font-mono text-brand">Intl</code>'s to choose, because the field has to parse back
		what it prints — and some regions group with a space nobody can type.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">TimeInput</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		Always <code class="font-mono text-sm text-brand">HH:MM</code>, which is what
		<code class="font-mono text-sm text-brand">&lt;input type="time"&gt;</code> posts — so a form
		behind this field needs no special case. Typing is forgiving:
		<code class="font-mono text-sm text-brand">9</code>,
		<code class="font-mono text-sm text-brand">9:5</code> and
		<code class="font-mono text-sm text-brand">0905</code> all settle to
		<code class="font-mono text-sm text-brand">09:05</code> when the field is left.
	</p>
	<CodeBlock code={code.timeInputUse} label="+page.svelte" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		Arrow keys and the steppers move by <code class="font-mono text-brand">step</code> minutes and stop
		at the bounds rather than wrapping — rolling 23:55 round to 00:00 turns a late meeting into an early
		one.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">ColorInput</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The native swatch and a hex field, kept in step. Shorthand is expanded and alpha is dropped when
		the field settles, so the bound value is always the
		<code class="font-mono text-sm text-brand">#rrggbb</code> the swatch can actually show. A half-typed
		value is left alone rather than corrected under the caret.
	</p>
	<CodeBlock code={code.colorInputUse} label="+page.svelte" />
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">FileInput</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		The same validation as <code class="font-mono text-sm text-brand">Dropzone</code> —
		<code class="font-mono text-sm text-brand">accept</code>,
		<code class="font-mono text-sm text-brand">maxSize</code>,
		<code class="font-mono text-sm text-brand">maxFiles</code>, judged in that order — in one line
		instead of a drop target. Reach for the drop target when files arrive by dragging, and for this
		when the field sits in a form with six others.
	</p>
	<CodeBlock code={code.fileInputUse} label="+page.svelte" />
	<p class="font-sans text-sm leading-relaxed text-text-secondary">
		<code class="font-mono text-brand">multiple</code> is off by default, which is the difference
		from <code class="font-mono text-brand">Dropzone</code>: one file reads as its name and weight,
		several as a count with the list underneath.
	</p>
</section>

<section class="flex flex-col gap-4">
	<h2 class="font-heading text-xl font-medium tracking-tight">The rules underneath</h2>
	<p class="font-sans leading-relaxed text-text-secondary">
		None of the behaviour above lives in a style. It is all in
		<code class="font-mono text-sm text-brand">@nqmcreative/ui/core</code>, which is why all three
		styles agree about what a duplicate tag is, and why you can use the same rules in a field this
		package does not ship.
	</p>
	<CodeBlock code={code.inputCore} label="@nqmcreative/ui/core" />
</section>
