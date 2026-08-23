# @nqmcreative/ui

Svelte 5 (runes) + Tailwind CSS v4 component library. One package, **three
styles**, 65 components each — the same props, the same behaviour, a different
look. Eight tones, light and dark, no runtime dependencies.

| style    | import                   | character                                                                                                                      |
| -------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `matte`  | `@nqmcreative/ui/matte`  | Flat and sharp-cornered — no radius, no shadow, no gloss. Hairline rules and mono micro-labels do the work borders usually do. |
| `paper`  | `@nqmcreative/ui/paper`  | The neutral one. Start here if unsure: soft corners, light shadows, generous spacing, and nothing that fights the content.     |
| `sprout` | `@nqmcreative/ui/sprout` | Warm and fully rounded — leaf green on cream, pill buttons, and a round display face. For school, community and family sites.  |

The docs site lives in this repo — every component with a live demo, plus
theming, locale and contributing guides. `bun run dev` to read it.

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

### Locale

Every built-in string — ARIA names, `No data`, the calendar's month names —
comes from one object, shared by every style:

```js
import { setLocale, idID } from '@nqmcreative/ui/core';

setLocale(idID);
```

`enUS` and `idID` ship with the package; pass a partial to change a few keys.
Under SSR use `<LocaleProvider>` instead, so the locale is scoped to a request.

## Layout

```
src/lib/core/            behaviour, a11y, types — no markup, no classes
src/lib/styles/matte/    65 components
src/lib/styles/paper/    65 components
src/lib/styles/sprout/   65 components
scripts/catalogue.mjs    the list every style must implement
```

`core` holds what has no opinion about looks: focus traps, roving keyboard
navigation, viewport-aware anchoring, date maths, file validation, table
sorting, the toast queue, the locale strings. There is no `matte` version of a
focus trap, so no style writes one.

A style holds only markup and classes. It may differ from another completely —
different DOM, different animation — as long as the props and the behaviour
match. `bun run lint` fails if a style is missing a component from the
catalogue, and the parity suite mounts every style to assert they behave the
same.

## Components

| group        | components                                                                                                                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions      | `Button`, `Link`                                                                                                                                                                                                                                           |
| Forms        | `Input`, `Textarea`, `Select`, `Combobox`, `MultiSelect`, `DatePicker`, `Calendar`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `SegmentedControl`, `Switch`, `Slider`, `NumberInput`, `PasswordInput`, `InputGroup`, `Dropzone`, `Field`, `Label` |
| Data display | `Badge`, `Avatar`, `AvatarGroup`, `Card`, `Stat`, `Table`, `Kbd`                                                                                                                                                                                           |
| Feedback     | `Alert`, `Toaster` + `toast`, `Progress`, `Spinner`, `Skeleton`, `EmptyState`                                                                                                                                                                              |
| Layout & nav | `Divider`, `Tabs`, `Accordion`, `AccordionItem`, `Breadcrumb`, `Pagination`, `Steps`                                                                                                                                                                       |
| App shell    | `Navbar`, `Sidebar`, `Footer`                                                                                                                                                                                                                              |
| Overlay      | `Modal`, `ConfirmDialog`, `Drawer`, `Dropdown` + `MenuItem` + `MenuSeparator`, `ContextMenu`, `CommandPalette`, `Popover`, `Tooltip`                                                                                                                       |
| Marketing    | `HeroSection`, `FeatureGrid`, `FeatureCard`, `PricingCard`, `Testimonial`, `LogoCloud`, `CTASection`, `StatsBand`                                                                                                                                          |
| System       | `ThemeToggle`, `LocaleProvider`                                                                                                                                                                                                                            |

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
