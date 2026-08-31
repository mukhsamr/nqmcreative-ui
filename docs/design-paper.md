# paper — design specification

> Authoritative style rules for `@nqmcreative/ui/paper`.
> Written for AI agents and contributors: **every value below is what the code
> actually ships.** When adding or editing a paper component, match these rules
> exactly. If a rule here conflicts with your instinct, the rule wins.

Source of truth: `src/lib/styles/paper/`. Behaviour (not looks) lives in
`src/lib/core/` and is shared by all three styles.

---

## 1. Identity

**The neutral one.** Soft corners, light shadows, generous spacing, and a
palette that gets out of the content's way. This is the default recommendation
when a project has no opinion.

The three laws, in order of importance:

1. **Radius is a scale, and it tracks size.** Small controls `rounded-md`,
   surfaces `rounded-lg`, big surfaces `rounded-xl`, pills `rounded-full`, tiny
   affordances bare `rounded`.
2. **Shadow is a scale, and it tracks distance from the page.** `shadow-xs` for
   anything merely resting on the page, `shadow-lg` for anything floating over
   it, `shadow-2xl` for anything that has left the page entirely.
3. **No mono, no uppercase, no tracking.** Micro-labels are just small, bold,
   muted sans (`text-[11px]`/`text-[13px] font-semibold text-text-muted`).
   Numbers get `tabular-nums`, not a monospace face.

Everything else follows from those.

---

## 2. Wiring

```css
/* src/app.css */
@import 'tailwindcss';
@import '@nqmcreative/ui/paper/theme.css';
@import '@nqmcreative/ui/paper/fonts.css'; /* optional */

@source '../node_modules/@nqmcreative/ui/dist/styles/paper';
```

Import exactly one style's `theme.css`. All three define the same token
**names**, so importing two makes them fight over every colour.

---

## 3. Design tokens

Token names are a contract shared by all three styles. Only the values differ.
Every hue has the same four steps:

| step             | meaning                                        |
| ---------------- | ---------------------------------------------- |
| `--color-<tone>` | base / solid fill / text on a light surface    |
| `-hover`         | darker step for hover + active                 |
| `-light`         | tinted surface (soft variants, alerts, badges) |
| `-border`        | hairline that reads against the tinted surface |

### 3.1 Surfaces

| token                     | light     | dark      |
| ------------------------- | --------- | --------- |
| `--color-bg`              | `#ffffff` | `#0b0f19` |
| `--color-bg-alt`          | `#f9fafb` | `#111827` |
| `--color-bg-inset`        | `#f3f4f6` | `#1f2937` |
| `--color-hairline`        | `#e5e7eb` | `#1f2937` |
| `--color-hairline-strong` | `#d1d5db` | `#374151` |

### 3.2 Text

| token                    | light     | dark      |
| ------------------------ | --------- | --------- |
| `--color-text`           | `#111827` | `#f9fafb` |
| `--color-text-secondary` | `#4b5563` | `#d1d5db` |
| `--color-text-muted`     | `#6b7280` | `#9ca3af` |
| `--color-text-inverse`   | `#ffffff` | `#0b0f19` |

### 3.3 Tones

| tone                | base (L)  | hover (L) | light (L) | border (L) | base (D)  | hover (D) | light (D) | border (D) |
| ------------------- | --------- | --------- | --------- | ---------- | --------- | --------- | --------- | ---------- |
| `brand` (indigo)    | `#4f46e5` | `#4338ca` | `#eef2ff` | `#c7d2fe`  | `#818cf8` | `#a5b4fc` | `#1e1b4b` | `#3730a3`  |
| `accent` (rose)     | `#e11d48` | `#be123c` | `#fff1f2` | `#fecdd3`  | `#fb7185` | `#fda4af` | `#4c0519` | `#9f1239`  |
| `violet`            | `#7c3aed` | `#6d28d9` | `#f5f3ff` | `#ddd6fe`  | `#a78bfa` | `#c4b5fd` | `#2e1065` | `#5b21b6`  |
| `info` (blue)       | `#2563eb` | `#1d4ed8` | `#eff6ff` | `#bfdbfe`  | `#60a5fa` | `#93c5fd` | `#172554` | `#1e40af`  |
| `success` (emerald) | `#059669` | `#047857` | `#ecfdf5` | `#a7f3d0`  | `#34d399` | `#6ee7b7` | `#022c22` | `#065f46`  |
| `warning` (amber)   | `#d97706` | `#b45309` | `#fffbeb` | `#fde68a`  | `#fbbf24` | `#fcd34d` | `#451a03` | `#92400e`  |
| `danger` (red)      | `#dc2626` | `#b91c1c` | `#fef2f2` | `#fecaca`  | `#f87171` | `#fca5a5` | `#450a0a` | `#991b1b`  |
| `neutral` (gray)    | `#6b7280` | `#4b5563` | `#f3f4f6` | `#d1d5db`  | `#9ca3af` | `#d1d5db` | `#1f2937` | `#374151`  |

`brand` is the default `tone` for every component that has one.

### 3.4 Type tokens

```css
--font-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-heading:
	'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
```

Work Sans sets running text in **every** style, so swapping the word after
`@nqmcreative/ui/` keeps the reading rhythm and only the headings change voice.
Plus Jakarta Sans has rounded terminals, open counters and low contrast —
softer than a system stack, which would land on Segoe UI and give paper's
generous spacing nothing warm to sit in.

`fonts.css` ships both as **variable** files (`font-weight: 400 700`), one
request per subset (latin, latin-ext). The mono stack is system-only and is
essentially unused by components — paper has **no `font-mono` utility
anywhere**.

### 3.5 Motion tokens

```css
--ease-brand: cubic-bezier(0.4, 0, 0.2, 1); /* standard, symmetric */
--ease-brand-out: cubic-bezier(0, 0, 0.2, 1); /* decelerate; the UI default */
```

These are the plain material-style curves. Paper does not overshoot.

### 3.6 Dark mode

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Two ways in, and they cooperate: `class="dark"` on `<html>` wins outright;
otherwise the OS preference applies unless `<html>` says `class="light"`.

**Components must never write `dark:` classes.** All colour comes from tokens,
so dark mode follows automatically.

---

## 4. Typography

| role                                                   | classes                                                                              |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Section heading                                        | `font-heading text-3xl font-semibold tracking-tight text-balance`                    |
| Hero heading                                           | `font-heading text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl`       |
| Card / dialog / drawer title                           | `font-heading text-base font-semibold text-text`                                     |
| Popover title                                          | `font-heading text-sm font-semibold text-text`                                       |
| Stat / price value                                     | `font-heading text-3xl font-semibold tracking-tight tabular-nums` (price `text-4xl`) |
| Body                                                   | `font-sans text-sm leading-relaxed text-text-secondary`                              |
| Lede                                                   | `font-sans text-lg leading-relaxed text-pretty text-text-secondary`                  |
| Secondary / description                                | `font-sans text-[13px] leading-relaxed text-text-secondary`                          |
| Label                                                  | `font-sans text-sm font-medium text-text`                                            |
| Help / error                                           | `font-sans text-[13px] text-text-muted` / `text-danger`                              |
| **Micro-label (eyebrow, group, section, column head)** | `font-sans text-[11px] font-semibold text-text-muted` or `text-[13px] font-semibold` |
| Meta / counts / hints                                  | `text-[11px] text-text-muted tabular-nums`                                           |

Heading weight in paper is **`font-semibold` (600)** — never `font-medium` for
headings. Card and dialog titles are `text-base`, not `text-lg`: paper leans on
shadow and spacing for hierarchy, so type does not have to shout.

**Base body size is 14px (`text-sm`)**; the secondary size is 13px
(`text-[13px]`); micro is 11px.

Any digit that can change width — counts, prices, sizes, page numbers, times,
percentages, hex — gets `tabular-nums`.

---

## 5. Geometry

### 5.1 Radius scale

| radius         | value | used for                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rounded`      | 4px   | tiny affordances: close/clear icon buttons, checkbox box, colour preview, sort trigger, toast action, logo tile                                                                                                                                                                                                                                |
| `rounded-sm`   | 2px   | `Link` (focus-ring shape only)                                                                                                                                                                                                                                                                                                                 |
| `rounded-md`   | 6px   | **controls**: Button, Input, Select, Textarea, InputAddon, Combobox, DatePicker, MultiSelect, TagsInput, PinInput, MenuItem, calendar day, sidebar row, navbar link, pagination cell, tooltip, segmented item, panel tab, badge, chips, drawer/modal close button, mobile nav row                                                              |
| `rounded-lg`   | 8px   | **surfaces**: Card, Alert, Accordion, Table shell, EmptyState, Dropzone, file list, boxed radio/checkbox option, Dropdown/ContextMenu/Combobox menus, Popover, Toast, SegmentedControl container, ThemeToggle container, Tabs panel container, Sidebar floating, FeatureCard, Testimonial card, bordered grids, Avatar squared, Skeleton block |
| `rounded-xl`   | 12px  | **big surfaces**: Modal, CommandPalette, PricingCard, CTASection panel                                                                                                                                                                                                                                                                         |
| `rounded-full` | ∞     | pills and discs: Avatar, Switch track + thumb, Radio, Spinner, Steps marker + connector, Progress track + fill, pill tabs, hero badge, pricing ribbon, tick medallions, tab count chip, dots                                                                                                                                                   |

Directional forms in use: `rounded-t-md` (underline tab), `rounded-b-lg` (card
footer), `rounded-b-xl` (modal footer), `rounded-l-md` / `rounded-r-md`
(`InputGroup` ends).

**Rule of thumb:** if it is smaller than ~40px tall and you can click it →
`rounded-md`. If it is a container that holds other things → `rounded-lg`. If it
covers the page → `rounded-xl`.

### 5.2 Borders

- Default hairline: `border border-hairline` (1px) for surfaces.
- **Interactive controls use the stronger rule**: `border-hairline-strong` is
  the resting border of Input, Select, Textarea, Combobox, DatePicker,
  MultiSelect, TagsInput, PinInput, FileInput, InputAddon, checkbox/radio boxes,
  colour swatches and the FileInput button. Non-interactive surfaces stay on
  `border-hairline`.
- Accent stripe (Card `accent`, Alert `accent`, Testimonial `accent`):
  **`border-l-4`**.
- Featured PricingCard and current Step marker: `border-2`.
- Tab underline: `border-b-2`.
- Dashed: `border-2 border-dashed border-hairline-strong` (Dropzone), and
  `border border-dashed border-hairline-strong` (EmptyState).

### 5.3 Elevation scale

| shadow       | meaning                | used on                                                                                                                                                                                                                                                                                                                 |
| ------------ | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `shadow-xs`  | resting on the page    | solid + outline Button, all text inputs, Select, Textarea, PinInput, InputAddon, checkbox/radio box, Card `outline`, Table shell, Kbd, file list, boxed options, active segmented/panel tab, active pagination cell, done Step marker, bordered StatsBand grid, ThemeToggle icon button, Alert `outline`, CTA `outline` |
| `shadow-sm`  | slightly lifted        | Sidebar `floating`, Switch thumb, Slider thumb                                                                                                                                                                                                                                                                          |
| `shadow-md`  | hover lift             | `Card interactive:hover`, `FeatureCard[href]:hover`                                                                                                                                                                                                                                                                     |
| `shadow-lg`  | floating over the page | Dropdown, ContextMenu, Combobox/MultiSelect listbox, DatePicker popup, Popover, Toast, Tooltip, featured PricingCard, CTA `solid`                                                                                                                                                                                       |
| `shadow-2xl` | off the page entirely  | Modal, Drawer, CommandPalette                                                                                                                                                                                                                                                                                           |

Backdrops for `<dialog>`: `backdrop:bg-text/30 backdrop:backdrop-blur-[1px]`.

Elevation changes are the hover language: `transition-shadow duration-150
ease-brand-out hover:shadow-md`. Paper never translates on hover.

---

## 6. Focus, hover, disabled

Shared across all styles (from `src/lib/core/tones.ts`):

```ts
focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2';
peerFocusRing = 'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2';
toneRing[t] = 'focus-visible:outline-<tone>';
```

Rules:

- Every focusable element gets `{focusRing} {toneRing[tone]}`.
- Small icon buttons inside a component use the literal
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current`.
- Accordion summaries use `focus-visible:outline-offset-[-2px]` so the ring
  stays inside the rounded container.
- Text inputs use `focus:outline-none` on the `<input>` and colour the wrapper
  border instead: `toneFocusBorder[tone]` (bare control) or
  `toneFocusWithinBorder[tone]` (wrapped control).
- Invalid state: `border-danger` (and `focus-within:border-danger` on wrappers).
- Disabled: `disabled:opacity-50 disabled:pointer-events-none` for controls;
  `pointer-events-none opacity-50` on wrappers; `opacity-40` for menu/list rows
  and pagination cells.
- Hover on rows is a surface swap — `hover:bg-bg-inset` for menu/nav/sidebar
  rows, `hover:bg-bg-alt` for table rows and outline buttons.

---

## 7. Motion

- Standard transition: `transition-colors duration-150 ease-brand-out`.
- Buttons: `transition-colors duration-150 ease-brand-out`; tabs, segmented
  items and ThemeToggle options: `transition-all duration-150 ease-brand-out`.
- Cards and feature cards: `transition-shadow duration-150 ease-brand-out`.
- List rows and menu items: `duration-100`.
- Chevrons / carets: `transition-transform duration-200 ease-brand-out`.
- Sidebar width `transition-[width] duration-200`; Progress fill
  `transition-[width] duration-300 ease-brand`.
- Drawer: `animate-[drawer-<side>_220ms_cubic-bezier(0,0,0.2,1)]`, with global
  keyframes declared inside `Drawer.svelte` and a
  `@media (prefers-reduced-motion: reduce) { dialog { animation: none } }` guard.
- The only `translate` on hover is the ColorInput swatch
  (`hover:-translate-y-0.5`). Cards raise their shadow, they do not move.

---

## 8. Icons

Consumer-supplied snippets; the component sizes the box (`src/lib/styles/paper/icon.ts`):

| export   | size | use                                             |
| -------- | ---- | ----------------------------------------------- |
| `iconSm` | 14px | menu rows, chips, links, one line of small text |
| `iconMd` | 16px | default: buttons, nav items, tabs, list rows    |
| `iconLg` | 20px | headers, stats, beside a heading                |
| `iconXl` | 24px | dialog and empty-state marks                    |

Each is `grid size-N shrink-0 place-items-center *:size-N`.

Inline SVGs drawn by the library use `stroke-width="1.5"`/`"1.6"` and
**`stroke-linecap="round"`**.

---

## 9. Control size scale

| component               | sm                                                                                                                   | md                                                       | lg                      | xl                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------- | --------------------- |
| Button                  | `h-8 px-3 text-[13px]`                                                                                               | `h-10 px-4 text-sm`                                      | `h-11 px-5 text-[15px]` | `h-12 px-6 text-base` |
| Button (icon-only)      | `size-8`                                                                                                             | `size-10`                                                | `size-11`               | `size-12`             |
| Input / FileInput       | `h-8 text-[13px]`                                                                                                    | `h-10 text-sm`                                           | `h-11 text-[15px]`      | —                     |
| InputAddon              | `h-8 px-2.5 text-[13px]`                                                                                             | `h-10 px-3 text-sm`                                      | `h-11 px-3 text-[15px]` | —                     |
| FileInput button        | `h-6 px-2 text-[11px]`                                                                                               | `h-7 px-2.5 text-xs`                                     | `h-8 px-3 text-xs`      | —                     |
| SegmentedControl        | `h-7 px-2.5 text-[13px]`                                                                                             | `h-8 px-3.5 text-sm`                                     | —                       | —                     |
| SegmentedControl (icon) | `size-7`                                                                                                             | `size-8`                                                 | —                       | —                     |
| Avatar                  | `xs size-6 text-[10px]` · `sm size-8 text-xs` · `md size-10 text-sm` · `lg size-12 text-base` · `xl size-16 text-lg` |
| Progress                | `h-1.5`                                                                                                              | `h-2`                                                    | `h-3`                   | —                     |
| Spinner                 | `xs size-3 border-[1.5px]` · `sm size-4 border-2` · `md size-5 border-2` · `lg size-8 border-[3px]`                  |
| Switch                  | track `h-5 w-9`, thumb `size-4`, travel `translate-x-4`                                                              | track `h-6 w-11`, thumb `size-5`, travel `translate-x-5` | —                       | —                     |
| Badge                   | `px-2 py-0.5 text-[11px]`                                                                                            | `px-2.5 py-0.5 text-xs`                                  | —                       | —                     |
| Modal                   | `max-w-sm`                                                                                                           | `max-w-lg`                                               | `max-w-2xl`             | —                     |
| Drawer (horizontal)     | `w-[min(20rem,100vw)]`                                                                                               | `w-[min(28rem,100vw)]`                                   | `w-[min(40rem,100vw)]`  | `full: w-screen`      |
| Drawer (vertical)       | `h-[min(16rem,100vh)]`                                                                                               | `h-[min(24rem,100vh)]`                                   | `h-[min(36rem,100vh)]`  | `full: h-screen`      |

Fixed sizes used elsewhere: PinInput cell `size-11`; Pagination cell
`h-9 min-w-9`; Kbd `h-6 min-w-6`; Steps marker `size-8`; Checkbox/Radio box
`size-[18px]`; Navbar/Sidebar header `h-16`; Sidebar `w-60` (collapsed `w-16`);
CommandPalette input `h-12`; pill tab `h-9`, panel tab `h-8`.

---

## 10. Tone maps (shared, `core/tones.ts`)

Never build a class name by interpolation (`bg-${tone}`) — Tailwind scans source
text. Always read from these maps:

| map                        | produces                                                  |
| -------------------------- | --------------------------------------------------------- |
| `toneSolid[t]`             | `bg-<t> text-text-inverse`                                |
| `toneSolidHover[t]`        | `hover:bg-<t>-hover`                                      |
| `toneSoft[t]`              | `bg-<t>-light text-<t>` (neutral → `text-text-secondary`) |
| `toneSoftHover[t]`         | `hover:bg-<t>-border/50`                                  |
| `toneText[t]`              | `text-<t>` (neutral → `text-text-secondary`)              |
| `toneFill[t]`              | `bg-<t>`                                                  |
| `toneSurface[t]`           | `bg-<t>-light`                                            |
| `toneBorder[t]`            | `border-<t>`                                              |
| `toneBorderSoft[t]`        | `border-<t>-border`                                       |
| `toneBorderLeft[t]`        | `border-l-<t>`                                            |
| `toneHoverBorder[t]`       | `hover:border-<t>`                                        |
| `toneHoverText[t]`         | `hover:text-<t>` (neutral → `hover:text-text`)            |
| `toneRing[t]`              | `focus-visible:outline-<t>`                               |
| `toneFocusBorder[t]`       | `focus:border-<t>`                                        |
| `toneFocusWithinBorder[t]` | `focus-within:border-<t>`                                 |
| `tonePeerChecked[t]`       | `peer-checked:border-<t> peer-checked:bg-<t>`             |
| `tonePeerFocus[t]`         | `peer-focus-visible:outline-<t>`                          |

---

## 11. Component specifications

### 11.1 Actions

#### Button

```
base: inline-flex items-center justify-center gap-2 rounded-md border font-sans
      font-medium whitespace-nowrap transition-colors duration-150 ease-brand-out
      disabled:opacity-50 disabled:pointer-events-none
      aria-disabled:opacity-50 aria-disabled:pointer-events-none
```

Sizes per §9.

| variant           | classes                                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `solid`/`primary` | `border-transparent shadow-xs` + `toneSolid` + `toneSolidHover`                                                                                                            |
| `soft`            | `border-transparent` + `toneSoft` + `toneSoftHover`                                                                                                                        |
| `outline`         | `bg-bg shadow-xs` + `toneText` + `toneBorderSoft` + `hover:bg-bg-alt` — **outline keeps its own colours on hover; it never flips to a solid fill (that is matte's move).** |
| `ghost`           | `border-transparent bg-transparent` + `toneText` + `toneSoftHover`                                                                                                         |
| `link`            | `border-transparent` + `toneText` + `h-auto p-0 text-sm underline-offset-4 hover:underline`                                                                                |

Spinner replaces the leading icon while busy (`size sm → xs`, else `sm`).
`aria-busy` is set; an async `onclick` returning a promise auto-locks the button.

#### Link

```
inline-flex items-center gap-1 rounded-sm font-sans
transition-colors duration-150 ease-brand-out
{muted ? 'text-text-secondary' + toneHoverText : toneText}
{focusRing} {toneRing}
```

Underline: `always` → `underline underline-offset-2 decoration-current/40`;
`hover` (default) → `hover:underline underline-offset-2 decoration-current/40`;
`none` → nothing. External marker `<span class="text-[0.85em]">↗</span>`.
Icons use `iconSm`.

### 11.2 Forms

#### Input (wrapper pattern)

```
inline-flex w-full items-center gap-2 rounded-md border bg-bg px-3 shadow-xs
transition-colors duration-150 ease-brand-out
{sizes[size]}
{invalid ? 'border-danger focus-within:border-danger'
         : 'border-hairline-strong ' + toneFocusWithinBorder[tone]}
{disabled ? 'pointer-events-none opacity-50' : ''}
```

Inner `<input>`: `w-full min-w-0 bg-transparent font-sans text-text
placeholder:text-text-muted focus:outline-none`. Icons `shrink-0 text-text-muted`.

#### Textarea

`w-full rounded-md border bg-bg px-3 py-2 font-sans text-sm text-text shadow-xs`

- `placeholder:text-text-muted focus:outline-none`, `resize-y` (or
  `resize-none overflow-hidden` when `autoresize`).

#### Select

`h-10 w-full appearance-none rounded-md border bg-bg py-0 pr-9 pl-3 font-sans
text-sm text-text shadow-xs`; chevron `pointer-events-none absolute right-3
size-4 text-text-muted`.

#### InputGroup / InputAddon

Group: `flex w-full items-stretch [&>*]:min-w-0 [&>*]:rounded-none
[&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md
[&>*:focus-within]:relative [&>*:focus-within]:z-10
[&>*:not(:first-child)]:-ml-px` — the group re-rounds its own ends.
Addon: `inline-flex shrink-0 items-center gap-1.5 rounded-md border
border-hairline-strong font-sans whitespace-nowrap text-text-secondary shadow-xs`;
`muted` → `bg-bg-alt`, else `bg-bg`.

#### Checkbox / Radio

Wrapper `group inline-flex items-start gap-2.5 font-sans text-sm`.
Real input is `peer sr-only`. Visual box:

```
mt-0.5 flex size-[18px] shrink-0 items-center justify-center
rounded border border-hairline-strong bg-bg shadow-xs
transition-colors duration-150 ease-brand-out
{tonePeerChecked} {peerFocusRing} {tonePeerFocus}
```

Checkbox box is `rounded` (4px); Radio is `rounded-full` with a
`size-1.5 rounded-full bg-text-inverse` dot.
Indeterminate bar: `h-0.5 w-2.5 rounded-full bg-text-muted`.
Tick `size-3 text-text-inverse opacity-0 … group-has-[:checked]:opacity-100`.
Description `text-[13px] leading-snug text-text-muted`.

#### CheckboxGroup / RadioGroup

`fieldset` = `flex flex-col gap-3 border-0 p-0`; legend
`mb-1 font-sans text-sm font-medium text-text`, required marker
`<span class="ml-0.5 text-danger">*</span>`. Options `flex gap-2.5`.
Boxed option:

```
flex flex-1 cursor-pointer items-start gap-3 rounded-lg border p-4 shadow-xs
transition-colors duration-150 ease-brand-out
{selected ? toneBorder + toneSurface
          : 'border-hairline bg-bg hover:border-hairline-strong'}
```

Selection is shown **in the tone** — border and tinted surface.

#### Switch

Track `relative mt-0.5 inline-flex shrink-0 items-center rounded-full p-0.5
transition-colors duration-200 ease-brand-out`; on → `toneFill`, off →
`bg-hairline-strong`. Thumb `rounded-full bg-bg shadow-sm`.

#### Slider

Track `h-1.5 rounded-full` with
`bg-[linear-gradient(to_right,currentColor_var(--pct),var(--color-bg-inset)_var(--pct))]`;
thumb `size-4 rounded-full border-2 border-bg bg-current shadow-sm`
(`-mt-[5px]` on WebKit). Focus ring uses `focus-visible:outline-offset-4`.
Value readout `text-sm font-medium tabular-nums` in the tone colour.
Min/max row `text-[11px] text-text-muted tabular-nums`.

#### Field / Label

Field `flex w-full flex-col gap-1.5`; label `font-sans text-sm font-medium
text-text`; error/help `font-sans text-[13px] text-danger` / `text-text-muted`.

#### SegmentedControl

Container `inline-flex items-center gap-1 rounded-lg border border-hairline
bg-bg-inset p-1`.
Item `inline-flex items-center justify-center rounded-md font-sans font-medium
whitespace-nowrap transition-all duration-150 ease-brand-out`; active →
`bg-bg text-text shadow-xs` (a raised chip on an inset track); inactive →
`text-text-muted hover:text-text`.

#### PinInput

Cell `size-11 rounded-md border bg-bg text-center font-sans text-base
font-medium text-text tabular-nums shadow-xs`; separator `h-px w-2
bg-hairline-strong`.

#### TagsInput / MultiSelect

Wrapper `flex w-full flex-wrap items-center gap-1.5 rounded-md border bg-bg
py-1.5 … shadow-xs`.
Chip `inline-flex items-center gap-1 rounded-md py-0.5 pr-0.5 pl-2 text-xs
font-medium` + `toneSoft`. Remove button `size-4 rounded hover:bg-bg/70`,
glyph `size-2.5`. Inner input `h-7 min-w-24 flex-1 … text-sm`.
MultiSelect option check box `size-4 rounded border`.

#### Combobox / DatePicker / SearchInput / TimeInput / CurrencyInput / ColorInput / FileInput

- Combobox wrapper `rounded-md … pr-1.5 pl-3 shadow-xs`, inner input `h-10 text-sm`;
  listbox `z-50 max-h-64 overflow-y-auto rounded-lg border border-hairline
bg-bg py-1 font-sans shadow-lg`; group label `px-3 pt-2 pb-1 text-[11px]
font-semibold text-text-muted`; option `mx-1 rounded-md px-2.5 py-2 text-sm`,
  active → `toneSoft`.
- DatePicker wrapper `pr-1 pl-3`, input `tabular-nums`; popup
  `z-50 rounded-lg border border-hairline bg-bg shadow-lg`.
- CurrencyInput addon `text-xs font-medium text-text-muted`.
- ColorInput preview `relative grid size-5 place-items-center overflow-hidden
rounded border border-hairline-strong`; swatch buttons `size-6 rounded-md
border` + `hover:-translate-y-0.5`; selected swatch `border-text`. Hex field
  `uppercase tabular-nums`.
- TimeInput steppers `grid size-6 place-items-center rounded`.
- FileInput row `rounded-md … px-1 shadow-xs`; the "choose" button is
  `rounded border border-hairline-strong bg-bg-alt font-sans font-medium
text-text-secondary`. File list `rounded-lg border border-hairline bg-bg
shadow-xs`, rows `border-b border-hairline px-4 py-2.5 … last:border-b-0`,
  size in `text-xs text-text-muted tabular-nums`.

#### Dropzone

```
flex w-full flex-col items-center gap-3 rounded-lg border-2 border-dashed
px-6 py-10 text-center font-sans transition-colors duration-150 ease-brand-out
{dragging ? toneBorder + toneSurface
          : 'border-hairline-strong bg-bg-alt/50 hover:bg-bg-alt'}
```

Icon medallion `flex size-12 items-center justify-center rounded-full` + `toneSoft`.
Hint line `text-xs text-text-muted`.

#### Calendar

`flex w-[18rem] flex-col gap-3 p-3 font-sans`.
Nav buttons `inline-flex size-8 items-center justify-center rounded-md
text-text-secondary hover:bg-bg-inset hover:text-text`.
Weekday row `grid grid-cols-7 gap-0.5`, cells `pb-1 text-center text-[11px]
font-medium text-text-muted`.
Day cell `flex h-9 items-center justify-center rounded-md text-[13px]
tabular-nums`; selected → `toneFill + font-semibold text-text-inverse`;
today (unselected) → `toneSoft + font-semibold`; outside month →
`text-text-muted/60`.

### 11.3 Data display

#### Badge

```
inline-flex items-center gap-1.5 rounded-md font-sans font-medium
```

Variants: `soft` → `toneSoft`; `solid` → `toneSolid`; `outline` →
`border {toneBorderSoft} {toneText} bg-bg`. Dot `size-1.5 shrink-0 rounded-full`.

> Paper's badge is a **rounded rectangle**, not a pill. Pills are reserved for
> hero badges, pricing ribbons and pill tabs.

#### Avatar

`inline-flex shrink-0 items-center justify-center overflow-hidden font-sans
font-semibold select-none`; `squared` → `rounded-lg`, else `rounded-full`.
Image `size-full object-cover`; fallback surface `toneSoft`, image surface
`bg-bg-inset`.
AvatarGroup `flex items-center *:-ml-2 *:ring-2 *:ring-bg
[&>*:first-child]:ml-0`.

#### Card

Container `flex flex-col rounded-lg` + variant:

| variant   | classes                                     |
| --------- | ------------------------------------------- |
| `outline` | `border border-hairline bg-bg shadow-xs`    |
| `filled`  | `border border-hairline bg-bg-alt`          |
| `tinted`  | `border border-transparent` + `toneSurface` |

`accent` → `border-l-4` + `toneBorderLeft`.
`interactive` → `transition-shadow duration-150 ease-brand-out hover:shadow-md`

- `toneHoverBorder`.
  Header `px-5 pt-5`, eyebrow `font-sans text-xs font-semibold text-text-muted`,
  title `font-heading text-base font-semibold text-text`.
  Body `px-5 pt-3 pb-5` (or `p-5` with no header).
  Footer `rounded-b-lg border-t border-hairline bg-bg-alt px-5 py-3.5`.

#### Stat

Label `flex items-center gap-2 text-sm font-medium text-text-muted`;
value `font-heading text-3xl font-semibold tracking-tight tabular-nums`;
delta `text-sm font-medium` in the trend tone; caption `text-sm text-text-muted`.

#### Table

Shell `flex w-full flex-col overflow-hidden rounded-lg border border-hairline
bg-bg shadow-xs`.
Toolbar / bulk bar `border-b border-hairline bg-brand-light px-4 py-3`
(**tinted brand**, not grey), count `font-sans text-[13px] font-semibold text-text`.
Caption row `border-b border-hairline px-4 py-3 font-sans text-[13px]
text-text-secondary`.
`<table>` = `w-full border-collapse font-sans text-sm`.
Head row `border-b border-hairline bg-bg-alt`; sticky variant adds
`sticky top-0 z-10`.
`<th>` = `text-[13px] font-semibold text-text-muted` + `pad`. Sort trigger adds
`inline-flex items-center gap-1.5 rounded`, caret `text-[9px] leading-none`.
Cell padding `pad` = `px-4 py-3`, compact `px-4 py-2`.
Row `border-b border-hairline last:border-b-0`; selected `bg-brand-light`;
striped odd `bg-bg-alt`; hoverable `hover:bg-bg-alt`.
Selection column `w-10`. Empty cell `px-4 py-10 text-center text-sm text-text-muted`.
Footer bar `border-t border-hairline px-4 py-3 font-sans text-[13px]
text-text-secondary`.

#### Kbd

```
inline-flex h-6 min-w-6 items-center justify-center rounded-md
border border-hairline bg-bg-alt px-1.5
font-sans text-[11px] font-medium text-text-secondary shadow-xs
```

### 11.4 Feedback

#### Alert

`flex items-start gap-3 rounded-lg p-4 font-sans` + variant:

| variant   | classes                                     |
| --------- | ------------------------------------------- |
| `soft`    | `toneSurface` + `border` + `toneBorderSoft` |
| `outline` | `bg-bg shadow-xs border` + `toneBorderSoft` |
| `accent`  | `toneSurface` + `border-l-4` + `toneBorder` |

Title `text-sm leading-snug font-semibold` in `toneText`; body
`text-[13px] leading-relaxed text-text-secondary`; icon `mt-0.5 shrink-0` in
`toneText`; dismiss `-m-1 rounded p-1 text-text-muted hover:bg-bg/60`.
`role` is `alert` for `danger`, otherwise `status`.

#### Toaster

Region `pointer-events-none fixed z-[100] flex w-[min(24rem,calc(100vw-2rem))]
flex-col gap-2.5` + position.
Toast `pointer-events-auto flex w-full items-start gap-3 rounded-lg border
border-hairline bg-bg p-3.5 font-sans shadow-lg` — **a neutral white card**;
only the icon carries the tone. Title `text-sm leading-snug font-semibold
text-text`. Action `mt-1 self-start rounded font-sans text-[13px] font-semibold
underline underline-offset-2` in `toneText`.

#### Progress

Track `w-full overflow-hidden rounded-full bg-bg-inset` (`h-1.5|2|3`); fill
`h-full rounded-full transition-[width] duration-300 ease-brand` + `toneFill`;
indeterminate adds `w-1/3 animate-pulse`. Value label `text-xs font-medium
text-text-muted tabular-nums`.

#### Spinner

`inline-block shrink-0 animate-spin rounded-full border-current/25
border-t-current` — a faded ring with a solid head.

#### Skeleton

`animate-pulse bg-bg-inset`; `text` `h-4 w-full rounded-md`, `block`
`h-24 w-full rounded-lg`, `circle` `size-10 rounded-full`. Multi-line: last line
`w-2/3`, gap `gap-2`.

#### EmptyState

`flex flex-col items-center gap-4 rounded-lg px-6 py-12 text-center font-sans`;
bordered → `border border-dashed border-hairline-strong bg-bg-alt/50`.
Medallion `size-12 rounded-full` + `toneSoft`; title `font-heading text-base
font-semibold`.

### 11.5 Layout & navigation

#### Divider

Horizontal `h-px w-full bg-hairline`; vertical `w-px self-stretch bg-hairline`;
labelled `flex items-center gap-3` with rules `h-px flex-1 bg-hairline` and the
label `font-sans text-xs font-medium text-text-muted` (no uppercase).

#### Tabs

List: `underline` → `gap-5 border-b border-hairline`; `pill` → `gap-1.5`;
`panel` → `gap-1 rounded-lg border border-hairline bg-bg-inset p-1`.
Item base `inline-flex items-center justify-center gap-2 font-sans text-sm
font-medium whitespace-nowrap transition-all duration-150 ease-brand-out`.

| variant     | item                                         | active                      |
| ----------- | -------------------------------------------- | --------------------------- |
| `underline` | `-mb-px rounded-t-md border-b-2 px-1 pb-2.5` | `toneBorder + toneText`     |
| `pill`      | `h-9 rounded-full px-3.5`                    | `toneSoft`                  |
| `panel`     | `h-8 rounded-md px-3.5`                      | `bg-bg text-text shadow-xs` |

Inactive is always `text-text-muted hover:text-text`.
Count badge `rounded-full bg-bg-inset px-1.5 text-[11px] font-normal
text-text-muted tabular-nums`.

#### Accordion

Container `flex flex-col overflow-hidden rounded-lg border border-hairline bg-bg`
(**a card**). Item `group border-b border-hairline last:border-b-0`.
Summary `flex cursor-pointer list-none items-center gap-4 px-4 py-3.5 font-sans
text-sm font-medium text-text … hover:bg-bg-alt` and hides the native marker.
Marker rotates **180°** (`group-open:rotate-180` — a chevron flipping),
`size-4` in `toneText`. Meta `text-[13px] font-normal text-text-muted`.
Content `px-4 pb-4 font-sans text-sm leading-relaxed text-text-secondary`.

#### Breadcrumb

`font-sans text-sm`; trail `flex flex-wrap items-center gap-1.5`; separator
`text-hairline-strong select-none`; link `inline-flex items-center gap-1.5
rounded px-1 py-0.5 text-text-muted hover:bg-bg-inset` + `toneHoverText`;
current `px-1 py-0.5 font-medium text-text`.

#### Pagination

Cell `inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2
font-sans text-sm font-medium tabular-nums transition-colors duration-150
ease-brand-out` + `focusRing`.
Current page → `toneSolid shadow-xs`; others → `text-text-secondary
hover:bg-bg-inset`; ellipsis → `text-text-muted`. Prev/next are `size-4` SVG
chevrons.

#### Steps

Marker `flex size-8 shrink-0 items-center justify-center rounded-full border
font-sans text-xs font-semibold`:

| state     | classes                                                   |
| --------- | --------------------------------------------------------- |
| `error`   | `border-danger bg-danger-light text-danger`               |
| `done`    | `toneFill border-transparent text-text-inverse shadow-xs` |
| `current` | `border-2 border-current bg-bg` + `toneText`              |
| `todo`    | `border-hairline-strong bg-bg text-text-muted`            |

Connector `rounded-full`, `h-0.5` horizontal (`mx-3 flex-1`) or `w-0.5` vertical
(`my-1 flex-1`); filled with `toneFill`, else `bg-hairline`.

### 11.6 App shell

#### Navbar

Header `w-full bg-bg`, `sticky top-0 z-40` when sticky, `border-b border-hairline`
when bordered. Nav `mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6`.
Desktop list `hidden flex-1 items-center gap-1 md:flex` (tight — the links carry
their own padding).
Link base `inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 font-sans
text-sm font-medium transition-colors duration-150 ease-brand-out`; active →
`toneSoft`; inactive → `text-text-secondary hover:bg-bg-inset hover:text-text`.
Badge `text-[11px] text-text-muted tabular-nums`.
Mobile trigger `inline-flex size-9 items-center justify-center rounded-md
text-text-secondary hover:bg-bg-inset hover:text-text md:hidden`.
Mobile drawer rows `flex items-center justify-between gap-3 rounded-md px-3
py-2.5 font-sans text-sm font-medium`, list `flex flex-col gap-0.5` (no rules).

#### Sidebar

Shell `flex shrink-0 flex-col transition-[width] duration-200 ease-brand-out`,
`w-60` (`w-16` collapsed).

| variant    | classes                                                                           |
| ---------- | --------------------------------------------------------------------------------- |
| `plain`    | `h-full bg-transparent`                                                           |
| `filled`   | `h-full border-r border-hairline bg-bg-alt`                                       |
| `floating` | `m-3 h-[calc(100%-1.5rem)] rounded-lg border border-hairline bg-bg-alt shadow-sm` |

Header `flex h-16 shrink-0 items-center gap-3 border-b border-hairline px-3`.
Body `flex-1 overflow-y-auto p-2`.
Row base `flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left
font-sans text-sm`. Active → `toneSoft + font-medium`; inactive →
`text-text-secondary hover:bg-bg-inset hover:text-text`.
Section label `px-2.5 pb-1 font-sans text-[11px] font-semibold text-text-muted`.
Nested list `ml-4 … border-l border-hairline pl-2`.
Footer `border-t border-hairline p-2`; collapse toggle `h-8 rounded-md …
font-sans text-xs`.

#### Footer

`w-full border-t border-hairline bg-bg-alt`; inner `mx-auto flex w-full
max-w-6xl flex-col gap-12 px-6 py-14`. Column heading `font-sans text-[13px]
font-semibold text-text`; links `font-sans text-[13px] text-text-muted` +
`toneHoverText`; bottom bar `border-t border-hairline pt-6` with
`font-sans text-[13px] text-text-muted`.

### 11.7 Marketing

#### HeroSection

Section `w-full px-6 py-20 sm:py-28`; inner `mx-auto … max-w-6xl gap-16`.
Eyebrow is a **pill**: `inline-flex rounded-full px-3 py-1 font-sans text-[13px]
font-medium` + `toneSoft`.
Heading `max-w-2xl font-heading text-4xl leading-[1.1] font-semibold
tracking-tight text-balance text-text sm:text-5xl`.
Lede `max-w-xl font-sans text-lg leading-relaxed text-pretty text-text-secondary`.

#### FeatureGrid / FeatureCard

Section `w-full px-6 py-20`; header stack `gap-12`; eyebrow `font-sans
text-[13px] font-semibold text-text-muted`.
Grid: bordered → `gap-px overflow-hidden rounded-lg border border-hairline
bg-hairline`; otherwise `gap-6`.
Card `group flex flex-col gap-3 rounded-lg bg-bg p-5`; with `href` adds
`transition-shadow duration-150 ease-brand-out hover:shadow-md`.
Icon tile `flex size-10 items-center justify-center rounded-lg` + `toneSoft`
(a **soft tinted** tile); title `font-heading text-base font-semibold`.

#### PricingCard

`flex flex-col rounded-xl bg-bg`; featured → `border-2 shadow-lg` + `toneBorder`,
else `border border-hairline shadow-xs`. Header `flex flex-col gap-4 p-6`
(no tint). Ribbon `shrink-0 rounded-full px-2.5 py-0.5 font-sans text-[11px]
font-medium`, featured → `toneSolid`, else `toneSoft`.
Price `font-heading text-4xl font-semibold tracking-tight text-text tabular-nums`.
Feature list `border-t border-hairline p-6`; tick sits in a
`size-4 rounded-full` + `toneSoft` medallion with a `size-2.5` glyph.

#### Testimonial

`flex flex-col gap-5` + variant: `plain` → nothing; `card` → `rounded-lg border
border-hairline bg-bg p-6 shadow-xs`; `accent` → `rounded-lg toneSurface
border-l-4 toneBorderLeft p-6`.
Quote `font-sans leading-relaxed text-pretty text-text-secondary`
(`large` → `text-xl sm:text-2xl`), wrapped in typographic quote marks.

#### LogoCloud

Section `w-full px-6 py-14`; label `text-center font-sans text-[13px]
font-medium text-text-muted`; row `flex flex-wrap items-center justify-center
gap-x-12 gap-y-8`; logo `h-7 w-auto object-contain`; muted →
`opacity-60 grayscale hover:opacity-100 hover:grayscale-0`.

#### CTASection

Section `w-full px-6 py-16`; panel `mx-auto flex w-full max-w-6xl gap-8
rounded-xl p-10 sm:p-14` + variant:

| variant   | classes                                         |
| --------- | ----------------------------------------------- |
| `tinted`  | `toneSurface border` + `toneBorderSoft`         |
| `solid`   | `toneSolid shadow-lg`                           |
| `outline` | `bg-bg border` + `toneBorderSoft` + `shadow-xs` |

Heading `font-heading text-3xl font-semibold tracking-tight text-balance`;
on `solid`, text becomes `text-text-inverse` / `text-text-inverse/80`.

#### StatsBand

Section `w-full px-6 py-16`; grid bordered → `gap-px overflow-hidden rounded-lg
border border-hairline bg-hairline shadow-xs`, else `gap-8`; cell `bg-bg p-6`.

### 11.8 Overlays

All floating surfaces share: `rounded-lg border border-hairline bg-bg
shadow-lg`, `z-50` (toasts `z-[100]`). All `<dialog>` surfaces use
`backdrop:bg-text/30 backdrop:backdrop-blur-[1px]` and `shadow-2xl`.

#### Modal

```
m-auto w-[calc(100%-2rem)] rounded-xl border border-hairline bg-bg p-0 text-text
shadow-2xl backdrop:bg-text/30 backdrop:backdrop-blur-[1px] {sizes[size]}
```

Header `flex items-start gap-4 px-6 pt-5 pb-3` (**no rule under it**); title
`font-heading text-base font-semibold text-text`; description
`font-sans text-[13px] text-text-muted`; close `-m-1 rounded-md p-1
text-text-muted hover:bg-bg-inset … focus-visible:outline-brand`, glyph `size-4`.
Body `px-6 pb-5 font-sans text-sm leading-relaxed text-text-secondary` with
`pt-2` when there is a header, else `pt-5`.
Footer `flex items-center justify-end gap-2 rounded-b-xl border-t border-hairline
bg-bg-alt px-6 py-4`.

#### Drawer

Same dialog treatment (`shadow-2xl`, blurred backdrop) plus side classes and the
slide animation. Header `flex items-start gap-4 border-b border-hairline px-5
py-4`; body `flex-1 overflow-y-auto px-5 py-4 font-sans text-sm`; footer
`flex items-center justify-end gap-2 border-t border-hairline bg-bg-alt px-5 py-3.5`.

#### ConfirmDialog

Built on Modal. Icon medallion `flex size-10 shrink-0 items-center justify-center
rounded-full` + `toneSoft`, glyph `size-5`. Title `font-heading text-base
font-semibold`; body `text-[13px] leading-relaxed text-text-secondary`.

#### CommandPalette

Dialog `mx-auto mt-[12vh] mb-auto w-[min(36rem,calc(100vw-2rem))] max-w-none
rounded-xl border border-hairline bg-bg p-0 text-text shadow-2xl`.
Search row `flex items-center gap-3 border-b border-hairline px-4`, input
`h-12 … text-sm`. List `max-h-80 overflow-y-auto py-1`. Group label
`px-4 pt-3 pb-1 text-[11px] font-semibold text-text-muted`. Item
`mx-2 rounded-md px-2.5 py-2 font-sans text-sm`, active → `toneSoft`.
Shortcut hint `text-[11px] text-text-muted`.

#### Dropdown / ContextMenu

`z-50 flex max-h-[min(24rem,80vh)] min-w-48 flex-col overflow-y-auto rounded-lg
border border-hairline bg-bg py-1 font-sans shadow-lg`.

#### MenuItem / MenuSeparator

Item `mx-1 flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-sm
transition-colors duration-100 ease-brand-out focus:outline-none` — **inset by
`mx-1` so the rounded highlight floats inside the menu.**
`neutral` tone → `text-text-secondary hover:bg-bg-inset focus-visible:bg-bg-inset`;
any other tone → `toneText` + `toneSoftHover`.
Trailing hint `text-[11px] text-text-muted`.
Separator `my-1 h-px bg-hairline`; section label `mt-1 px-3 pt-2 pb-1 font-sans
text-[11px] font-semibold text-text-muted`.

#### Popover

`z-50 flex max-w-xs flex-col gap-2 rounded-lg border border-hairline bg-bg p-4
font-sans shadow-lg`; title `font-heading text-sm font-semibold text-text`.

#### Tooltip

```
pointer-events-none invisible absolute z-50 rounded-md bg-text px-2 py-1
font-sans text-xs font-medium whitespace-nowrap text-text-inverse opacity-0
shadow-lg transition-opacity duration-150 ease-brand-out
```

Shown on `group-hover/tt` and `group-focus-within/tt`. Offset **1.5**
(`mb-1.5` / `mt-1.5` / `mr-1.5` / `ml-1.5`). No arrow.

#### ThemeToggle

Segmented form: `inline-flex items-center gap-1 rounded-lg border
border-hairline bg-bg-inset p-1`; option `inline-flex h-8 items-center gap-1.5
rounded-md px-2.5 font-sans text-[13px] font-medium`, active →
`bg-bg text-text shadow-xs`.
Icon-only form: `inline-flex size-9 items-center justify-center rounded-md
border border-hairline bg-bg text-text-secondary shadow-xs hover:bg-bg-alt
hover:text-text`.

---

## 12. Rules for AI

**Hard invariants — never break these:**

1. Radius follows the scale in §5.1. Do not invent arbitrary radii
   (`rounded-[14px]`) and do not leave a corner sharp.
2. Shadow follows the scale in §5.3. `shadow-xs` = resting, `shadow-lg` =
   floating, `shadow-2xl` = dialog. Never stack two shadows, never use a
   coloured shadow.
3. No `font-mono` anywhere. Use `tabular-nums` for figures instead.
4. No `uppercase`, no `tracking-wide` on labels. Micro-labels are
   `text-[11px]`/`text-[13px] font-semibold text-text-muted`.
5. No `dark:` variants. Colour comes from tokens only.
6. No raw hex, no Tailwind palette colours. Only token utilities: `bg-bg`,
   `bg-bg-alt`, `bg-bg-inset`, `border-hairline`, `border-hairline-strong`,
   `text-text`, `text-text-secondary`, `text-text-muted`, `text-text-inverse`,
   and the eight tones.
7. No interpolated class names (`bg-${tone}`). Read `core/tones.ts` maps.
8. Headings are `font-heading` at `font-semibold`; body is `font-sans`.
9. Base body size is `text-sm`; secondary is `text-[13px]`; micro is
   `text-[11px]`.
10. Interactive control borders are `border-hairline-strong`; container borders
    are `border-hairline`.
11. Every focusable element carries `{focusRing} {toneRing[tone]}` (or the
    `peer-` pair for `sr-only` inputs).
12. Default `tone` is `'brand'`; default `size` is `'md'`; default `variant`
    is the first listed in its union.
13. Transitions are `duration-150 ease-brand-out` (rows/menus `duration-100`,
    transforms `duration-200`). Hover raises the **shadow**, never the position.
14. Icon boxes come from `./icon.js` (`iconSm|Md|Lg|Xl`).
15. Inline SVG strokes: `stroke-linecap="round"`.

**When adding a new paper component:**

- Copy the geometry of the nearest existing component in this document.
- Ask: _how big is it?_ → picks the radius. _How far off the page is it?_ →
  picks the shadow. _Is it a control or a container?_ → picks the border colour.
- Keep the prop surface identical to `matte` and `sprout`. The promise of the
  library is: pick a look, get the same component. `src/lib/styles/parity.test.ts`
  enforces this.
- Put any style-local class-string helper in the style folder (like `icon.ts`),
  never in `core/` — Tailwind only scans the style folder the app installed.
