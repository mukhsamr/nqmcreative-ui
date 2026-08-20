/**
 * Code samples for the docs pages.
 *
 * They live in a `.ts` file rather than inline in the `.svelte` pages for one
 * practical reason: a literal `</script>` inside a Svelte component's script
 * block ends that block, and every way of escaping it upsets either eslint or
 * prettier. In a plain module it is just text.
 */

export const install = `bun add @nqmcreative/ui`;

export const installGit = `bun add github:mukhsamr/nqmcreative-ui`;

export const installTarball = `# in the library repo
bun run build && bun pm pack

# in your project
bun add ./nqmcreative-ui-0.1.0.tgz`;

export const installSymlink = `npm install file:../path/to/nqmcreative-ui`;

export const cliInit = `bunx nqm-ui init`;

export const cliOther = `bunx nqm-ui list forms          # every component in a category
bunx nqm-ui info date-picker    # subpath, what it renders, what it imports
bunx nqm-ui add button badge    # print the import lines
bunx nqm-ui add button --to src/routes/+page.svelte`;

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
@import '@nqmcreative/ui/theme.css';
@import '@nqmcreative/ui/fonts.css';

/* Tailwind v4 skips node_modules — point it at the package's dist so the
   class names used inside the components are generated. */
@source '../node_modules/@nqmcreative/ui/dist';`;

export const layout = `<script lang="ts">
	import '../app.css';
	import Toaster from '@nqmcreative/ui/toaster';

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
	import Button from '@nqmcreative/ui/button';
	import Field from '@nqmcreative/ui/field';
	import Input from '@nqmcreative/ui/input';

	let email = $state('');
</script>

<Field label="Work email" hint="We only email about releases.">
	<Input bind:value={email} placeholder="you@example.com" />
</Field>

<Button tone="accent">Get started</Button>`;

export const barrel = `import { Button, Field, Input } from '@nqmcreative/ui';`;

export const update = `bun update @nqmcreative/ui`;

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
@import '@nqmcreative/ui/theme.css';

/* your brand, on top of the defaults */
@theme {
	--color-brand: #0f766e;
	--color-brand-hover: #115e59;
	--color-brand-light: #ecfdf5;
	--color-brand-border: #99f6e4;
}`;

export const themeToggle = `<script lang="ts">
	import ThemeToggle from '@nqmcreative/ui/theme-toggle';
</script>

<ThemeToggle />
<ThemeToggle variant="segmented" />`;

export const toneMaps = `<script lang="ts">
	import { toneSoft, toneFill, type Tone } from '@nqmcreative/ui/tones';

	let { tone = 'brand' }: { tone?: Tone } = $props();
</script>

<div class={toneSoft[tone]}>…</div>`;

/* -------------------------------------------------------------- locale -- */

export const localeGlobal = `import { setLocale, idID } from '@nqmcreative/ui/locale';

setLocale(idID);`;

export const localeProvider = `<script lang="ts">
	import LocaleProvider from '@nqmcreative/ui/locale-provider';
	import { idID } from '@nqmcreative/ui/locale';
</script>

<LocaleProvider locale={idID}>
	<App />
</LocaleProvider>`;

export const localePartial = `import { setLocale } from '@nqmcreative/ui/locale';

setLocale({
	noData: 'Belum ada data',
	previousPage: 'Sebelumnya',
	nextPage: 'Berikutnya'
});`;

/* ---------------------------------------------------- adding a component -- */

export const newComponent = `<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { toneSoft, type Tone } from '../tones.js';
	import { useLocale } from '../locale.svelte.js';

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

export const newExport = `/* --- feedback --- */
export { default as Callout } from './components/Callout.svelte';
export type { CalloutTone } from './components/Callout.svelte';`;

export const newDemo = `<script lang="ts">
	import Callout from '$lib/components/Callout.svelte';
</script>

<Callout tone="accent">Something worth noticing.</Callout>`;

export const newBuild = `bun run registry     # picks up the new component
bun run exports      # adds @nqmcreative/ui/callout
bun run lint         # fails if either is stale
bun run build        # rebuilds dist/, which is committed`;

export const toneRule = `<!-- Tailwind only sees literal class strings -->
<div class="bg-{tone}">…</div>          <!-- generates nothing -->
<div class={toneFill[tone]}>…</div>     <!-- correct -->`;

export const borderRule = `<!-- two colours for the same property: CSS order decides, not class order -->
<div class="border border-hairline border-brand">…</div>   <!-- unpredictable -->
<div class="border border-hairline border-l-brand">…</div> <!-- fine -->`;
