/**
 * Code samples for the docs pages.
 *
 * They live in a `.ts` file rather than inline in the `.svelte` pages for one
 * practical reason: a literal `</script>` inside a Svelte component's script
 * block ends that block, and every way of escaping it upsets either eslint or
 * prettier. In a plain module it is just text.
 *
 * The samples below use `matte`. Every style implements the same catalogue, so
 * swapping the word in the import path is the whole difference.
 */

export const install = `bun add @nqmcreative/ui`;

export const cliInit = `bunx nqm-ui init --style matte`;

export const cliOther = `bunx nqm-ui list forms                   # every component in a category
bunx nqm-ui info date-picker             # its import line in every style
bunx nqm-ui add button badge --style matte
bunx nqm-ui add button --style paper --to src/routes/+page.svelte`;

export const scaffold = `bunx sv create myapp --template minimal --types ts --install bun
cd myapp
bun add -d tailwindcss @tailwindcss/vite
bun add @nqmcreative/ui`;

export const viteConfig = `import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// tailwindcss() must come before sveltekit()
	plugins: [tailwindcss(), sveltekit()]
});`;

export const appCss = `@import 'tailwindcss';
@import '@nqmcreative/ui/matte/theme.css';
@import '@nqmcreative/ui/matte/fonts.css';

/* Tailwind v4 skips node_modules — point it at the style's folder and the
   shared core, so the class names used inside the components are generated.
   Tone colours live in core, so both lines are needed. */
@source '../node_modules/@nqmcreative/ui/dist/styles/matte';
@source '../node_modules/@nqmcreative/ui/dist/core';`;

export const appCssPaper = `@import 'tailwindcss';
@import '@nqmcreative/ui/paper/theme.css';
@import '@nqmcreative/ui/paper/fonts.css';

/* Same idea, pointed at the other style's folder — plus the shared core. */
@source '../node_modules/@nqmcreative/ui/dist/styles/paper';
@source '../node_modules/@nqmcreative/ui/dist/core';`;

export const layout = `<script lang="ts">
	import '../app.css';
	import { Toaster } from '@nqmcreative/ui/matte';

	let { children } = $props();
</script>

{@render children()}

<Toaster position="bottom-right" />`;

export const appHtml = `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<script>
	const saved = localStorage.getItem('nqm-theme');
	if (saved === 'dark' || saved === 'light') document.documentElement.classList.add(saved);
</script>`;

/* ------------------------------------------------------- outside SvelteKit -- */

export const viteScaffold = `npm create vite@latest myapp -- --template svelte-ts
cd myapp
npm i @nqmcreative/ui
npm i -D tailwindcss @tailwindcss/vite
npx nqm-ui init --style matte`;

export const viteConfigPlain = `import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	// tailwindcss() must come before svelte()
	plugins: [tailwindcss(), svelte()]
});`;

export const viteEntry = `import './app.css';
import { mount } from 'svelte';
import App from './App.svelte';

export default mount(App, { target: document.getElementById('app') });`;

export const laravelInstall = `npm i @nqmcreative/ui
npm i -D svelte @sveltejs/vite-plugin-svelte tailwindcss @tailwindcss/vite
npx nqm-ui init --style matte`;

export const laravelViteConfig = `import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		laravel({ input: ['resources/css/app.css', 'resources/js/app.js'], refresh: true }),
		tailwindcss(),
		svelte()
	]
});`;

export const laravelCss = `@import 'tailwindcss';
@import '@nqmcreative/ui/matte/theme.css';
@import '@nqmcreative/ui/matte/fonts.css';

/* Two levels up from resources/css to the project root. */
@source '../../node_modules/@nqmcreative/ui/dist/styles/matte';
@source '../../node_modules/@nqmcreative/ui/dist/core';

/* Your own markup, which lives outside this folder. */
@source '../js';
@source '../views';`;

export const laravelBlade = `<head>
	@vite(['resources/css/app.css', 'resources/js/app.js'])

	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<script>
		const saved = localStorage.getItem('nqm-theme');
		if (saved === 'dark' || saved === 'light') document.documentElement.classList.add(saved);
	</script>
</head>`;

export const laravelMount = `import { mount } from 'svelte';
import App from './App.svelte';

// One island per view, or one root for the whole page — Blade renders the
// shell, Svelte takes the node it is given.
const target = document.getElementById('app');
if (target) mount(App, { target });`;

export const laravelIsland = `<script>
	import { Button, Field, Input } from '@nqmcreative/ui/matte';

	let email = $state('');
</script>

<Field label="Work email">
	<Input bind:value={email} placeholder="you@example.com" />
</Field>

<Button tone="accent">Get started</Button>`;

export const usage = `<script lang="ts">
	import { Button, Field, Input } from '@nqmcreative/ui/matte';

	let email = $state('');
</script>

<Field label="Work email" hint="We only email about releases.">
	<Input bind:value={email} placeholder="you@example.com" />
</Field>

<Button tone="accent">Get started</Button>`;

export const subpaths = `import Button from '@nqmcreative/ui/matte/button';
import Field from '@nqmcreative/ui/matte/field';
import Input from '@nqmcreative/ui/matte/input';`;

export const noRoot = `// there is no root export — a style has to be named
import { Button } from '@nqmcreative/ui';         // ✗ nothing here
import { Button } from '@nqmcreative/ui/matte';   // ✓
import { Button } from '@nqmcreative/ui/paper';   // ✓ same props, different look`;

export const update = `bun update @nqmcreative/ui`;

export const cliUpdate = `bunx nqm-ui update --style matte`;

export const cliUpdateAsk = `bunx nqm-ui update

  which style?

    1) matte    Flat and sharp-cornered…
    2) paper    The neutral one…
    3) sprout   Warm and fully rounded…

  1-3, or a name [1]:`;

/* -------------------------------------------------------------- styles -- */

export const styleSwap = `// one project, one style — swap the word and the whole app follows
import { Button, Card, Modal } from '@nqmcreative/ui/matte';
import { Button, Card, Modal } from '@nqmcreative/ui/paper';
import { Button, Card, Modal } from '@nqmcreative/ui/sprout';`;

export const coreImport = `// the behaviour every style shares, if you need it directly
import { focusTrap, anchored, toast } from '@nqmcreative/ui/core';`;

/* ------------------------------------------------------------- theming -- */

export const tonesUsage = `<Button tone="danger">Delete</Button>
<Badge tone="warning" dot>Quota</Badge>
<Alert tone="success" title="Deployed" />
<Progress tone="violet" value={40} />`;

export const themeTokens = `@theme {
	--color-brand: #1c6358;
	--color-brand-hover: #155047;
	--color-brand-light: #e8f3f1;
	--color-brand-border: #a8ccc5;
	/* …and the same four steps for the other seven tones */
}`;

export const themeOverride = `@import 'tailwindcss';
@import '@nqmcreative/ui/matte/theme.css';

/* your brand, on top of the style's defaults */
@theme {
	--color-brand: #0f766e;
	--color-brand-hover: #115e59;
	--color-brand-light: #ecfdf5;
	--color-brand-border: #99f6e4;
}`;

export const themeToggle = `<script lang="ts">
	import { ThemeToggle } from '@nqmcreative/ui/matte';
</script>

<ThemeToggle />
<ThemeToggle variant="segmented" />`;

export const toneMaps = `<script lang="ts">
	import { toneSoft, toneFill, type Tone } from '@nqmcreative/ui/core';

	let { tone = 'brand' }: { tone?: Tone } = $props();
</script>

<div class={toneSoft[tone]}>…</div>`;

/* ---------------------------------------------------- adding a component -- */

export const newCatalogue = `// scripts/catalogue.mjs — the list every style must implement
export const COMPONENTS = [
	// …
	['Callout', 'feedback', 'Short aside that sits inside running copy.'],
	// …
];`;

export const newComponent = `<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneSoft, type Tone } from '../../core/tones.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: Tone;
		children: Snippet;
	}

	let { tone = 'brand', class: className = '', children, ...rest }: Props = $props();
</script>

<div class="p-4 font-sans {toneSoft[tone]} {className}" {...rest}>
	{@render children()}
</div>`;

export const newBehaviour = `// src/lib/core/callout.ts — anything with no opinion about looks
export function calloutRole(tone: Tone): 'alert' | 'status' {
	return tone === 'danger' ? 'alert' : 'status';
}`;

export const newDemo = `<script lang="ts">
	import Callout from '$lib/styles/matte/Callout.svelte';
</script>

<Callout tone="accent">Something worth noticing.</Callout>`;

export const newBuild = `bun run index        # regenerates every style's barrel
bun run registry     # fails if a style is missing the component
bun run exports      # adds the subpath for each style
bun run lint         # fails if any of the three is stale
bun run build        # rebuilds dist/`;

export const toneRule = `<!-- Tailwind only sees literal class strings -->
<div class="bg-{tone}">…</div>          <!-- generates nothing -->
<div class={toneFill[tone]}>…</div>     <!-- correct -->`;

export const borderRule = `<!-- two colours for the same property: CSS order decides, not class order -->
border border-hairline border-brand     <!-- unpredictable -->
border border-hairline border-l-brand   <!-- fine -->`;

/* --------------------------------------------------------- form inputs -- */

export const inputWrapping = `// four of them are an Input with a job on top of it
SearchInput   Input + a clear button + a debounced callback
CurrencyInput Input + grouping on blur, bound to a number
TimeInput     Input + steppers, bounds and a minute step
ColorInput    Input + the native swatch, bound to a hex string

// four draw their own box, because the shape is not a field
InputAddon    a fixed label welded to an InputGroup
PinInput      one box per character
TagsInput     chips and a field sharing one border
FileInput     a button, a filename and a clear button`;

export const searchInputUse = `<script lang="ts">
	import { SearchInput } from '@nqmcreative/ui/matte';

	let value = $state('');
	let results = $state<string[]>([]);
</script>

<!-- \`value\` updates on every keystroke; \`onsearch\` waits for the pause -->
<SearchInput
	bind:value
	debounce={300}
	placeholder="Search invoices"
	onsearch={async (query) => (results = await search(query))}
/>`;

export const inputAddonUse = `<InputGroup>
	<InputAddon>https://</InputAddon>
	<Input bind:value={handle} placeholder="studio" />
	<InputAddon>.com</InputAddon>
</InputGroup>

<InputGroup>
	<Input bind:value={weight} inputmode="decimal" />
	<InputAddon>kg</InputAddon>
</InputGroup>`;

export const pinInputUse = `<script lang="ts">
	import { PinInput } from '@nqmcreative/ui/matte';

	let code = $state('');
</script>

<PinInput
	bind:value={code}
	length={6}
	groupAfter={3}
	name="otp"
	oncomplete={(value) => verify(value)}
/>`;

export const tagsInputUse = `<script lang="ts">
	import { TagsInput } from '@nqmcreative/ui/matte';

	let tags = $state(['svelte']);
</script>

<TagsInput
	bind:tags
	max={6}
	minLength={2}
	separators={[',', ' ']}
	name="topics"
	onreject={(reason) => toast.error(reason)}
/>`;

export const currencyInputUse = `<script lang="ts">
	import { CurrencyInput } from '@nqmcreative/ui/matte';

	// A number, not a string — the field owns the formatting, you own the value.
	let price = $state<number | null>(1250000);
</script>

<CurrencyInput bind:value={price} currency="Rp" group="." decimal="," precision={0} min={0} />`;

export const timeInputUse = `<script lang="ts">
	import { TimeInput } from '@nqmcreative/ui/matte';

	// Always \`HH:MM\` — the same string <input type="time"> would post.
	let start = $state('09:00');
</script>

<TimeInput bind:value={start} min="08:00" max="17:00" step={15} />`;

export const colorInputUse = `<script lang="ts">
	import { ColorInput } from '@nqmcreative/ui/matte';

	let brand = $state('#0f766e');
</script>

<ColorInput bind:value={brand} swatches={['#0f766e', '#b45309', '#1d4ed8']} />`;

export const fileInputUse = `<script lang="ts">
	import { FileInput } from '@nqmcreative/ui/matte';

	let files = $state<File[]>([]);
</script>

<FileInput
	bind:files
	name="avatar"
	accept="image/*,.pdf"
	maxSize={2 * 1024 * 1024}
	onreject={(rejected) => console.warn(rejected)}
/>`;

export const inputBindings = `let query = $state('');            // SearchInput  — string
let code = $state('');             // PinInput     — string, shorter means incomplete
let tags = $state<string[]>([]);   // TagsInput    — string[]
let price = $state<number | null>(null); // CurrencyInput — number, null when empty
let start = $state('09:00');       // TimeInput    — 'HH:MM', '' when empty
let brand = $state('#0f766e');     // ColorInput   — '#rrggbb'
let files = $state<File[]>([]);    // FileInput    — File[]`;

export const inputCore = `// the rules these fields run on, usable without any of them
import {
	addTag, splitTags,           // tokens: dedup, cap, paste splitting
	fillFrom, sanitisePin,       // codes: where a paste lands, what a box takes
	parseTime, clampTime,        // clock: 'HH:MM' in and out, bounds and steps
	formatGrouped, parseGrouped, // money: group on the way out, forgive on the way in
	normaliseHex,                // colour: '#abc' becomes '#aabbcc'
	sortFiles, formatSize        // files: accepted, rejected and why
} from '@nqmcreative/ui/core';`;
