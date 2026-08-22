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

/* Tailwind v4 skips node_modules — point it at the style's folder so the
   class names used inside its components are generated. Only the style you
   actually import needs to be scanned. */
@source '../node_modules/@nqmcreative/ui/dist/styles/matte';`;

export const appCssPaper = `@import 'tailwindcss';
@import '@nqmcreative/ui/paper/theme.css';
@import '@nqmcreative/ui/paper/fonts.css';

/* Same idea, pointed at the other style's folder. */
@source '../node_modules/@nqmcreative/ui/dist/styles/paper';`;

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

/* -------------------------------------------------------------- styles -- */

export const styleSwap = `// one project, one style — swap the word and the whole app follows
import { Button, Card, Modal } from '@nqmcreative/ui/matte';
import { Button, Card, Modal } from '@nqmcreative/ui/paper';`;

export const coreImport = `// the behaviour every style shares, if you need it directly
import { focusTrap, anchored, toast, setLocale } from '@nqmcreative/ui/core';`;

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

/* -------------------------------------------------------------- locale -- */

export const localeGlobal = `import { setLocale, idID } from '@nqmcreative/ui/core';

setLocale(idID);`;

export const localeProvider = `<script lang="ts">
	import { LocaleProvider } from '@nqmcreative/ui/matte';
	import { idID } from '@nqmcreative/ui/core';
</script>

<LocaleProvider locale={idID}>
	<App />
</LocaleProvider>`;

export const localePartial = `import { setLocale } from '@nqmcreative/ui/core';

setLocale({
	noData: 'Belum ada data',
	previousPage: 'Sebelumnya',
	nextPage: 'Berikutnya'
});`;

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
	import { useLocale } from '../../core/locale.svelte.js';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		tone?: Tone;
		children: Snippet;
	}

	let { tone = 'brand', class: className = '', children, ...rest }: Props = $props();

	const t = useLocale();
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
<div class="border border-hairline border-brand">…</div>   <!-- unpredictable -->
<div class="border border-hairline border-l-brand">…</div> <!-- fine -->`;
