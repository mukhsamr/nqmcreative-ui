# matte — design specification

> Authoritative style rules for `@nqmcreative/ui/matte`.
> Written for AI agents and contributors: **every value below is what the code
> actually ships.** When adding or editing a matte component, match these rules
> exactly. If a rule here conflicts with your instinct, the rule wins.

Source of truth: `src/lib/styles/matte/`. Behaviour (not looks) lives in
`src/lib/core/` and is shared by all three styles.

---

## 1. Identity

**Flat and sharp-cornered.** No radius, no shadow, no gloss. Hairline rules and
mono micro-labels do the work that borders and elevation do elsewhere.

The three laws, in order of importance:

1. **No `border-radius`.** The only exception is `rounded-full` on things that
   are conceptually pills or discs (badge, avatar, switch, spinner, step marker,
   chips, dots, icon-circles).
2. **No `box-shadow`. Ever.** There is not a single `shadow-*` utility in the
   whole style. Depth is expressed by a `border-hairline` and by surface swaps
   (`bg-bg` → `bg-bg-alt` → `bg-bg-inset`).
3. **Micro-labels are mono, uppercase, tracked.** Eyebrows, table headers,
   sidebar section labels, footer column headings, badges, counts, byte sizes,
   dates and keyboard hints all use `font-mono` — usually `uppercase
tracking-wide` and `text-text-muted`.

Everything else follows from those.

---

## 2. Wiring

```css
/* src/app.css */
@import 'tailwindcss';
@import '@nqmcreative/ui/matte/theme.css';
@import '@nqmcreative/ui/matte/fonts.css'; /* optional */

@source '../node_modules/@nqmcreative/ui/dist/styles/matte';
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
| `--color-bg`              | `#ffffff` | `#0f172a` |
| `--color-bg-alt`          | `#f8fafc` | `#16203a` |
| `--color-bg-inset`        | `#f1f5f9` | `#1e293b` |
| `--color-hairline`        | `#e5e7eb` | `#1e293b` |
| `--color-hairline-strong` | `#cbd5e1` | `#334155` |

### 3.2 Text

| token                    | light     | dark      |
| ------------------------ | --------- | --------- |
| `--color-text`           | `#0f172a` | `#f1f5f9` |
| `--color-text-secondary` | `#475569` | `#cbd5e1` |
| `--color-text-muted`     | `#64748b` | `#94a3b8` |
| `--color-text-inverse`   | `#ffffff` | `#0f172a` |

### 3.3 Tones

| tone                 | base (L)  | hover (L) | light (L) | border (L) | base (D)  | hover (D) | light (D) | border (D) |
| -------------------- | --------- | --------- | --------- | ---------- | --------- | --------- | --------- | ---------- |
| `brand` (teal green) | `#1c6358` | `#155047` | `#e8f3f1` | `#a8ccc5`  | `#3f9585` | `#55ab9a` | `#10302b` | `#235047`  |
| `accent` (copper)    | `#c2410c` | `#9a3412` | `#fdf1e9` | `#f0c5a8`  | `#ea7d4b` | `#f59564` | `#3a1d0e` | `#6b3417`  |
| `violet`             | `#6d28d9` | `#5b21b6` | `#f3edfd` | `#cfbdf5`  | `#a78bfa` | `#bda5fb` | `#241a3d` | `#40306b`  |
| `info` (blue)        | `#1d4ed8` | `#1e40af` | `#eaf0fd` | `#b8caf7`  | `#6b9bf7` | `#8fb4f9` | `#14213f` | `#26406e`  |
| `success` (green)    | `#15803d` | `#166534` | `#e9f6ed` | `#a8d9b8`  | `#46a06a` | `#5cb47e` | `#10281a` | `#23492f`  |
| `warning` (amber)    | `#b45309` | `#92400e` | `#fdf4e6` | `#f0d3a3`  | `#d99b3f` | `#e8ae55` | `#33240c` | `#5c421a`  |
| `danger` (red)       | `#b91c1c` | `#991b1b` | `#fdecec` | `#f2b9b9`  | `#ef6b6b` | `#f38585` | `#3a1616` | `#6b2626`  |
| `neutral` (slate)    | `#475569` | `#334155` | `#f1f5f9` | `#cbd5e1`  | `#94a3b8` | `#cbd5e1` | `#1e293b` | `#334155`  |

`brand` is the default `tone` for every component that has one.

### 3.4 Type tokens

```css
--font-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-heading: 'Sora', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace;
```

`fonts.css` ships Sora 400/500/600 and Work Sans 400/500 and JetBrains Mono
400/500, latin + latin-ext, as `@font-face` rules (never `@import`).

### 3.5 Motion tokens

```css
--ease-brand: cubic-bezier(0.16, 1, 0.3, 1); /* long, decelerating */
--ease-brand-out: cubic-bezier(0.25, 1, 0.5, 1); /* the default for UI */
```

### 3.6 Dark mode

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Two ways in, and they cooperate: `class="dark"` on `<html>` wins outright;
otherwise the OS preference applies unless `<html>` says `class="light"`.

**Components must never write `dark:` classes.** All colour comes from tokens,
so dark mode follows automatically. A `dark:` utility would only know about the
class path and would be wrong half the time.

---

## 4. Typography

| role                                             | classes                                                                      |
| ------------------------------------------------ | ---------------------------------------------------------------------------- |
| Page / section heading                           | `font-heading text-3xl font-medium tracking-tight text-balance`              |
| Hero heading                                     | `font-heading text-4xl leading-tight font-medium tracking-tight sm:text-5xl` |
| Card / dialog title                              | `font-heading text-lg font-medium tracking-tight text-text`                  |
| Small title (empty state, popover, feature card) | `font-heading text-base font-medium` / `text-sm font-medium`                 |
| Stat / price value                               | `font-heading text-3xl font-medium tracking-tight` (price `text-4xl`)        |
| Body                                             | `font-sans text-[15px] leading-relaxed text-text-secondary`                  |
| Small body / description                         | `font-sans text-sm leading-relaxed text-text-secondary`                      |
| Label                                            | `font-sans text-sm font-medium text-text`                                    |
| Help / error                                     | `font-sans text-sm text-text-muted` / `text-danger`                          |
| **Eyebrow / micro-label**                        | `font-mono text-xs tracking-wide text-text-muted uppercase`                  |
| **Tiny micro-label**                             | `font-mono text-[10px] tracking-wide text-text-muted uppercase`              |
| Meta / counts / hints                            | `font-mono text-[11px] text-text-muted`                                      |

Heading weight in matte is **`font-medium` (500)** — never `font-semibold`.
Sora at 500 is already emphatic; 600 reads as shouting in a flat style.

**Base body size is 15px (`text-[15px]`)**, not 14. Matte runs one notch larger
than the other two styles because there is no shadow or radius to carry
hierarchy — size does it.

---

## 5. Geometry

### 5.1 Radius

| what                                                                                                                                               | radius                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Everything with corners                                                                                                                            | **none**                        |
| Badge, chips (MultiSelect/TagsInput), pill tabs, avatar, switch track + thumb, radio dot, spinner, step marker, icon circles, pricing ribbon, dots | `rounded-full`                  |
| `InputGroup` children                                                                                                                              | `rounded-none` (explicit reset) |

There is no `rounded-sm/md/lg/xl` anywhere in matte. Do not introduce one.

### 5.2 Borders

- Default hairline: `border border-hairline` (1px).
- Interactive control resting border: `border-hairline`; the _strong_ variant
  `border-hairline-strong` is used for unchecked checkbox/radio boxes, PIN
  separators, dashed dropzones and step "todo" markers.
- Accent stripe (Card `accent`, Alert `accent`, Testimonial `accent`):
  **`border-l-2`** + `toneBorderLeft[tone]` / `toneBorder[tone]`.
- Featured PricingCard: `border-2` + `toneBorder[tone]`.
- Tab underline: `border-b-2`.
- Kbd: `border border-b-2 border-hairline-strong` (the one "3D" trick in matte —
  a thicker bottom rule, not a shadow).
- Dashed: `border border-dashed border-hairline-strong` (Dropzone, EmptyState).
  1px, not 2px.

### 5.3 Elevation

There is none. Overlays are separated from the page by:

- a `border border-hairline` on the surface,
- `bg-bg` against `bg-bg-alt`/`bg-bg-inset` neighbours,
- `backdrop:bg-text/40` for `<dialog>` (no `backdrop-blur`).

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
  `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current`
  so the ring picks up the icon's own colour.
- Text inputs use `focus:outline-none` on the `<input>` and colour the wrapper
  border instead: `toneFocusBorder[tone]` (bare control) or
  `toneFocusWithinBorder[tone]` (wrapped control).
- Invalid state: `border-danger` (and `focus-within:border-danger` on wrappers).
  It always wins over the tone border.
- Disabled: `disabled:opacity-50 disabled:pointer-events-none` for controls;
  `pointer-events-none opacity-50` on wrappers; `opacity-40` for menu/list rows
  and pagination cells.
- Hover on flat rows is a **surface swap** (`hover:bg-bg-inset`), never a shadow.

---

## 7. Motion

- Standard transition: `transition-colors duration-150 ease-brand-out`.
- Buttons and tabs: `transition-all duration-150 ease-brand-out`.
- List rows and menu items: `duration-100`.
- Chevrons / carets: `transition-transform duration-200 ease-brand-out`.
- Sidebar width, Progress fill: `transition-[width] duration-200/300`.
- Drawer: `animate-[drawer-<side>_220ms_cubic-bezier(0.16,1,0.3,1)]`, with
  global keyframes declared inside `Drawer.svelte` and a
  `@media (prefers-reduced-motion: reduce) { dialog { animation: none } }` guard.
- Nothing translates, scales or lifts on hover except the ColorInput swatch
  (`hover:-translate-y-0.5`).

---

## 8. Icons

Consumer-supplied snippets; the component sizes the box (`src/lib/styles/matte/icon.ts`):

| export   | size | use                                             |
| -------- | ---- | ----------------------------------------------- |
| `iconSm` | 14px | menu rows, chips, links, one line of small text |
| `iconMd` | 16px | default: buttons, nav items, tabs, list rows    |
| `iconLg` | 20px | headers, stats, beside a heading                |
| `iconXl` | 24px | dialog and empty-state marks                    |

Each is `grid size-N shrink-0 place-items-center *:size-N` — the `*:` variant
sizes the snippet's own element.

Inline SVGs drawn by the library use `stroke-width="1.5"` and
**`stroke-linecap="square"`** (matte's corner rule applies to strokes too).

---

## 9. Control size scale

| component               | sm                                                                                                                   | md                                                       | lg                      | xl                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------- | --------------------- |
| Button                  | `h-8 px-3.5 text-[13px]`                                                                                             | `h-10 px-5 text-[15px]`                                  | `h-11 px-6 text-base`   | `h-12 px-8 text-base` |
| Button (icon-only)      | `size-8`                                                                                                             | `size-10`                                                | `size-11`               | `size-12`             |
| Input / FileInput       | `h-8 text-[13px]`                                                                                                    | `h-10 text-[15px]`                                       | `h-11 text-base`        | —                     |
| InputAddon              | `h-8 px-2.5 text-[13px]`                                                                                             | `h-10 px-3.5 text-[15px]`                                | `h-11 px-3.5 text-base` | —                     |
| FileInput button        | `h-6 px-2 text-[11px]`                                                                                               | `h-7 px-2.5 text-xs`                                     | `h-8 px-3 text-xs`      | —                     |
| SegmentedControl        | `h-8 px-3 text-[13px]`                                                                                               | `h-9 px-3.5 text-sm`                                     | —                       | —                     |
| SegmentedControl (icon) | `size-8`                                                                                                             | `size-9`                                                 | —                       | —                     |
| Avatar                  | `xs size-6 text-[10px]` · `sm size-8 text-xs` · `md size-10 text-sm` · `lg size-12 text-base` · `xl size-16 text-lg` |
| Progress                | `h-1`                                                                                                                | `h-2`                                                    | `h-3`                   | —                     |
| Spinner                 | `xs size-3 border` · `sm size-4 border` · `md size-5 border-2` · `lg size-8 border-2`                                |
| Switch                  | track `h-5 w-9`, thumb `size-4`, travel `translate-x-4`                                                              | track `h-6 w-11`, thumb `size-5`, travel `translate-x-5` | —                       | —                     |
| Badge                   | `px-2.5 py-0.5 text-[10px]`                                                                                          | `px-3 py-1 text-xs`                                      | —                       | —                     |
| Modal                   | `max-w-sm`                                                                                                           | `max-w-lg`                                               | `max-w-2xl`             | —                     |
| Drawer (horizontal)     | `w-[min(20rem,100vw)]`                                                                                               | `w-[min(28rem,100vw)]`                                   | `w-[min(40rem,100vw)]`  | `full: w-screen`      |
| Drawer (vertical)       | `h-[min(16rem,100vh)]`                                                                                               | `h-[min(24rem,100vh)]`                                   | `h-[min(36rem,100vh)]`  | `full: h-screen`      |

Fixed sizes used elsewhere: PinInput cell `size-11`; Pagination cell
`h-9 min-w-9`; Kbd `h-6 min-w-6`; Steps marker `size-7`; Checkbox/Radio box
`size-[18px]`; Navbar/Sidebar header `h-16`; Sidebar `w-60` (collapsed `w-16`).

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
base: inline-flex items-center justify-center gap-2 border font-sans font-medium
      whitespace-nowrap transition-all duration-150 ease-brand-out
      disabled:opacity-50 disabled:pointer-events-none
      aria-disabled:opacity-50 aria-disabled:pointer-events-none
```

No radius. No shadow. Sizes per §9.

| variant           | classes                                                                                                                                       |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `solid`/`primary` | `border-transparent` + `toneSolid` + `toneSolidHover`                                                                                         |
| `soft`            | `border-transparent` + `toneSoft` + `toneSoftHover`                                                                                           |
| `outline`         | `bg-transparent` + `toneText` + `toneBorder` + `toneSolidHover hover:text-text-inverse` — **matte's outline flips to a solid fill on hover.** |
| `ghost`           | `border-transparent bg-transparent` + `toneText` + `toneSoftHover`                                                                            |
| `link`            | `border-transparent` + `toneText` + `h-auto p-0 text-sm hover:gap-3` — **no underline; the gap widens instead.**                              |

Spinner replaces the leading icon while busy (`size sm → xs`, else `sm`).
`aria-busy` is set; an async `onclick` returning a promise auto-locks the button.

#### Link

```
inline-flex items-center gap-1 font-sans transition-colors duration-150 ease-brand-out
{muted ? 'text-text-secondary' + toneHoverText : toneText}
{focusRing} {toneRing}
```

Underline: `always` → `underline underline-offset-4`; `hover` (default) →
`hover:underline underline-offset-4`; `none` → nothing.
External marker: `<span class="text-[0.85em]">↗</span>`. Icons use `iconSm`.

### 11.2 Forms

#### Input (wrapper pattern)

```
inline-flex w-full items-center gap-2 border bg-bg px-3.5
transition-colors duration-150 ease-brand-out
{sizes[size]}
{invalid ? 'border-danger focus-within:border-danger'
         : 'border-hairline ' + toneFocusWithinBorder[tone]}
{disabled ? 'pointer-events-none opacity-50' : ''}
```

Inner `<input>`: `w-full min-w-0 bg-transparent font-sans text-text
placeholder:text-text-muted focus:outline-none`. Leading/trailing icons:
`shrink-0 text-text-muted`.

#### Textarea

`w-full border bg-bg px-3.5 py-2.5 font-sans text-[15px] text-text` +
`placeholder:text-text-muted focus:outline-none`, `resize-y` (or
`resize-none overflow-hidden` when `autoresize`).

#### Select

`h-10 w-full appearance-none border bg-bg py-0 pr-10 pl-3.5 font-sans text-[15px]`;
chevron `pointer-events-none absolute right-4 size-4 text-text-muted`.

#### InputGroup / InputAddon

Group: `flex w-full items-stretch [&>*]:min-w-0 [&>*]:rounded-none
[&>*:focus-within]:relative [&>*:focus-within]:z-10 [&>*:not(:first-child)]:-ml-px`.
**No end rounding** — matte has no corners to round.
Addon: `inline-flex shrink-0 items-center gap-1.5 border border-hairline font-mono
whitespace-nowrap text-text-secondary`; `muted` → `bg-bg-alt`, else `bg-bg`.

#### Checkbox / Radio

Wrapper `group inline-flex items-start gap-3 font-sans text-[15px]`.
Real input is `peer sr-only`. Visual box:

```
mt-0.5 flex size-[18px] shrink-0 items-center justify-center
border border-hairline-strong bg-bg transition-colors duration-150 ease-brand-out
{tonePeerChecked} {peerFocusRing} {tonePeerFocus}
```

Checkbox box is **square** (no radius); Radio adds `rounded-full` and a
`size-1.5 rounded-full bg-text-inverse` dot.
Indeterminate bar: `h-px w-2.5 bg-text-muted` (a hairline, not a rounded bar).
Tick: `size-3 text-text-inverse opacity-0 … group-has-[:checked]:opacity-100`.
Description: `text-sm leading-snug text-text-muted`.

#### CheckboxGroup / RadioGroup

`fieldset` = `flex flex-col gap-3 border-0 p-0`; legend
`mb-1 font-sans text-sm font-medium text-text`, required marker
`<span class="text-danger">*</span>`. Options `flex gap-3`.
Boxed option:

```
flex flex-1 cursor-pointer items-start gap-3 border p-4
transition-colors duration-150 ease-brand-out
{selected ? 'border-text bg-bg-alt' : 'border-hairline hover:border-hairline-strong'}
```

Selection is shown by a **`border-text` + `bg-bg-alt`** swap, not by tone.

#### Switch

Track `relative mt-0.5 inline-flex shrink-0 items-center rounded-full p-0.5
transition-colors duration-200 ease-brand-out`; on → `toneFill`, off →
`bg-hairline-strong`. Thumb `rounded-full bg-bg` (no shadow).

#### Slider

Track `h-1` **square** with
`bg-[linear-gradient(to_right,currentColor_var(--pct),var(--color-bg-inset)_var(--pct))]`;
thumb `size-4 rounded-full border-2 border-bg bg-current` (no shadow).
Focus ring uses `focus-visible:outline-offset-4`.
Value readout: `font-mono text-xs tabular-nums` in the tone colour.
Min/max row: `font-mono text-[11px] text-text-muted`.

#### Field / Label

Field `flex w-full flex-col gap-2`; label `font-sans text-sm font-medium text-text`;
error/help `font-sans text-sm text-danger` / `text-text-muted`.

#### SegmentedControl

Container `inline-flex items-center border border-hairline bg-bg-alt p-1`.
Item `inline-flex items-center justify-center font-sans whitespace-nowrap
transition-colors duration-150 ease-brand-out`; active → `toneSoft` +
`font-medium`; inactive → `text-text-secondary hover:text-text`.

#### PinInput

Cell `size-11 border bg-bg text-center font-mono text-base text-text`;
separator `h-px w-2 bg-hairline-strong`.

#### TagsInput / MultiSelect

Wrapper `flex w-full flex-wrap items-center gap-1.5 border bg-bg py-1.5 …`.
Chip: `inline-flex items-center gap-1.5 rounded-full py-1 pr-1 pl-2.5
font-mono text-xs` + `toneSoft`. Remove button `size-4 rounded-full
hover:bg-bg`, glyph `size-2.5`.
Inner input: TagsInput `h-7`, MultiSelect `h-8 min-w-24 px-1`, `text-[15px]`.
MultiSelect option check box is a **square** `size-4 border`.

#### Combobox / DatePicker / SearchInput / TimeInput / CurrencyInput / ColorInput / FileInput

- Combobox wrapper `pr-2 pl-3.5`, inner input `h-10 text-[15px]`;
  listbox `z-50 max-h-64 overflow-y-auto border border-hairline bg-bg py-1 font-sans`
  (no radius, no shadow); group label `px-3 pt-2 pb-1 font-mono text-[10px]
tracking-wide text-text-muted uppercase`; option `px-3 py-2 text-[14px]`,
  active → `toneSoft`.
- DatePicker wrapper `pr-1 pl-3.5`, input `tabular-nums`; popup
  `z-50 border border-hairline bg-bg`.
- CurrencyInput addon: `font-mono text-xs tracking-wide`.
- ColorInput preview `relative grid size-5 place-items-center border border-hairline`;
  swatch buttons `size-6 border` + `hover:-translate-y-0.5`; selected swatch
  `border-text`. Hex field is `font-mono uppercase`.
- TimeInput steppers `grid size-6 place-items-center` (square).
- FileInput row `pr-1 pl-1`; the "choose" button is
  `border border-hairline bg-bg-alt font-mono tracking-wide text-text-secondary`.
  File list: `flex flex-col border border-hairline`, rows
  `border-b border-hairline px-3.5 py-2.5 … last:border-b-0`, size in
  `font-mono text-xs text-text-muted`.

#### Dropzone

```
flex w-full flex-col items-center gap-3 border border-dashed px-6 py-10
text-center font-sans transition-colors duration-150 ease-brand-out
{dragging ? toneBorder + toneSurface : 'border-hairline-strong bg-bg hover:bg-bg-alt'}
```

Icon medallion `flex size-12 items-center justify-center rounded-full` + `toneSoft`.
Hint line `font-mono text-xs text-text-muted`.

#### Calendar

`flex w-[17.5rem] flex-col gap-3 p-3 font-sans`.
Nav buttons `inline-flex size-8 items-center justify-center` (square) with
`hover:bg-bg-inset`. Weekday row `grid grid-cols-7 gap-px`, cells
`pb-1 text-center font-mono text-[10px] text-text-muted uppercase`.
Day cell `flex h-9 items-center justify-center font-mono text-[13px] tabular-nums`;
selected → `toneFill + font-medium text-text-inverse`; today (unselected) →
`toneText + font-medium`; outside month → `text-text-muted/60`.

### 11.3 Data display

#### Badge

```
inline-flex items-center gap-1.5 rounded-full font-mono font-medium tracking-wide
```

Variants: `soft` → `toneSoft`; `solid` → `toneSolid`; `outline` →
`border {toneBorderSoft} {toneText} bg-bg`. Dot: `size-1.5 shrink-0 rounded-full`.

#### Avatar

`inline-flex shrink-0 items-center justify-center overflow-hidden font-mono
font-medium select-none`; `squared` → **no radius** (`''`), otherwise
`rounded-full`. Image `size-full object-cover`. Fallback surface `toneSoft`,
image surface `bg-bg-inset`.
AvatarGroup: `flex items-center *:-ml-2 *:ring-2 *:ring-bg
[&>*:first-child]:ml-0`.

#### Card

Container `flex flex-col` + variant:

| variant   | classes                                     |
| --------- | ------------------------------------------- |
| `outline` | `border border-hairline bg-bg`              |
| `filled`  | `border border-hairline bg-bg-alt`          |
| `tinted`  | `border border-transparent` + `toneSurface` |

`accent` → `border-l-2` + `toneBorderLeft`.
`interactive` → `transition-colors duration-150 ease-brand-out` + `toneHoverBorder`
(border colour only — no lift, no shadow).
Header `px-5 pt-5`, eyebrow `font-mono text-xs tracking-wide text-text-muted
uppercase`, title `font-heading text-lg font-medium text-text`.
Body `px-5 pt-3.5 pb-5` (or `p-5` with no header). Footer `border-t
border-hairline px-5 py-3.5`, no background tint.

#### Stat

Label `flex items-center gap-2 font-mono text-xs tracking-wide text-text-muted
uppercase`; value `font-heading text-3xl font-medium tracking-tight`;
delta `font-mono text-xs` in the trend tone; caption `text-sm text-text-muted`.

#### Table

Shell `flex w-full flex-col overflow-hidden border border-hairline`.
Toolbar / bulk bar `border-b border-hairline bg-bg-inset px-3.5 py-2.5`, count
`font-mono text-xs font-medium tracking-wide text-text uppercase`.
Caption row `border-b border-hairline px-3.5 py-2.5 font-sans text-sm text-text-muted`.
`<table>` = `w-full border-collapse font-sans text-[15px]`.
Head row `border-b border-hairline bg-bg-alt`; sticky variant adds
`sticky top-0 z-10`.
`<th>` = `font-mono text-xs font-medium tracking-wide text-text-muted uppercase`
plus `pad`. Sort trigger adds `inline-flex items-center gap-1.5 uppercase`,
caret `text-[9px] leading-none`.
Cell padding `pad` = `px-3.5 py-2.5`, compact `px-3.5 py-1.5`.
Row `border-b border-hairline last:border-b-0`; selected `bg-bg-inset`;
striped odd `bg-bg-alt`; hoverable `hover:bg-bg-inset`.
Selection column `w-10`. Empty cell `px-3.5 py-10 text-center text-sm text-text-muted`.
Footer bar `border-t border-hairline px-3.5 py-2.5 font-sans text-sm text-text-secondary`.

#### Kbd

```
inline-flex h-6 min-w-6 items-center justify-center
border border-b-2 border-hairline-strong bg-bg-alt px-1.5
font-mono text-[11px] text-text-secondary
```

### 11.4 Feedback

#### Alert

`flex items-start gap-3 p-4 font-sans` + variant:

| variant   | classes                                     |
| --------- | ------------------------------------------- |
| `soft`    | `toneSurface` + `border` + `toneBorderSoft` |
| `outline` | `bg-bg border` + `toneBorderSoft`           |
| `accent`  | `toneSurface` + `border-l-2` + `toneBorder` |

Title `text-[15px] leading-snug font-medium` in `toneText`; body
`text-sm leading-relaxed text-text-secondary`; icon `mt-0.5 shrink-0` in `toneText`.
`role` is `alert` for `danger`, otherwise `status`.

#### Toaster

Region `pointer-events-none fixed z-[100] flex w-[min(24rem,calc(100vw-2rem))]
flex-col gap-3` + position (`top-4 left-4 items-start` … `bottom-4 right-4 items-end`).
Toast `pointer-events-auto flex w-full items-start gap-3 border p-4 font-sans`

- `toneSurface[tone]` + `toneBorderSoft[tone]` — **matte tints the whole toast**.
  Title `text-[15px] leading-snug font-medium` in `toneText`.
  Action `mt-1 self-start font-sans text-sm font-medium underline underline-offset-4`.

#### Progress

Track `w-full overflow-hidden bg-bg-inset` (square, `h-1|2|3`); fill
`h-full transition-[width] duration-300 ease-brand` + `toneFill`;
indeterminate adds `w-1/3 animate-pulse`. Value label `font-mono text-xs text-text-muted`.

#### Spinner

`inline-block shrink-0 animate-spin rounded-full border-current border-t-transparent`
— a hard gap, not a faded ring.

#### Skeleton

`animate-pulse bg-bg-inset`; `text` `h-4 w-full`, `block` `h-24 w-full`,
`circle` `size-10 rounded-full`. Multi-line: last line `w-2/3`, gap `gap-2`.
**No radius on text/block.**

#### EmptyState

`flex flex-col items-center gap-4 px-6 py-12 text-center font-sans`;
bordered → `border border-dashed border-hairline-strong` (no background tint).
Medallion `size-12 rounded-full` + `toneSoft`; title `font-heading text-base font-medium`.

### 11.5 Layout & navigation

#### Divider

Horizontal `h-px w-full bg-hairline`; vertical `w-px self-stretch bg-hairline`;
labelled `flex items-center gap-4` with rules `h-px flex-1 bg-hairline` and the
label `font-mono text-xs tracking-wide text-text-muted uppercase`.

#### Tabs

List: `underline` → `gap-6 border-b border-hairline`; `pill` → `gap-2`;
`panel` → `gap-0 border border-hairline bg-bg-alt p-1`.
Item base `inline-flex items-center justify-center gap-2 font-sans text-[15px]
whitespace-nowrap transition-all duration-150 ease-brand-out`.

| variant     | item                     | active                                |
| ----------- | ------------------------ | ------------------------------------- |
| `underline` | `-mb-px border-b-2 pb-3` | `toneBorder + toneText + font-medium` |
| `pill`      | `h-9 rounded-full px-4`  | `toneSoft + font-medium`              |
| `panel`     | `h-9 px-4`               | `bg-bg font-medium text-text`         |

Count badge: `font-mono text-[11px] text-text-muted` (bare, no pill).

#### Accordion

Container `flex flex-col border-t border-hairline` (**open list, not a card**).
Item `group border-b border-hairline`. Summary
`flex cursor-pointer list-none items-center gap-4 py-4 font-sans text-[15px]
text-text … hover:text-text-secondary` and hides the native marker.
Marker rotates **45°** (`group-open:rotate-45` — a plus turning into a cross),
`size-4` in `toneText`. Meta `font-mono text-xs text-text-muted`.
Content `pb-5 font-sans text-[15px] leading-relaxed text-text-secondary`.

#### Breadcrumb

`font-sans text-sm`; trail `flex flex-wrap items-center gap-2`; separator
`text-text-muted select-none`; link `inline-flex items-center gap-1.5
text-text-secondary` + `toneHoverText` (no background, no padding);
current `text-text`.

#### Pagination

Cell `inline-flex h-9 min-w-9 items-center justify-center px-2 font-mono
text-[13px] transition-colors duration-150 ease-brand-out` + `focusRing`.
Current page → `toneSolid`; others → `text-text-secondary hover:bg-bg-inset`;
ellipsis → `text-text-muted`. Prev/next glyphs are `←` / `→` characters.

#### Steps

Marker `flex size-7 shrink-0 items-center justify-center rounded-full border
font-mono text-[11px]`:

| state     | classes                                         |
| --------- | ----------------------------------------------- |
| `error`   | `border-danger bg-danger-light text-danger`     |
| `done`    | `toneFill border-transparent text-text-inverse` |
| `current` | `border-current bg-bg` + `toneText`             |
| `todo`    | `border-hairline-strong bg-bg text-text-muted`  |

Connector `h-px` (horizontal, `mx-3 flex-1`) or `w-px` (vertical, `my-1 flex-1`);
filled with `toneFill`, else `bg-hairline`. Title `font-sans text-sm leading-snug`.

### 11.6 App shell

#### Navbar

Header `w-full bg-bg`, `sticky top-0 z-40` when sticky, `border-b border-hairline`
when bordered. Nav `mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6`.
Desktop list `hidden flex-1 items-center gap-6 md:flex`.
Link base: `inline-flex items-center gap-2 font-sans text-[15px]
transition-colors duration-150 ease-brand-out` — **no padding, no background**;
active → `toneText`, inactive → `text-text-secondary hover:text-text`.
Badge `font-mono text-[11px] text-text-muted`.
Mobile trigger `inline-flex size-9 items-center justify-center
text-text-secondary hover:text-text md:hidden` (no hover surface).
Mobile drawer rows `flex items-center justify-between gap-3 py-3 font-sans
text-[15px]`, separated by `border-b border-hairline last:border-b-0`.

#### Sidebar

Shell `flex shrink-0 flex-col transition-[width] duration-200 ease-brand-out`,
`w-60` (`w-16` collapsed).

| variant    | classes                                                  |
| ---------- | -------------------------------------------------------- |
| `plain`    | `h-full bg-transparent`                                  |
| `filled`   | `h-full border-r border-hairline bg-bg`                  |
| `floating` | `m-3 h-[calc(100%-1.5rem)] border border-hairline bg-bg` |

Header `flex h-16 shrink-0 items-center gap-3 border-b border-hairline px-3`.
Body `flex-1 overflow-y-auto py-3`.
Row base `flex w-full items-center gap-3 px-3 py-2 text-left font-sans text-sm`
(square). Active → `toneSoft + font-medium`; inactive →
`text-text-secondary hover:bg-bg-inset hover:text-text`.
Section label `px-3 pb-1 font-mono text-[10px] tracking-wide text-text-muted uppercase`.
Nested list `ml-5 … border-l border-hairline pl-1`.
Footer `border-t border-hairline p-3`; collapse toggle `h-8 … font-sans text-xs`.

#### Footer

`w-full border-t border-hairline bg-bg`; inner `mx-auto flex w-full max-w-6xl
flex-col gap-12 px-6 py-14`. Column heading `font-mono text-[10px] tracking-wide
text-text-muted uppercase`; links `font-sans text-sm text-text-secondary` +
`toneHoverText`; bottom bar `border-t border-hairline pt-6` with
`font-mono text-xs text-text-muted`.

### 11.7 Marketing

#### HeroSection

Section `w-full px-6 py-20 sm:py-28`; inner `mx-auto … max-w-6xl gap-16`.
Eyebrow: `font-mono text-xs tracking-wide uppercase` + `toneText` —
**a mono line, not a pill.**
Heading `max-w-2xl font-heading text-4xl leading-tight font-medium tracking-tight
text-balance text-text sm:text-5xl`.
Lede `max-w-xl font-sans text-lg leading-relaxed text-pretty text-text-secondary`.

#### FeatureGrid / FeatureCard

Section `w-full px-6 py-20`; header stack `gap-12`; eyebrow `font-mono text-xs
tracking-wide uppercase`. Grid: bordered → `gap-px border border-hairline
bg-hairline` (hairline mortar); otherwise `gap-10`.
Card `group flex flex-col gap-3 bg-bg p-5`; icon tile `flex size-10 items-center
justify-center` + `toneSoft` (square); title `font-heading text-base font-medium`.

#### PricingCard

`flex flex-col bg-bg`; featured → `border-2` + `toneBorder`, else
`border border-hairline`. Header `flex flex-col gap-4 p-5`, tinted with
`toneSoft` when featured. Ribbon `shrink-0 rounded-full px-2.5 py-1 font-mono
text-[10px] tracking-wide`. Price `font-heading text-4xl font-medium
tracking-tight` (`toneText` when featured). Feature list `border-t
border-hairline p-5`, tick `mt-0.5 size-4 shrink-0` in `toneText`.

#### Testimonial

`flex flex-col gap-5` + variant: `plain` → nothing; `card` → `border
border-hairline bg-bg p-5`; `accent` → `toneSurface border-l-2 toneBorderLeft p-5`.
Quote `font-sans leading-relaxed text-pretty text-text-secondary`
(`large` → `text-xl sm:text-2xl`), with typographic quote marks in `toneText`.

#### LogoCloud

Section `w-full px-6 py-14`; label `text-center font-mono text-xs tracking-wide
text-text-muted uppercase`; row `flex flex-wrap items-center justify-center
gap-x-12 gap-y-8`; logo `h-7 w-auto object-contain`; muted →
`opacity-60 grayscale hover:opacity-100 hover:grayscale-0`.

#### CTASection

Section `w-full px-6 py-16`; panel `mx-auto flex w-full max-w-6xl gap-8 p-10
sm:p-14` + variant (`tinted` / `solid` = bare `toneSolid` / `outline`).
Heading `font-heading text-3xl font-medium tracking-tight text-balance`.

#### StatsBand

Section `w-full px-6 py-16`; grid bordered → `gap-px border border-hairline
bg-hairline`, else `gap-10`; cell `bg-bg p-5`.

### 11.8 Overlays

All overlay surfaces share: `border border-hairline bg-bg`, **no radius, no
shadow**, `z-50` (toasts `z-[100]`), `backdrop:bg-text/40` with no blur.

#### Modal

```
m-auto w-[calc(100%-2rem)] border border-hairline bg-bg p-0 text-text
backdrop:bg-text/40 {sizes[size]}
```

Header `flex items-start gap-4 border-b border-hairline px-5 py-4`; title
`font-heading text-lg font-medium tracking-tight`; description
`font-sans text-sm text-text-secondary`; close button `-m-1 p-1 text-text-muted
… focus-visible:outline-brand` with a `size-4` glyph.
Body `px-5 py-4 font-sans text-[15px] leading-relaxed text-text-secondary`.
Footer `flex items-center justify-end gap-3 border-t border-hairline px-5 py-3.5`.

#### Drawer

Same dialog treatment, plus side classes (`mr-0 ml-auto h-screen max-h-screen
border-l` etc.) and the slide animation. Header `border-b px-5 py-4`, body
`flex-1 overflow-y-auto px-5 py-4 text-[15px]`, footer `border-t px-6 py-4 gap-3`.

#### ConfirmDialog

Built on Modal. Icon medallion `flex size-10 shrink-0 items-center justify-center
rounded-full` + `toneSoft`, glyph `size-5`. Title `font-heading text-lg
font-medium tracking-tight`; body `text-sm leading-relaxed text-text-secondary`.

#### CommandPalette

Dialog `mx-auto mt-[12vh] mb-auto w-[min(36rem,calc(100vw-2rem))] max-w-none
border border-hairline bg-bg p-0`. Search row `flex items-center gap-3 border-b
border-hairline px-3.5`, input `h-11 … text-[15px]`. List `max-h-80
overflow-y-auto py-1`. Group label `px-3.5 pt-3 pb-1 font-mono text-[10px]
tracking-wide text-text-muted uppercase`. Item `px-3.5 py-2 font-sans text-[14px]`,
active → `toneSoft`. Shortcut hint `font-mono text-[11px] text-text-muted`.

#### Dropdown / ContextMenu

`z-50 flex max-h-[min(24rem,80vh)] min-w-44 flex-col overflow-y-auto
border border-hairline bg-bg py-1 font-sans`.

#### MenuItem / MenuSeparator

Item `flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-[14px]
transition-colors duration-100 ease-brand-out focus:outline-none` —
**full-bleed, no horizontal margin, no radius.**
`neutral` tone → `text-text-secondary hover:bg-bg-inset focus-visible:bg-bg-inset`;
any other tone → `toneText` + `toneSoftHover`.
Trailing hint `font-mono text-[11px] text-text-muted`.
Separator `my-1 h-px bg-hairline`; section label `mt-1 px-3 pt-2 pb-1 font-mono
text-[10px] tracking-wide text-text-muted uppercase`.

#### Popover

`z-50 flex max-w-xs flex-col gap-2 border border-hairline bg-bg p-4 font-sans`;
title `font-heading text-sm font-medium text-text`.

#### Tooltip

```
pointer-events-none invisible absolute z-50 bg-text px-2.5 py-1.5 font-sans
text-xs whitespace-nowrap text-text-inverse opacity-0
transition-opacity duration-150 ease-brand-out
```

Shown on `group-hover/tt` and `group-focus-within/tt`. Offset **2**
(`mb-2` / `mt-2` / `mr-2` / `ml-2`). No radius, no shadow, no arrow.

#### ThemeToggle

Segmented form: `inline-flex items-center gap-0 border border-hairline bg-bg-alt
p-1`; option `inline-flex h-8 items-center gap-1.5 px-3 font-sans text-[13px]`,
active → `bg-bg font-medium text-text`.
Icon-only form: `inline-flex size-9 items-center justify-center border
border-hairline` + `toneSoft`.

---

## 12. Rules for AI

**Hard invariants — never break these:**

1. No `rounded-sm|md|lg|xl|2xl|[Npx]`. Only `rounded-full` (pills/discs) and
   `rounded-none` (resets).
2. No `shadow-*` of any kind, including arbitrary `shadow-[…]`.
3. No `dark:` variants. Colour comes from tokens only.
4. No raw hex, no `text-gray-500`, no Tailwind palette colours. Only token
   utilities: `bg-bg`, `bg-bg-alt`, `bg-bg-inset`, `border-hairline`,
   `border-hairline-strong`, `text-text`, `text-text-secondary`,
   `text-text-muted`, `text-text-inverse`, and the eight tones.
5. No interpolated class names (`bg-${tone}`). Read `core/tones.ts` maps.
6. Headings are `font-heading` at `font-medium`. Body is `font-sans`.
   Micro-labels, numbers, counts, keys and codes are `font-mono`.
7. Base body size is `text-[15px]`; small text is `text-sm`; micro is
   `text-xs` / `text-[11px]` / `text-[10px]`.
8. Every focusable element carries `{focusRing} {toneRing[tone]}` (or the
   `peer-` pair for `sr-only` inputs).
9. Default `tone` is `'brand'`; default `size` is `'md'`; default `variant`
   is the first listed in its union.
10. Transitions are `duration-150 ease-brand-out` (rows/menus `duration-100`,
    transforms `duration-200`). Nothing lifts on hover.
11. Icon boxes come from `./icon.js` (`iconSm|Md|Lg|Xl`) — never hand-size a
    consumer snippet.
12. Inline SVG strokes: `stroke-width="1.5"`, `stroke-linecap="square"`.

**When adding a new matte component:**

- Copy the geometry of the nearest existing component in this document.
- Ask: _does it have corners?_ → they stay sharp. _Does it float?_ → give it a
  `border border-hairline` and `bg-bg`, not elevation. _Does it label
  something?_ → `font-mono … uppercase tracking-wide text-text-muted`.
- Keep the prop surface identical to `paper` and `sprout`. The promise of the
  library is: pick a look, get the same component. `src/lib/styles/parity.test.ts`
  enforces this.
- Put any style-local class-string helper in the style folder (like `icon.ts`),
  never in `core/` — Tailwind only scans the style folder the app installed.
