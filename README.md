# @nqmcreative/ui

Svelte 5 (runes) + Tailwind CSS v4 component library, styled to match
[nqmcreative.com](https://nqmcreative.com) — flat surfaces, no shadows, no
border-radius except pills, brand teal `#1c6358`, Sora/Work Sans/JetBrains Mono.

Everything in `src/lib` is the package. Everything in `src/routes` is a local
dev preview (`bun run dev`) — it is not published.

## What's included

### Design tokens (`theme.css`)

A Tailwind v4 `@theme` block. Surfaces (`bg`, `bg-alt`, `bg-inset`, `hairline`,
`hairline-strong`), text (`text`, `text-secondary`, `text-muted`,
`text-inverse`), type (`font-sans` Work Sans, `font-heading` Sora, `font-mono`
JetBrains Mono) and motion (`ease-brand`, `ease-brand-out`).

**Colour is tonal.** `brand` (teal `#1c6358`) is the primary, and seven more
hues follow the exact same four-step shape:

| tone      | base      | used for                          |
| --------- | --------- | --------------------------------- |
| `brand`   | `#1c6358` | primary actions, active states    |
| `accent`  | `#c2410c` | secondary emphasis, highlights    |
| `violet`  | `#6d28d9` | tertiary / categorical            |
| `info`    | `#1d4ed8` | informational messaging           |
| `success` | `#15803d` | confirmations, positive deltas    |
| `warning` | `#b45309` | soft warnings, quotas             |
| `danger`  | `#b91c1c` | destructive actions, errors       |
| `neutral` | `#475569` | quiet chrome, disabled-ish states |

Each one ships four steps — `--color-<tone>`, `-hover`, `-light` (tinted
surface) and `-border` — so `bg-accent`, `hover:bg-accent-hover`,
`bg-accent-light` and `border-accent-border` all exist as utilities.

Every tonal component takes the same `tone` prop:

```svelte
<Button tone="danger">Delete</Button>
<Badge tone="warning" dot>Quota</Badge>
<Alert tone="success" title="Deployed" />
<Progress tone="violet" value={40} />
```

`tones.ts` exports the shared class maps (`toneSolid`, `toneSoft`, `toneText`,
`toneFill`, `toneRing`, …) plus the `Tone` type and the `TONES` array, so your
own components can join the same system.

### Components

| group        | components                                                                                                                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions      | `Button`, `Link`                                                                                                                                                                                                                                           |
| Forms        | `Input`, `Textarea`, `Select`, `Combobox`, `MultiSelect`, `DatePicker`, `Calendar`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `SegmentedControl`, `Switch`, `Slider`, `NumberInput`, `PasswordInput`, `InputGroup`, `Dropzone`, `Field`, `Label` |
| Data display | `Badge`, `Avatar`, `AvatarGroup`, `Card`, `Stat`, `Table`, `Kbd`                                                                                                                                                                                           |
| Feedback     | `Alert`, `Toaster` + `toast`, `Progress`, `Spinner`, `Skeleton`, `EmptyState`                                                                                                                                                                              |
| Layout & nav | `Divider`, `Tabs`, `Accordion`, `AccordionItem`, `Breadcrumb`, `Pagination`, `Steps`                                                                                                                                                                       |
| App shell    | `Navbar`, `Sidebar`, `Footer`                                                                                                                                                                                                                              |
| Overlay      | `Modal`, `ConfirmDialog`, `Drawer`, `Dropdown` + `MenuItem` + `MenuSeparator`, `ContextMenu`, `CommandPalette`, `Popover`, `Tooltip`                                                                                                                       |
| System       | `ThemeToggle`, `LocaleProvider`                                                                                                                                                                                                                            |

Notable props:

- `Button` — `variant` (`solid` / `soft` / `outline` / `ghost` / `link`),
  `size` (`sm` / `md` / `lg` / `xl`), `tone`, `loading`, `block`, `href`.
- `Input` — `prefix` / `suffix` snippets, `invalid`, `size`, `tone`.
- `Field` — wraps any control with `label`, `hint`, `error`, `required`.
- `Combobox` — searchable select with grouping, keyboard nav and `clearable`.
- `Dropzone` — drag & drop with `accept`, `maxSize`, `maxFiles`; reports what it
  turned away through `onreject`.
- `Table` — `columns` + `rows`, per-column `sortable`, `bind:sort`,
  `selectable` with `bind:selected` and `rowKey`, `stickyHeader`, and a `cell`
  snippet for custom rendering.
- `Modal` / `Drawer` — native `<dialog>`, `bind:open`, `footer` snippet;
  `Drawer` adds `side` and `size`.
- `Tabs` — `underline` / `pill` / `segmented`, `bind:value`.
- `Pagination` — `bind:page`, `total`, collapses with `…`.
- `CommandPalette` — `items` with `group` / `shortcut` / hidden `keywords`;
  opens on ⌘K / Ctrl+K by default (`hotkey={null}` to wire your own trigger).
- `ConfirmDialog` — awaits `onconfirm`, staying open and busy until it settles.
- `ContextMenu` — right-click anywhere in `children`; the menu is placed at the
  pointer and flipped near the edges.
- `CheckboxGroup` — `bind:value` as `string[]`, optional `max`.
- `MultiSelect` — chips in the field, grouping, `max`, Backspace peels the last
  chip off.
- `DatePicker` / `Calendar` — value is a `YYYY-MM-DD` string, `min` / `max`, and
  an `isDisabled(date)` predicate for weekends or holidays. Month names, weekday
  order and the input's part order all follow the locale.
- `Navbar` — desktop links collapse into a `Drawer` below `md`; nested `items`
  become a `Dropdown`.
- `Sidebar` — `sections` of nested `items`, `bind:value` for the active one,
  `bind:collapsed` for the rail.
- `Steps` — horizontal or vertical, `bind:current`, per-step `error`, and
  `clickable` to jump back to a finished step.

### Overlays without a dependency

`Dropdown`, `Popover` and `Combobox` render into `document.body` and are placed
by a small in-house action, so no floating-ui and no CSS anchor positioning:

- `anchored` — fixed positioning against a trigger, flips to the opposite side
  when it doesn't fit, then clamps inside the viewport; follows scroll (capture
  phase, so nested scrollers count) and resize.
- `clickOutside`, `focusTrap`, `portal`, `navigateList` — the behaviours every
  overlay needs, exported so your own components can reuse them.

The trade-off: no sub-pixel middleware pipeline, no automatic arrow placement,
and `Tooltip` stays CSS-only (it can clip inside `overflow: hidden`, and doesn't
flip). Everything else escapes clipping and survives scrolling. Reach for
`Popover` when a tooltip would be clipped.

### Toasts

`toast` is a module-level store, so any file can fire one without prop
drilling. Mount `<Toaster />` once, near the root of your app:

```svelte
<script>
	import { Toaster, toast } from '@nqmcreative/ui';
</script>

<Toaster position="bottom-right" />

<button onclick={() => toast.success('Project archived')}>Archive</button>
```

`toast.success` / `error` / `warning` / `info` / `loading`, plus `show`,
`update(id, …)` for a loading toast that becomes a result, `dismiss(id)` and
`clear()`.

### Dark mode

`theme.css` ships both palettes. Nothing in a component says `dark:` — every
utility is built on the tokens, so the whole system flips at once. The root
element decides:

| root                   | result                    |
| ---------------------- | ------------------------- |
| `<html class="dark">`  | dark, explicitly chosen   |
| `<html class="light">` | light, explicitly chosen  |
| `<html>`               | follows the OS preference |

`ThemeToggle` writes that class and remembers the choice under the
`nqm-theme` key:

```svelte
<ThemeToggle variant="segmented" />
<!-- or a single cycling button -->
<ThemeToggle />
```

Because the class is applied after hydration, a visitor who chose dark sees one
light frame first. Set the class before first paint to avoid it — in SvelteKit
this goes in `src/app.html`, above `%sveltekit.head%`:

```html
<script>
	const saved = localStorage.getItem('nqm-theme');
	if (saved === 'dark' || saved === 'light') document.documentElement.classList.add(saved);
</script>
```

The key has to match what `ThemeToggle` writes. `applyTheme(theme)` and
`storedTheme()` are exported for the same purpose if you would rather not
hardcode it.

`@custom-variant dark` is registered too, so `dark:` utilities work in your own
markup when you need a one-off override.

### Dates

`DatePicker` and `Calendar` speak `YYYY-MM-DD` strings, never `Date` objects —
a `Date` is a UTC instant, so `new Date('2026-03-01')` is the last day of
February for anyone west of Greenwich. The helpers behind them (`toISO`,
`fromISO`, `addMonths`, `monthGrid`, `parseFormatted`, …) are exported and
stay in the viewer's local calendar throughout.

### Locale

Every string a component renders on its own — ARIA names, `No data`, the words
in a rejected-file message — comes from one locale object. Nothing is hardcoded
inside a component.

```js
// one global locale, the common case
import { setLocale, idID } from '@nqmcreative/ui';
setLocale(idID);
```

```svelte
<!-- or scoped to a subtree — the right choice under SSR, where module
     state is shared between requests -->
<script>
	import { LocaleProvider, idID } from '@nqmcreative/ui';
</script>

<LocaleProvider locale={idID}>
	<App />
</LocaleProvider>
```

`enUS` and `idID` ship with the package; pass a partial to change just a few
keys. Precedence is per-instance prop → provider → global → `enUS`, so
`<Table empty="…" />` still wins over everything.

### `fonts.css`

Optional. Ships the three typefaces as plain `@font-face` rules pointing at
Google's CDN (Latin + Latin Extended, `font-display: swap`). Skip it if you
self-host fonts or already load them.

It deliberately does _not_ use `@import url('https://fonts.googleapis.com/…')`:
`@import` is only valid before every other rule, so bundlers drop it when the
file is pulled in after `tailwindcss` — the page then silently falls back to
`system-ui` with no error anywhere. `@font-face` works from any position.

Add this to your document head so the connection opens before the CSS parses:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

## Developing

```bash
bun install
bun run dev       # preview components at localhost:5173
bun run check     # type-check
bun run test      # vitest
bun run build     # svelte-package + publint -> dist/
```

**`dist/` is committed on purpose — rebuild and commit it with your change.**
Consuming projects read from `dist/`, not `src/`, and nothing builds it for
them: bun blocks a dependency's `prepare` script, and even once trusted it
runs without `node_modules/.bin` on PATH, so `svelte-kit` is not found.
Shipping the build output is what keeps `bun add git+ssh://…` working.

```bash
bun run build && git add dist
```

`src/routes` is the docs site:

| route                | what it is                                                  |
| -------------------- | ----------------------------------------------------------- |
| `/`                  | landing — palette, install, the full catalogue              |
| `/components`        | filterable index of all 57                                  |
| `/components/[slug]` | one page per component: live demo, source, what it pulls in |
| `/playground`        | the old kitchen-sink preview                                |
| `/playground/shell`  | navbar + sidebar + footer at a realistic size               |

Component pages are generated from `registry.json`, and each demo lives in
`src/lib/site/demos/<slug>.svelte` — the file is both rendered live and shown
as its own source. Add a component and it appears in the nav, the index, the
command palette and the sidebar with no further wiring; only the demo file is
written by hand.

The site is fully prerendered and built with `@sveltejs/adapter-cloudflare`,
so `.svelte-kit/cloudflare` can be uploaded as-is.

Tests cover the logic that is easy to get quietly wrong: the date helpers
(timezone drift, impossible dates, per-locale parsing), the `anchored` action
(flip and viewport clamping), `Table` (numeric vs. string sorting, selection
after a sort), and `Dropzone` (type, size and count rules).

## Installing it in another project

> The docs site covers this with live examples — `/docs/installation`,
> `/docs/theming`, `/docs/locale` and `/docs/adding-components`. Run
> `bun run dev` to read them locally. What follows is the same ground in
> short form.

Not on npm — install it from the repo. **bun is the package manager here**;
`bun.lock` is the committed lockfile.

### Option A — straight from GitHub (recommended)

```bash
bun add git+ssh://git@github.com/mukhsamr/nqmcreative-ui.git
```

`dist/` is committed, so this works as-is: nothing has to be built at install
time. Use `git+ssh://` rather than `git+https://` — bun resolves https GitHub
URLs through the API, which 404s on a private repo. The installing machine
needs an SSH key on an account with access.

Pull later changes with `bun update @nqmcreative/ui`, which tracks the tip of
`main`. To pin instead, tag a release and append it:

```bash
bun add git+ssh://git@github.com/mukhsamr/nqmcreative-ui.git#v0.0.1
```

### Option B — a packed tarball

Portable, and needs no repo access — hand it to someone or drop it in a CI
cache.

```bash
bun run build && bun pm pack     # in this repo
```

```bash
bun add ./nqmcreative-ui-0.0.1.tgz    # in your other project
```

### Option C — a live symlink, for developing both at once

`bun link` and `bun add file:<dir>` both fail on Windows with
`EBUSY: failed opening cache/package/version dir` — bun copies the whole source
directory, `node_modules` (160 MB) included, into its cache. npm's symlink is
the way here:

```bash
npm install file:../path/to/nqmcreative-ui
```

`bun run build` in this repo then shows up without reinstalling.

### The CLI

`init` does the wiring below for you — the `@source` line, the font preconnect
and the no-flash theme script are the three steps most easily forgotten:

```bash
bunx nqm-ui init
```

It detects SvelteKit or plain Vite, writes `src/app.css`, patches (or creates)
`src/app.html`, and adds the CSS import to `src/routes/+layout.svelte`. Every
write is idempotent — run it twice and the second run changes nothing. Add
`--dry-run` to see what it would touch.

It will not rewrite your Vite config; it prints the two lines to paste instead.

```bash
bunx nqm-ui list forms          # every component in a category
bunx nqm-ui info date-picker    # subpath, what it renders, what it imports
bunx nqm-ui add button badge    # print the import lines
bunx nqm-ui add button --to src/routes/+page.svelte   # …or insert them
```

`add` is a convenience, not an installer: the whole library is already there
after `bun add`, and a component pulls in whatever it renders internally — `add
date-picker` mentions that `Calendar` comes with it, but there is nothing extra
to install.

### Then, in every case

**1. Peer requirements** — the consuming project brings its own `svelte` ^5 and
Tailwind CSS v4. The package itself has no runtime dependencies.

**2. SvelteKit from scratch**, start to finish:

```bash
bunx sv create myapp --template minimal --types ts --install bun
```

```bash
cd myapp && bun add -d tailwindcss @tailwindcss/vite
```

```bash
bun add git+ssh://git@github.com/mukhsamr/nqmcreative-ui.git
```

Register the Tailwind plugin **before** `sveltekit()` in `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
```

Import the CSS once, in `src/routes/+layout.svelte`, and mount `Toaster` there
if you use toasts:

```svelte
<script lang="ts">
	import '../app.css';
	import { Toaster, setLocale, idID } from '@nqmcreative/ui';

	setLocale(idID);

	let { children } = $props();
</script>

{@render children()}

<Toaster position="bottom-right" />
```

Add the font preconnect to `src/app.html`, above `%sveltekit.head%` — it belongs
in plain HTML, because Svelte parses a bare `crossorigin` attribute as boolean
`true` and `svelte-check` rejects it:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
```

**3. Wire up the CSS.** In your app's Tailwind entry CSS:

```css
@import 'tailwindcss';
@import '@nqmcreative/ui/theme.css';
@import '@nqmcreative/ui/fonts.css'; /* optional */

/* Tailwind v4 ignores node_modules by default — point it at the package's
   dist so the class names used inside the components are generated */
@source '../node_modules/@nqmcreative/ui/dist';
```

Adjust the `@source` path to wherever `node_modules` resolves relative to that
CSS file. Without it, every component renders unstyled — Tailwind never sees the
class names that live inside the package.

`@source` scans the whole package, so the generated CSS covers every component,
not only the ones you import — roughly 48 kB, 9 kB gzipped, for the full set.

**4. Use the components.** Import each one on its own:

```svelte
<script>
	import Button from '@nqmcreative/ui/button';
	import Badge from '@nqmcreative/ui/badge';
	import Field from '@nqmcreative/ui/field';
	import Input from '@nqmcreative/ui/input';

	let email = $state('');
</script>

<Button>Get started</Button>
<Button variant="soft" tone="accent">Learn more</Button>
<Badge tone="success" dot>Live</Badge>

<Field label="Work email" hint="We only email about releases.">
	<Input bind:value={email} placeholder="you@example.com" />
</Field>
```

Every component has its own subpath — the file name in kebab-case, so
`AvatarGroup` is `@nqmcreative/ui/avatar-group` and `DatePicker` is
`@nqmcreative/ui/date-picker`. The shared modules are there too:
`/tones`, `/locale`, `/date`, `/toast`, `/actions/anchor`,
`/actions/dismissable`.

The barrel still works if you prefer it:

```js
import { Button, Badge } from '@nqmcreative/ui';
```

Both produce the same bundle — measured on the same app, barrel and subpaths
came out byte-identical, because the barrel tree-shakes. Subpaths are about
being explicit about what a file uses, and they cut the module graph the
bundler walks (177 modules to 123 in that test), not the output.

Update with `bun update @nqmcreative/ui`. The `exports` map is generated from
`src/lib` by `bun run exports`, and `bun run lint` fails if it is stale — a new
component cannot ship without its subpath.

## Adding more components

Drop a new `.svelte` file in `src/lib/components`, export it from
`src/lib/index.ts`, style it with the existing tokens (`bg-brand`,
`text-text-secondary`, `font-heading`, `ease-brand-out`, etc.) instead of raw
hex values, then `bun run build`.

If the component is tonal, import the maps from `../tones.js` rather than
writing colour classes by hand — Tailwind only sees literal class strings, so
`bg-{tone}` would silently produce nothing:

```svelte
<script lang="ts">
	import { toneSoft, toneFill, type Tone } from '../tones.js';

	let { tone = 'brand' }: { tone?: Tone } = $props();
</script>

<div class={toneSoft[tone]}>…</div>
```

One more rule worth knowing: never put two same-property colour utilities on
one element (`border-hairline` + `border-brand`), because CSS order — not class
order — decides the winner. Use the side-specific map (`toneBorderLeft`) or set
the colour once per variant.

## License

MIT — see [LICENSE](LICENSE).
