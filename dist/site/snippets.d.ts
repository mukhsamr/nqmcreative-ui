/**
 * Code samples for the docs pages.
 *
 * They live in a `.ts` file rather than inline in the `.svelte` pages for one
 * practical reason: a literal `</script>` inside a Svelte component's script
 * block ends that block, and every way of escaping it upsets either eslint or
 * prettier. In a plain module it is just text.
 */
export declare const installGit = "bun add git+ssh://git@github.com/mukhsamr/nqmcreative-ui.git";
export declare const installTarball = "# in the library repo\nbun run build && bun pm pack\n\n# in your project\nbun add ./nqmcreative-ui-0.0.1.tgz";
export declare const installSymlink = "npm install file:../path/to/nqmcreative-ui";
export declare const cliInit = "bunx nqm-ui init";
export declare const cliOther = "bunx nqm-ui list forms          # every component in a category\nbunx nqm-ui info date-picker    # subpath, what it renders, what it imports\nbunx nqm-ui add button badge    # print the import lines\nbunx nqm-ui add button --to src/routes/+page.svelte";
export declare const scaffold = "bunx sv create myapp --template minimal --types ts --install bun\ncd myapp\nbun add -d tailwindcss @tailwindcss/vite\nbun add git+ssh://git@github.com/mukhsamr/nqmcreative-ui.git";
export declare const viteConfig = "import tailwindcss from '@tailwindcss/vite';\nimport { sveltekit } from '@sveltejs/kit/vite';\nimport { defineConfig } from 'vite';\n\nexport default defineConfig({\n\t// tailwindcss() must come before sveltekit()\n\tplugins: [tailwindcss(), sveltekit()]\n});";
export declare const appCss = "@import 'tailwindcss';\n@import '@nqmcreative/ui/theme.css';\n@import '@nqmcreative/ui/fonts.css';\n\n/* Tailwind v4 skips node_modules \u2014 point it at the package's dist so the\n   class names used inside the components are generated. */\n@source '../node_modules/@nqmcreative/ui/dist';";
export declare const layout = "<script lang=\"ts\">\n\timport '../app.css';\n\timport Toaster from '@nqmcreative/ui/toaster';\n\n\tlet { children } = $props();\n</script>\n\n{@render children()}\n\n<Toaster position=\"bottom-right\" />";
export declare const appHtml = "<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin />\n<script>\n\tconst saved = localStorage.getItem('nqm-theme');\n\tif (saved === 'dark' || saved === 'light') document.documentElement.classList.add(saved);\n</script>";
export declare const usage = "<script lang=\"ts\">\n\timport Button from '@nqmcreative/ui/button';\n\timport Field from '@nqmcreative/ui/field';\n\timport Input from '@nqmcreative/ui/input';\n\n\tlet email = $state('');\n</script>\n\n<Field label=\"Work email\" hint=\"We only email about releases.\">\n\t<Input bind:value={email} placeholder=\"you@example.com\" />\n</Field>\n\n<Button tone=\"accent\">Get started</Button>";
export declare const barrel = "import { Button, Field, Input } from '@nqmcreative/ui';";
export declare const update = "bun update @nqmcreative/ui";
export declare const tonesUsage = "<Button tone=\"danger\">Delete</Button>\n<Badge tone=\"warning\" dot>Quota</Badge>\n<Alert tone=\"success\" title=\"Deployed\" />\n<Progress tone=\"violet\" value={40} />";
export declare const themeTokens = "@theme {\n\t--color-brand: #1c6358;\n\t--color-brand-hover: #155047;\n\t--color-brand-light: #e8f3f1;\n\t--color-brand-border: #a8ccc5;\n\t/* \u2026and the same four steps for the other seven tones */\n}";
export declare const themeOverride = "@import 'tailwindcss';\n@import '@nqmcreative/ui/theme.css';\n\n/* your brand, on top of the defaults */\n@theme {\n\t--color-brand: #0f766e;\n\t--color-brand-hover: #115e59;\n\t--color-brand-light: #ecfdf5;\n\t--color-brand-border: #99f6e4;\n}";
export declare const themeToggle = "<script lang=\"ts\">\n\timport ThemeToggle from '@nqmcreative/ui/theme-toggle';\n</script>\n\n<ThemeToggle />\n<ThemeToggle variant=\"segmented\" />";
export declare const toneMaps = "<script lang=\"ts\">\n\timport { toneSoft, toneFill, type Tone } from '@nqmcreative/ui/tones';\n\n\tlet { tone = 'brand' }: { tone?: Tone } = $props();\n</script>\n\n<div class={toneSoft[tone]}>\u2026</div>";
export declare const localeGlobal = "import { setLocale, idID } from '@nqmcreative/ui/locale';\n\nsetLocale(idID);";
export declare const localeProvider = "<script lang=\"ts\">\n\timport LocaleProvider from '@nqmcreative/ui/locale-provider';\n\timport { idID } from '@nqmcreative/ui/locale';\n</script>\n\n<LocaleProvider locale={idID}>\n\t<App />\n</LocaleProvider>";
export declare const localePartial = "import { setLocale } from '@nqmcreative/ui/locale';\n\nsetLocale({\n\tnoData: 'Belum ada data',\n\tpreviousPage: 'Sebelumnya',\n\tnextPage: 'Berikutnya'\n});";
export declare const newComponent = "<script lang=\"ts\">\n\timport type { Snippet } from 'svelte';\n\timport type { HTMLAttributes } from 'svelte/elements';\n\timport { toneSoft, type Tone } from '../tones.js';\n\timport { useLocale } from '../locale.svelte.js';\n\n\tinterface Props extends HTMLAttributes<HTMLDivElement> {\n\t\ttone?: Tone;\n\t\tchildren: Snippet;\n\t}\n\n\tlet { tone = 'brand', class: className = '', children, ...rest }: Props = $props();\n\n\tconst t = useLocale();\n</script>\n\n<div class=\"p-4 font-sans {toneSoft[tone]} {className}\" {...rest}>\n\t{@render children()}\n</div>";
export declare const newExport = "/* --- feedback --- */\nexport { default as Callout } from './components/Callout.svelte';\nexport type { CalloutTone } from './components/Callout.svelte';";
export declare const newDemo = "<script lang=\"ts\">\n\timport Callout from '$lib/components/Callout.svelte';\n</script>\n\n<Callout tone=\"accent\">Something worth noticing.</Callout>";
export declare const newBuild = "bun run registry     # picks up the new component\nbun run exports      # adds @nqmcreative/ui/callout\nbun run lint         # fails if either is stale\nbun run build        # rebuilds dist/, which is committed";
export declare const toneRule = "<!-- Tailwind only sees literal class strings -->\n<div class=\"bg-{tone}\">\u2026</div>          <!-- generates nothing -->\n<div class={toneFill[tone]}>\u2026</div>     <!-- correct -->";
export declare const borderRule = "<!-- two colours for the same property: CSS order decides, not class order -->\n<div class=\"border border-hairline border-brand\">\u2026</div>   <!-- unpredictable -->\n<div class=\"border border-hairline border-l-brand\">\u2026</div> <!-- fine -->";
