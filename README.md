# @nqmcreative/ui

Svelte 5 (runes) + Tailwind CSS v4 component library. One package, **three
styles**, 70 components each — the same props, the same behaviour, a different
look. Eight tones, light and dark, no runtime dependencies.

| style    | import                   | character                                                                                                                      |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `matte`  | `@nqmcreative/ui/matte`  | Flat and sharp-cornered — no radius, no shadow, no gloss. Hairline rules and mono micro-labels do the work borders usually do. |
| `paper`  | `@nqmcreative/ui/paper`  | The neutral one. Start here if unsure: soft corners, light shadows, generous spacing, and nothing that fights the content.     |
| `sprout` | `@nqmcreative/ui/sprout` | Warm and fully rounded — leaf green on cream, pill buttons, and a round display face. For school, community and family sites.  |

The docs site lives in this repo — every component with a live demo, plus
theming and contributing guides. `bun run dev` to read it.

## Install

```bash
bun add @nqmcreative/ui
```

```bash
bunx nqm-ui init --style matte
```

`init` writes `src/app.css`, patches `src/app.html`, and adds the CSS import to
your root layout. It prints the one Vite change to paste — the Tailwind plugin,
before `sveltekit()`:

```ts
plugins: [tailwindcss(), sveltekit()];
```

Your project brings its own `svelte` ^5 and Tailwind CSS v4.

<details>
<summary>Wiring it by hand instead</summary>

```css
/* src/app.css */
@import 'tailwindcss';
@import '@nqmcreative/ui/matte/theme.css';
@import '@nqmcreative/ui/matte/fonts.css';

/* Tailwind v4 skips node_modules. Without this every component renders
   unstyled, with no error anywhere. Point it at the style you import. */
@source '../node_modules/@nqmcreative/ui/dist/styles/matte';
```

Import exactly one style's `theme.css` — they all define the same token names,
so two would fight over every colour. Each style ships its own `fonts.css`
alongside it; skip it and the type falls back to the system stack.

Import that CSS once in `src/routes/+layout.svelte`, and put the font
preconnect plus the no-flash theme script in `src/app.html`, above
`%sveltekit.head%`:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<script>
	const saved = localStorage.getItem('nqm-theme');
	if (saved === 'dark' || saved === 'light') document.documentElement.classList.add(saved);
</script>
```

</details>

## Without SvelteKit

Nothing in the library imports `$app/*`, `$env/*` or `@sveltejs/kit`. The only
peer dependency is `svelte` ^5, and every DOM call sits inside an action or an
effect — so anything that compiles Svelte components runs these: a plain Vite
app, or a Laravel app with Vite as its front end.

The components ship as `.svelte` source, published under a `svelte` export
condition. `@sveltejs/vite-plugin-svelte` is what resolves that condition and
compiles them, so it is required outside SvelteKit. `nqm-ui init` detects which
of the three project shapes it is in and wires the files that shape uses.

### Svelte + Vite

```bash
npm create vite@latest myapp -- --template svelte-ts
cd myapp
npm i @nqmcreative/ui
npm i -D tailwindcss @tailwindcss/vite
npx nqm-ui init --style matte
```

`init` writes `src/app.css`, patches the `<head>` in `index.html`, and adds the
CSS import to `src/main.ts`. The Vite config is the one thing it prints rather
than rewrites:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), svelte()]
});
```

### Laravel

Vite is already how Laravel builds its front end, so Svelte and this package are
the only additions.

```bash
npm i @nqmcreative/ui
npm i -D svelte @sveltejs/vite-plugin-svelte tailwindcss @tailwindcss/vite
npx nqm-ui init --style matte
```

```js
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		laravel({ input: ['resources/css/app.css', 'resources/js/app.js'], refresh: true }),
		tailwindcss(),
		svelte()
	]
});
```

The entry CSS is `resources/css/app.css`, two levels below the project root, so
`@source` walks two up. Laravel keeps its markup outside that folder, so point
Tailwind at your own files too — otherwise the classes you write in Blade and in
your Svelte islands go missing the same way the package's would:

```css
/* resources/css/app.css */
@import 'tailwindcss';
@import '@nqmcreative/ui/matte/theme.css';
@import '@nqmcreative/ui/matte/fonts.css';

@source '../../node_modules/@nqmcreative/ui/dist/styles/matte';
@source '../js';
@source '../views';
```

Nothing imports that CSS from JavaScript — Blade hands the path to Vite. The
preconnect and the no-flash theme script go in the same `<head>`, which is what
`init` patches:

```blade
{{-- resources/views/app.blade.php --}}
<head>
	@vite(['resources/css/app.css', 'resources/js/app.js'])
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<script>
		const saved = localStorage.getItem('nqm-theme');
		if (saved === 'dark' || saved === 'light') document.documentElement.classList.add(saved);
	</script>
</head>
```

Then mount Svelte wherever the page needs it — one root component, or an island
per view:

```js
// resources/js/app.js
import { mount } from 'svelte';
import App from './App.svelte';

const target = document.getElementById('app');
if (target) mount(App, { target });
```

```svelte
<!-- resources/js/App.svelte -->
<script>
	import { Button, Field, Input } from '@nqmcreative/ui/matte';

	let email = $state('');
</script>

<Field label="Work email">
	<Input bind:value={email} placeholder="you@example.com" />
</Field>
<Button tone="accent">Get started</Button>
```

Blade renders the shell, Svelte renders the component — the two never fight over
the same node, because the mount target is the only thing they share.

## Use

The import names the style:

```svelte
<script lang="ts">
	import { Button, Field, Input } from '@nqmcreative/ui/matte';

	let email = $state('');
</script>

<Field label="Work email">
	<Input bind:value={email} placeholder="you@example.com" />
</Field>

<Button tone="accent">Get started</Button>
```

Per-component subpaths work too — the style, then the file name in kebab-case:
`@nqmcreative/ui/matte/avatar-group`.

**There is no root export.** `import { Button } from '@nqmcreative/ui'` resolves
to nothing, on purpose: a style is a choice, and picking one by accident is the
mistake this layout exists to prevent. Switching later is a find-and-replace of
the word after `@nqmcreative/ui/`.

### Form inputs

`Input` takes any `type`, so an email or a URL field is a prop away, not a
component:

```svelte
<Input type="email" inputmode="email" autocomplete="email" />
```

The eight below exist because each adds behaviour a `type` cannot — a second
value, a keyboard rule, or a format that has to survive a round trip. All of
them take `size`, `tone`, `invalid` and `disabled`, and mean the same by them as
`Input` does.

| component       | binds            | what it adds                                                       |
| --------------- | ---------------- | ------------------------------------------------------------------ |
| `SearchInput`   | `string`         | Clear button, plus `onsearch` debounced separately from the value. |
| `InputAddon`    | —                | Fixed label welded to an `InputGroup`: `https://`, `.com`, `kg`.   |
| `PinInput`      | `string`         | One box per character, paste spreading, arrow keys, `oncomplete`.  |
| `TagsInput`     | `string[]`       | Free-text tokens on Enter, deduplicated, capped, split on paste.   |
| `CurrencyInput` | `number \| null` | Grouping applied on blur, so the bound value stays a number.       |
| `TimeInput`     | `string`         | Steppers and bounds over an `HH:MM` string.                        |
| `ColorInput`    | `string`         | Native swatch and hex field kept in step, normalised to `#rrggbb`. |
| `FileInput`     | `File[]`         | One-line picker with `Dropzone`'s type, size and count validation. |

Four of them wrap `Input` and fill its prefix or suffix slot — `SearchInput`,
`CurrencyInput`, `TimeInput`, `ColorInput` — so a change to the field's border
or focus ring reaches them for free. The other four draw their own box.

```svelte
<script lang="ts">
	import { CurrencyInput, PinInput, TagsInput, TimeInput } from '@nqmcreative/ui/matte';

	let price = $state<number | null>(1250000); // a number, not a formatted string
	let code = $state(''); // shorter than `length` means incomplete
	let tags = $state(['svelte']);
	let start = $state('09:00'); // what <input type="time"> would post
</script>

<CurrencyInput bind:value={price} currency="Rp" group="." decimal="," precision={0} />
<PinInput bind:value={code} length={6} groupAfter={3} oncomplete={verify} />
<TagsInput bind:tags max={6} onreject={(reason) => toast.error(reason)} />
<TimeInput bind:value={start} min="08:00" max="17:00" step={15} />
```

Two details worth knowing before you wire them up. `CurrencyInput` groups on
blur and not under the caret, because formatting as you type is what pushes the
caret around mid-word. And `TagsInput` reports every refusal — duplicate, too
short, list full — through `onreject`, because a field that silently ignores
Enter reads as broken.

The rules are all in `@nqmcreative/ui/core`, not in any style:

```ts
import {
	addTag,
	splitTags, // tokens
	fillFrom,
	sanitisePin, // codes
	parseTime,
	clampTime, // clock
	formatGrouped,
	parseGrouped, // money
	normaliseHex, // colour
	sortFiles,
	formatSize // files
} from '@nqmcreative/ui/core';
```

### Tones

Eight of them — `brand`, `accent`, `violet`, `info`, `success`, `warning`,
`danger`, `neutral` — and every tonal component takes the same prop:

```svelte
<Button tone="danger">Delete</Button>
<Badge tone="warning" dot>Quota</Badge>
<Alert tone="success" title="Deployed" />
```

Each ships four steps: `bg-accent`, `hover:bg-accent-hover`, `bg-accent-light`,
`border-accent-border`. The token _names_ are a contract every style fills in,
so only the values differ between them. Redeclare any of them in your own
`@theme` block to rebrand everything at once.

### Dark mode

Each style's `theme.css` ships both palettes; nothing in a component says
`dark:`. `<html class="dark">` or `class="light"` forces one, bare `<html>`
follows the OS. `ThemeToggle` handles all three.

### Built-in strings

Components render English text of their own — ARIA names, `No data`, `Choose
file` — written inline at the call site. Where a caller would plausibly want to
change one, it is a prop: `<Table empty="…">`, `<Dropzone label="…">`,
`<FileInput placeholder="…">`.

Dates are the one place the browser decides: `Calendar` and `DatePicker` take
month and weekday names from `Intl` with no locale argument, so they follow the
reader's own system. The order of the parts the field parses and prints is
explicit instead — `<DatePicker format="dmy">`, defaulting to `dmy`.

## Layout

```
src/lib/core/            behaviour, a11y, types — no markup, no classes
src/lib/styles/matte/    70 components
src/lib/styles/paper/    70 components
src/lib/styles/sprout/   70 components
scripts/catalogue.mjs    the list every style must implement
```

`core` holds what has no opinion about looks: focus traps, roving keyboard
navigation, viewport-aware anchoring, date maths, file validation, table
sorting, the toast queue. There is no `matte` version of a
focus trap, so no style writes one.

A style holds only markup and classes. It may differ from another completely —
different DOM, different animation — as long as the props and the behaviour
match. `bun run lint` fails if a style is missing a component from the
catalogue, and the parity suite mounts every style to assert they behave the
same.

## Components

| group        | components                                                                                                                                                                                                                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions      | `Button`, `Link`                                                                                                                                                                                                                                                                                                                          |
| Forms        | `Input`, `Textarea`, `Select`, `Combobox`, `MultiSelect`, `DatePicker`, `Calendar`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `SegmentedControl`, `Switch`, `Slider`, `InputGroup`, `InputAddon`, `SearchInput`, `PinInput`, `TagsInput`, `CurrencyInput`, `TimeInput`, `ColorInput`, `FileInput`, `Dropzone`, `Field`, `Label` |
| Data display | `Badge`, `Avatar`, `AvatarGroup`, `Card`, `Stat`, `Table`, `Kbd`                                                                                                                                                                                                                                                                          |
| Feedback     | `Alert`, `Toaster` + `toast`, `Progress`, `Spinner`, `Skeleton`, `EmptyState`                                                                                                                                                                                                                                                             |
| Layout & nav | `Divider`, `Tabs`, `Accordion`, `AccordionItem`, `Breadcrumb`, `Pagination`, `Steps`                                                                                                                                                                                                                                                      |
| App shell    | `Navbar`, `Sidebar`, `Footer`                                                                                                                                                                                                                                                                                                             |
| Overlay      | `Modal`, `ConfirmDialog`, `Drawer`, `Dropdown` + `MenuItem` + `MenuSeparator`, `ContextMenu`, `CommandPalette`, `Popover`, `Tooltip`                                                                                                                                                                                                      |
| Marketing    | `HeroSection`, `FeatureGrid`, `FeatureCard`, `PricingCard`, `Testimonial`, `LogoCloud`, `CTASection`, `StatsBand`                                                                                                                                                                                                                         |
| System       | `ThemeToggle`                                                                                                                                                                                                                                                                                                                             |

Overlays are built on the native top layer and three in-house actions
(`portal`, `focusTrap`, `anchored`) rather than a positioning dependency.

## CLI

```bash
bunx nqm-ui list forms                     # components in a category
bunx nqm-ui info date-picker               # its import line in every style
bunx nqm-ui add button badge --style matte # print the import lines
bunx nqm-ui add button --style paper --to src/routes/+page.svelte
```

`--style` has no default: the CLI lists the styles and asks, rather than
guessing.

## Developing

```bash
bun install
bun run dev       # the docs site at localhost:5173
bun run check     # type-check
bun run test      # vitest, including the cross-style parity suite
bun run build     # site + package
```

`src/lib` is the package, `src/site` and `src/routes` are the docs site.

**The style is the first segment of the URL**, not a toggle:
`/matte/components/button` and `/paper/components/button` are two prerendered
pages. Each renders entirely in its own style — navbar, sidebar, footer and
search box included — because every page takes its components from
`UI[data.style]` rather than importing one style directly. The static HTML for
the two differs: `h-11 px-7` in one, `h-10 px-4 rounded-md` in the other.

Two pieces make that work. `src/hooks.server.ts` stamps `data-style` onto
`<html>` before the first paint — on `<html>` rather than a wrapper, so
portalled overlays reach the tokens too and dark mode's class lands on the same
element. `src/routes/styles.css` re-declares each style's tokens under
`[data-style]`, generated by `bun run scoped`.

Both are docs-only. The package still ships one global `theme.css` per style,
because `--color-brand` cannot hold two values on one element.

**`dist/` is committed — rebuild and commit it with your change**, so what is
in the repo always matches the source beside it.

Adding a component: add a line to `scripts/catalogue.mjs`, put any behaviour in
`src/lib/core`, write the file in **every** style folder, add **one** demo in
`src/site/demos`, then `bun run build`. Barrels, exports map, registry, scoped
tokens and the per-style demo copies are all generated — a demo is authored once
against `matte` and copied into every other style with its import path
rewritten. `bun run lint` fails if any is stale or a style is missing
the component. Full conventions are on the site under `/docs/adding-components`.

## License

MIT — see [LICENSE](LICENSE).
