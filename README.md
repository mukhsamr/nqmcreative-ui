# @nqmcreative/ui

Svelte 5 (runes) + Tailwind CSS v4 component library. Flat surfaces, no
shadows, no border-radius except pills. 57 components, eight tones, light and
dark, no runtime dependencies.

The docs site lives in this repo — every component with a live demo, plus
theming, locale and contributing guides. `bun run dev` to read it.

## Install

```bash
bun add @nqmcreative/ui
```

```bash
bunx nqm-ui init
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
@import '@nqmcreative/ui/theme.css';
@import '@nqmcreative/ui/fonts.css';

/* Tailwind v4 skips node_modules. Without this every component renders
   unstyled, with no error anywhere. */
@source '../node_modules/@nqmcreative/ui/dist';
```

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

Each component has its own subpath — the file name in kebab-case:

```svelte
<script lang="ts">
	import Button from '@nqmcreative/ui/button';
	import Field from '@nqmcreative/ui/field';
	import Input from '@nqmcreative/ui/input';

	let email = $state('');
</script>

<Field label="Work email">
	<Input bind:value={email} placeholder="you@example.com" />
</Field>

<Button tone="accent">Get started</Button>
```

The barrel works too: `import { Button } from '@nqmcreative/ui'`.

### Tones

Eight of them — `brand`, `accent`, `violet`, `info`, `success`, `warning`,
`danger`, `neutral` — and every tonal component takes the same prop:

```svelte
<Button tone="danger">Delete</Button>
<Badge tone="warning" dot>Quota</Badge>
<Alert tone="success" title="Deployed" />
```

Each ships four steps: `bg-accent`, `hover:bg-accent-hover`, `bg-accent-light`,
`border-accent-border`. Redeclare any of them in your own `@theme` block to
rebrand everything at once.

### Dark mode

`theme.css` ships both palettes; nothing in a component says `dark:`.
`<html class="dark">` or `class="light"` forces one, bare `<html>` follows the
OS. `ThemeToggle` handles all three.

### Locale

Every built-in string — ARIA names, `No data`, the calendar's month names —
comes from one object:

```js
import { setLocale, idID } from '@nqmcreative/ui/locale';

setLocale(idID);
```

`enUS` and `idID` ship with the package; pass a partial to change a few keys.
Under SSR use `<LocaleProvider>` instead, so the locale is scoped to a request.

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
| System       | `ThemeToggle`, `LocaleProvider`                                                                                                                                                                                                                            |

Overlays are built on the native top layer and three in-house actions
(`portal`, `focusTrap`, `anchored`) rather than a positioning dependency.

## CLI

```bash
bunx nqm-ui list forms          # components in a category
bunx nqm-ui info date-picker    # subpath, and what it pulls in
bunx nqm-ui add button badge    # print the import lines
bunx nqm-ui add button --to src/routes/+page.svelte
```

## Developing

```bash
bun install
bun run dev       # the docs site at localhost:5173
bun run check     # type-check
bun run test      # vitest
bun run build     # site + package
```

`src/lib` is the package, `src/site` and `src/routes` are the docs site.

**`dist/` is committed — rebuild and commit it with your change.** Consumers
read from `dist/`, and installing from GitHub cannot build it: bun blocks a
dependency's `prepare` script.

Adding a component: write it in `src/lib/components`, export it from
`src/lib/index.ts` under a category comment, add a demo in `src/site/demos`,
then `bun run build`. `bun run lint` fails if the generated exports map or
`registry.json` is stale. The full conventions are on the site under
`/docs/adding-components`.

## License

MIT — see [LICENSE](LICENSE).
