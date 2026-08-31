# sprout — design specification

> Authoritative style rules for `@nqmcreative/ui/sprout`.
> Written for AI agents and contributors: **every value below is what the code
> actually ships.** When adding or editing a sprout component, match these rules
> exactly. If a rule here conflicts with your instinct, the rule wins.

Source of truth: `src/lib/styles/sprout/`. Behaviour (not looks) lives in
`src/lib/core/` and is shared by all three styles.

---

## 1. Identity

**The warm one.** Leaf green on cream, fully rounded corners, and a display face
with round terminals. Built for school, community and family sites — where the
reader is a parent on a phone, not an operator at a desk.

The three laws, in order of importance:

1. **Everything is round, and the radius grows with the surface.** Controls
   `rounded-xl`, menus `rounded-2xl`, cards `rounded-[28px]`, and anything you
   press is a full pill (`rounded-full`).
2. **Raised things stand on a solid lip, not a blur.** sprout's one structural
   idea: a flat offset shadow in the object's own colour, like a moulded key or
   a printed sticker. Lives in `sprout/lift.ts`, never in `theme.css`.
3. **Buttons sink when pressed.** `active:translate-y-[3px]` travels exactly as
   far as the lip shortens (5px → 2px), so the top face lands where the shadow
   was and the whole thing reads as one pressed object.

Surfaces are cream, never white, and every grey is green-cast — a neutral grey
next to this much foliage reads as a printing error.

---

## 2. Wiring

```css
/* src/app.css */
@import 'tailwindcss';
@import '@nqmcreative/ui/sprout/theme.css';
@import '@nqmcreative/ui/sprout/fonts.css'; /* optional */

@source '../node_modules/@nqmcreative/ui/dist/styles/sprout';
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

Cream rather than white; every step of the grey scale carries a little brand hue.
Dark mode is a **night garden**, not a neutral slate — the surfaces keep the
green cast and every hue lifts a step or two.

| token                     | light     | dark      |
| ------------------------- | --------- | --------- |
| `--color-bg`              | `#fffefb` | `#0e1a11` |
| `--color-bg-alt`          | `#f0fdf4` | `#14251a` |
| `--color-bg-inset`        | `#e3f6e9` | `#1b3020` |
| `--color-hairline`        | `#ecefe7` | `#1e3524` |
| `--color-hairline-strong` | `#d3e0d1` | `#2f4a36` |

### 3.2 Text

| token                    | light     | dark      |
| ------------------------ | --------- | --------- |
| `--color-text`           | `#1a3a1f` | `#f0f7f0` |
| `--color-text-secondary` | `#2f5135` | `#cadfcd` |
| `--color-text-muted`     | `#5f6f62` | `#94ad99` |
| `--color-text-inverse`   | `#ffffff` | `#0e1a11` |

### 3.3 Tones

| tone                | base (L)  | hover (L) | light (L) | border (L) | base (D)  | hover (D) | light (D) | border (D) |
| ------------------- | --------- | --------- | --------- | ---------- | --------- | --------- | --------- | ---------- |
| `brand` (leaf)      | `#16a34a` | `#15803d` | `#dcfce7` | `#a7e8bf`  | `#4ade80` | `#86efac` | `#0f2f1c` | `#1f5533`  |
| `accent` (honey)    | `#a16207` | `#854d0e` | `#fff5d6` | `#fbbf24`  | `#fbbf24` | `#fcd34d` | `#33260a` | `#5e4514`  |
| `violet`            | `#7c3aed` | `#6d28d9` | `#f4f0fe` | `#dccffb`  | `#a78bfa` | `#c4b5fd` | `#271c47` | `#4c3a86`  |
| `info` (sky)        | `#0369a1` | `#075985` | `#e8f5fd` | `#a5dcf3`  | `#56b6ec` | `#7fc9f2` | `#0d2a3d` | `#17496a`  |
| `success` (emerald) | `#047857` | `#065f46` | `#e6f8f0` | `#9ee0c3`  | `#34d399` | `#6ee7b7` | `#082a1f` | `#10543c`  |
| `warning` (amber)   | `#b45309` | `#92400e` | `#fff6e8` | `#fbd79b`  | `#f0a63c` | `#f5bc63` | `#35240a` | `#5e4114`  |
| `danger` (red)      | `#d11f1f` | `#b91c1c` | `#fdeeee` | `#f7bcbc`  | `#f38080` | `#f7a3a3` | `#3a1616` | `#6b2727`  |
| `neutral` (sage)    | `#5f6f62` | `#4a584d` | `#eef3ec` | `#cbd8c9`  | `#9db3a1` | `#c7d8ca` | `#1b3020` | `#2f4a36`  |

Two deliberate quirks, documented in `theme.css`:

- **`brand` is `#16a34a` on purpose.** Every other base clears 4.5:1 against
  `--color-bg` and white; the leaf green reaches only 3.3:1 **as text**. It is
  kept because it _is_ the identity, and it is overwhelmingly used as a fill,
  where white sits on it at button sizes. If a project needs AA on
  brand-coloured text, move this one value to `#15803d` (5.0:1) and leave
  everything else alone — nothing in the style depends on the brighter value.
- **`accent` is dark honey, and the bright sunflower lives in
  `--color-accent-border` (`#fbbf24`)** — that is the slot a component reaches
  for when it wants a fill it will put _dark_ text on.

`brand` is the default `tone` for every component that has one.

### 3.4 Type tokens

```css
--font-sans: 'Work Sans', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-heading:
	'Fredoka', 'Work Sans', ui-rounded, ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace;
```

Two faces, and the split is the point. **Fredoka** sets headings: geometric,
round-terminalled, drawn wide — the same warmth the shapes have. **Work Sans**
sets everything a reader has to get through, because Fredoka at 15px in a
paragraph is charm at the cost of the sentence.

`fonts.css` ships Fredoka as a variable file (`font-weight: 400 600`) and Work
Sans (`400 700`), one request per subset. sprout uses **no `font-mono` utility
anywhere**; figures get `tabular-nums`.

Fredoka appears outside headings in exactly three places — and only these:
**Button labels**, **Badge labels** and **Navbar links**. Everything else that
is not a heading is `font-sans`.

### 3.5 Motion tokens

```css
--ease-brand: cubic-bezier(0.34, 1.4, 0.64, 1); /* a little overshoot */
--ease-brand-out: cubic-bezier(0.22, 1, 0.36, 1); /* honest; the UI default */
```

`--ease-brand` is the one place sprout spends motion — a slight overshoot on the
way in. `--ease-brand-out` stays honest for anything that has to feel immediate,
like a hover colour change.

### 3.6 Dark mode

```css
@custom-variant dark (&:where(.dark, .dark *));
```

Two ways in, and they cooperate: `class="dark"` on `<html>` wins outright;
otherwise the OS preference applies unless `<html>` says `class="light"`.

**Components must never write `dark:` classes** — and in sprout this matters
twice over: the lip shadows in `lift.ts` are written to hold in _both_ modes
(near-black at low alpha for surfaces; `color-mix`ed from the tone itself for
fills), precisely so no `dark:` variant is needed.

---

## 4. Typography

| role                                  | classes                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------ |
| Section heading                       | `font-heading text-3xl font-semibold tracking-tight text-balance`                    |
| Hero heading                          | `font-heading text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl`       |
| Card / dialog / drawer title          | `font-heading text-base font-semibold text-text`                                     |
| Popover title                         | `font-heading text-sm font-semibold text-text`                                       |
| Stat / price value                    | `font-heading text-3xl font-semibold tracking-tight tabular-nums` (price `text-4xl`) |
| **Button label**                      | `font-heading font-semibold`                                                         |
| **Badge label**                       | `font-heading font-medium tracking-[0.04em]`                                         |
| **Navbar link**                       | `font-heading text-sm font-medium`                                                   |
| Body                                  | `font-sans text-sm leading-relaxed text-text-secondary`                              |
| Lede                                  | `font-sans text-lg leading-relaxed text-pretty text-text-secondary`                  |
| Secondary / description               | `font-sans text-[13px] leading-relaxed text-text-secondary`                          |
| Label                                 | `font-sans text-sm font-medium text-text`                                            |
| Help / error                          | `font-sans text-[13px] text-text-muted` / `text-danger`                              |
| Micro-label (eyebrow, group, section) | `font-sans text-[11px] font-semibold text-text-muted` or `text-[13px] font-semibold` |
| Meta / counts / hints                 | `text-[11px] text-text-muted tabular-nums`                                           |

Heading weight is **`font-semibold` (600)** — the top of Fredoka's variable
range. Base body size is 14px (`text-sm`); secondary 13px; micro 11px.

---

## 5. Geometry

### 5.1 Radius scale

| radius           | value | used for                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `rounded`        | 4px   | the smallest affordances: close/clear icon buttons, checkbox box, colour preview, chip remove, TimeInput steppers, toast action                                                                                                                                                                                                                            |
| `rounded-md`     | 6px   | `Link` (focus-ring shape only)                                                                                                                                                                                                                                                                                                                             |
| `rounded-lg`     | 8px   | colour swatch buttons, FileInput "choose" button                                                                                                                                                                                                                                                                                                           |
| `rounded-xl`     | 12px  | **controls**: Input, Select, Textarea, InputAddon, Combobox, DatePicker, MultiSelect, TagsInput, PinInput, FileInput row, Kbd, MenuItem, calendar day + nav, sidebar row, pagination-adjacent chrome, tooltip, segmented item, panel tab, chips, icon tiles, drawer/modal close, mobile nav row, sidebar collapse toggle, ThemeToggle option + icon button |
| `rounded-2xl`    | 16px  | **menus and mid surfaces**: Dropdown, ContextMenu, Combobox/MultiSelect listbox, DatePicker popup, Popover, Toast, SegmentedControl container, ThemeToggle container, Tabs panel container, Sidebar floating, Avatar squared, Skeleton block                                                                                                               |
| `rounded-[20px]` | 20px  | Accordion, Alert, Table shell, boxed radio/checkbox option, file list                                                                                                                                                                                                                                                                                      |
| `rounded-[28px]` | 28px  | **big surfaces**: Card, Modal, CommandPalette, Dropzone, EmptyState, FeatureCard, PricingCard, Testimonial card, bordered FeatureGrid, bordered StatsBand                                                                                                                                                                                                  |
| `rounded-[32px]` | 32px  | CTASection panel                                                                                                                                                                                                                                                                                                                                           |
| `rounded-full`   | ∞     | **anything you press**: Button (all sizes and variants), Badge, Pagination cell, Navbar link, pill tabs, Avatar, Switch track + thumb, Radio, Spinner, Steps marker + connector, Progress track + fill, hero badge, pricing ribbon, tick medallions, tab count chip, dots                                                                                  |

Directional forms in use: `rounded-t-xl` (underline tab), `rounded-b-[28px]`
(card and modal footers), `rounded-l-xl` / `rounded-r-xl` (`InputGroup` ends).

**Rule of thumb:** if it is a target → `rounded-full`. If it is a control that
holds text → `rounded-xl`. If it holds other components → `rounded-2xl` or
`rounded-[20px]`. If it is a card or a dialog → `rounded-[28px]`.

### 5.2 Borders

- Default hairline: `border border-hairline` (1px) for surfaces.
- **Interactive controls use the stronger rule**: `border-hairline-strong` is
  the resting border of Input, Select, Textarea, Combobox, DatePicker,
  MultiSelect, TagsInput, PinInput, FileInput, InputAddon, checkbox/radio boxes,
  colour swatches and the FileInput button.
- Accent stripe (Card `accent`, Alert `accent`, Testimonial `accent`):
  **`border-l-4`**.
- Featured PricingCard and current Step marker: `border-2`.
- Tab underline: `border-b-2`.
- Dashed: `border-2 border-dashed border-hairline-strong` (Dropzone) and
  `border border-dashed border-hairline-strong` (EmptyState).

### 5.3 Elevation — the lip system

Defined in `src/lib/styles/sprout/lift.ts` as **plain class strings**, not
theme tokens: a `--shadow-lip` that only sprout defined would break the shared
token contract and fail `bun run scoped`. Tailwind still sees them because it
scans that file like any other source.

| export         | class                                                                                             | meaning                                               |
| -------------- | ------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `edge`         | `shadow-[0_2px_0_0_rgba(20,83,45,0.07)]`                                                          | barely raised: chips, inputs, table shells, list rows |
| `soft`         | `shadow-[0_4px_0_0_rgba(20,83,45,0.08),0_14px_30px_-10px_rgba(20,83,45,0.18)]`                    | the workhorse: cards, menus, popovers, toasts         |
| `softOnHover`  | `hover:shadow-[0_6px_0_0_rgba(20,83,45,0.10),0_18px_36px_-12px_rgba(20,83,45,0.22)]`              | `soft`, one step deeper, for a card under the pointer |
| `float`        | `shadow-[0_6px_0_0_rgba(20,83,45,0.09),0_28px_60px_-20px_rgba(20,83,45,0.35)]`                    | off the page: Modal, Drawer, CommandPalette           |
| `lift[tone]`   | `shadow-[0_5px_0_0_color-mix(in_oklab,var(--color-<tone>)_72%,black)]` + `active:` at `0_2px_0_0` | a solid fill's own lip — Button `solid`               |
| `liftSm[tone]` | `shadow-[0_3px_0_0_color-mix(in_oklab,var(--color-<tone>)_72%,black)]`                            | too small to travel: icon tiles, dots, active page    |

Rules:

- A tone's lip is the tone **mixed 72% toward black in oklab**, so it is always
  the colour a shadow of that fill would be — and it darkens whatever the fill
  happens to be, in either theme.
- `lift[tone]` must always be paired with `active:translate-y-[3px]` on the same
  element. 5px − 2px = 3px; the numbers are not independent.
- The surface shadows (`edge`/`soft`/`float`) are near-black at low alpha with a
  green cast (`rgba(20,83,45,·)`), never a tone colour.
- Two exceptions that use a plain Tailwind shadow rather than a lip: Sidebar
  `floating` (`shadow-sm`) and the Slider thumbs
  (`shadow-[0_2px_0_0_rgba(20,83,45,0.25)]`).

Backdrops for `<dialog>`: `backdrop:bg-text/30 backdrop:backdrop-blur-[1px]`.

### 5.4 The press

```
active:translate-y-[3px]
disabled:active:translate-y-0
```

Only on Button `solid`/`soft`/`outline`. `ghost` and `link` explicitly cancel it
(`active:translate-y-0`) — nothing raised, so nothing to sink; and the `link`
variant is a sentence, not a target.

Cards lift instead of sinking: `hover:-translate-y-0.5` with `softOnHover`.

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
- Accordion summaries use `focus-visible:outline-offset-[-2px]` so the ring stays
  inside the rounded container.
- Text inputs use `focus:outline-none` on the `<input>` and colour the wrapper
  border instead: `toneFocusBorder[tone]` / `toneFocusWithinBorder[tone]`.
- Invalid: `border-danger` (and `focus-within:border-danger` on wrappers).
- Disabled: `disabled:opacity-50 disabled:pointer-events-none` for controls;
  `pointer-events-none opacity-50` on wrappers; `opacity-40` for menu/list rows
  and pagination cells.
- Hover on rows is a surface swap — `hover:bg-bg-inset` for menu/nav/sidebar
  rows, `hover:bg-bg-alt` for table rows and outline buttons.

---

## 7. Motion

- Standard transition: `transition-colors duration-150 ease-brand-out`.
- Button: `transition-[color,background-color,border-color,box-shadow,transform]
duration-150 ease-brand-out` — the transform and shadow are part of the press,
  so they must be in the list.
- Card / FeatureCard: `transition-[box-shadow,transform,border-color]
duration-150 ease-brand-out`.
- Tabs, segmented items, ThemeToggle options: `transition-all duration-150`.
- List rows and menu items: `duration-100`.
- Chevrons / carets: `transition-transform duration-200 ease-brand-out`.
- Sidebar width `transition-[width] duration-200`; Progress fill
  `transition-[width] duration-300 ease-brand` (this is where the overshoot
  curve earns its keep).
- Drawer: `animate-[drawer-<side>_220ms_cubic-bezier(0,0,0.2,1)]`, with global
  keyframes declared inside `Drawer.svelte` and a
  `@media (prefers-reduced-motion: reduce) { dialog { animation: none } }` guard.

---

## 8. Icons

Consumer-supplied snippets; the component sizes the box (`src/lib/styles/sprout/icon.ts`):

| export   | size | use                                             |
| -------- | ---- | ----------------------------------------------- |
| `iconSm` | 14px | menu rows, chips, links, one line of small text |
| `iconMd` | 16px | default: buttons, nav items, tabs, list rows    |
| `iconLg` | 20px | headers, stats, beside a heading                |
| `iconXl` | 24px | dialog and empty-state marks                    |

Each is `grid size-N shrink-0 place-items-center *:size-N`.

Inline SVGs drawn by the library use `stroke-width="1.5"`/`"1.6"` and
**`stroke-linecap="round"`** — round terminals, like the type.

---

## 9. Control size scale

sprout's buttons run **one step taller and wider than the other styles**: a pill
needs horizontal padding to keep its label off the curve, and the extra width
suits a touch target on a phone.

| component               | sm                                                                                                                   | md                                                       | lg                      | xl                    |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------- | --------------------- |
| Button                  | `h-9 px-4 text-[13px]`                                                                                               | `h-11 px-5 text-sm`                                      | `h-12 px-6 text-[15px]` | `h-14 px-8 text-base` |
| Button (icon-only)      | `size-9`                                                                                                             | `size-11`                                                | `size-12`               | `size-14`             |
| Input / FileInput       | `h-8 text-[13px]`                                                                                                    | `h-10 text-sm`                                           | `h-11 text-[15px]`      | —                     |
| InputAddon              | `h-8 px-2.5 text-[13px]`                                                                                             | `h-10 px-3 text-sm`                                      | `h-11 px-3 text-[15px]` | —                     |
| FileInput button        | `h-6 px-2 text-[11px]`                                                                                               | `h-7 px-2.5 text-xs`                                     | `h-8 px-3 text-xs`      | —                     |
| SegmentedControl        | `h-7 px-2.5 text-[13px]`                                                                                             | `h-8 px-3.5 text-sm`                                     | —                       | —                     |
| SegmentedControl (icon) | `size-7`                                                                                                             | `size-8`                                                 | —                       | —                     |
| Avatar                  | `xs size-6 text-[10px]` · `sm size-8 text-xs` · `md size-10 text-sm` · `lg size-12 text-base` · `xl size-16 text-lg` |
| Progress                | `h-1.5`                                                                                                              | `h-2`                                                    | `h-3`                   | —                     |
| Spinner                 | `xs size-3 border-[1.5px]` · `sm size-4 border-2` · `md size-5 border-2` · `lg size-8 border-[3px]`                  |
| Switch                  | track `h-5 w-9`, thumb `size-4`, travel `translate-x-4`                                                              | track `h-6 w-11`, thumb `size-5`, travel `translate-x-5` | —                       | —                     |
| Badge                   | `px-2.5 py-0.5 text-[11px]`                                                                                          | `px-3 py-1 text-xs`                                      | —                       | —                     |
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

Plus the sprout-local maps from `./lift.js`: `edge`, `soft`, `softOnHover`,
`float`, `lift[tone]`, `liftSm[tone]`.

---

## 11. Component specifications

### 11.1 Actions

#### Button

```
base: inline-flex items-center justify-center gap-2 rounded-full border
      font-heading font-semibold whitespace-nowrap
      transition-[color,background-color,border-color,box-shadow,transform]
      duration-150 ease-brand-out active:translate-y-[3px]
      disabled:opacity-50 disabled:pointer-events-none disabled:active:translate-y-0
      aria-disabled:opacity-50 aria-disabled:pointer-events-none
```

Fully round, in the heading face, standing on a lip it sinks into. Sizes per §9.

| variant           | classes                                                                                                                                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `solid`/`primary` | `border-transparent` + `toneSolid` + `toneSolidHover` + **`lift[tone]`**                                                                                                                                    |
| `soft`            | `border-transparent` + `toneSoft` + `toneSoftHover` + `edge`                                                                                                                                                |
| `outline`         | `bg-bg` + `edge` + `toneText` + `toneBorderSoft` + `hover:bg-bg-alt` — outline keeps its own colours on hover; it never flips to a solid fill (that is matte's move, and it fights sprout's soft surfaces). |
| `ghost`           | `border-transparent bg-transparent` + `toneText` + `toneSoftHover` + `active:translate-y-0`                                                                                                                 |
| `link`            | `border-transparent` + `toneText` + `h-auto p-0 text-sm underline-offset-4 hover:underline active:translate-y-0`                                                                                            |

Spinner replaces the leading icon while busy (`size sm → xs`, else `sm`).
`aria-busy` is set; an async `onclick` returning a promise auto-locks the button.

#### Link

```
inline-flex items-center gap-1 rounded-md font-sans
transition-colors duration-150 ease-brand-out
{muted ? 'text-text-secondary' + toneHoverText : toneText}
{focusRing} {toneRing}
```

Underline: `always` → `underline underline-offset-2 decoration-current/40`;
`hover` (default) → `hover:underline underline-offset-2 decoration-current/40`;
`none` → nothing. External marker `<span class="text-[0.85em]">↗</span>`.
Icons use `iconSm`. **Note the face: `font-sans`, not `font-heading`** — a link
sits inside a sentence.

### 11.2 Forms

#### Input (wrapper pattern)

```
inline-flex w-full items-center gap-2 rounded-xl border bg-bg px-3 {edge}
transition-colors duration-150 ease-brand-out
{sizes[size]}
{invalid ? 'border-danger focus-within:border-danger'
         : 'border-hairline-strong ' + toneFocusWithinBorder[tone]}
{disabled ? 'pointer-events-none opacity-50' : ''}
```

Inner `<input>`: `w-full min-w-0 bg-transparent font-sans text-text
placeholder:text-text-muted focus:outline-none`. Icons `shrink-0 text-text-muted`.

#### Textarea

`w-full rounded-xl border bg-bg px-3 py-2 font-sans text-sm text-text` + `edge`

- `placeholder:text-text-muted focus:outline-none`, `resize-y` (or
  `resize-none overflow-hidden` when `autoresize`).

#### Select

`h-10 w-full appearance-none rounded-xl border bg-bg py-0 pr-9 pl-3 font-sans
text-sm text-text` + `edge`; chevron `pointer-events-none absolute right-3
size-4 text-text-muted`.

#### InputGroup / InputAddon

Group: `flex w-full items-stretch [&>*]:min-w-0 [&>*]:rounded-none
[&>*:first-child]:rounded-l-xl [&>*:last-child]:rounded-r-xl
[&>*:focus-within]:relative [&>*:focus-within]:z-10
[&>*:not(:first-child)]:-ml-px`.
Addon: `inline-flex shrink-0 items-center gap-1.5 rounded-xl border
border-hairline-strong font-sans whitespace-nowrap text-text-secondary` + `edge`;
`muted` → `bg-bg-alt`, else `bg-bg`.

#### Checkbox / Radio

Wrapper `group inline-flex items-start gap-2.5 font-sans text-sm`.
Real input is `peer sr-only`. Visual box:

```
mt-0.5 flex size-[18px] shrink-0 items-center justify-center
rounded border border-hairline-strong bg-bg {edge}
transition-colors duration-150 ease-brand-out
{tonePeerChecked} {peerFocusRing} {tonePeerFocus}
```

Checkbox box is `rounded` (4px — the one place sprout stays nearly square,
because an 18px box at `rounded-xl` is a circle and would read as a radio);
Radio is `rounded-full` with a `size-1.5 rounded-full bg-text-inverse` dot.
Indeterminate bar `h-0.5 w-2.5 rounded-full bg-text-muted`.
Tick `size-3 text-text-inverse opacity-0 … group-has-[:checked]:opacity-100`.
Description `text-[13px] leading-snug text-text-muted`.

#### CheckboxGroup / RadioGroup

`fieldset` = `flex flex-col gap-3 border-0 p-0`; legend
`mb-1 font-sans text-sm font-medium text-text`, required marker
`<span class="ml-0.5 text-danger">*</span>`. Options `flex gap-2.5`.
Boxed option:

```
flex flex-1 cursor-pointer items-start gap-3 rounded-[20px] border p-4 {edge}
transition-colors duration-150 ease-brand-out
{selected ? toneBorder + toneSurface
          : 'border-hairline bg-bg hover:border-hairline-strong'}
```

#### Switch

Track `relative mt-0.5 inline-flex shrink-0 items-center rounded-full p-0.5
transition-colors duration-200 ease-brand-out`; on → `toneFill`, off →
`bg-hairline-strong`. Thumb `rounded-full bg-bg` + `edge`.

#### Slider

Track `h-1.5 rounded-full` with
`bg-[linear-gradient(to_right,currentColor_var(--pct),var(--color-bg-inset)_var(--pct))]`;
thumb `size-4 rounded-full border-2 border-bg bg-current` with its own lip
`shadow-[0_2px_0_0_rgba(20,83,45,0.25)]` (`-mt-[5px]` on WebKit).
Focus ring uses `focus-visible:outline-offset-4`.
Value readout `text-sm font-medium tabular-nums` in the tone colour.
Min/max row `text-[11px] text-text-muted tabular-nums`.

#### Field / Label

Field `flex w-full flex-col gap-1.5`; label `font-sans text-sm font-medium
text-text`; error/help `font-sans text-[13px] text-danger` / `text-text-muted`.

#### SegmentedControl

Container `inline-flex items-center gap-1 rounded-2xl border border-hairline
bg-bg-inset p-1`.
Item `inline-flex items-center justify-center rounded-xl font-sans font-medium
whitespace-nowrap transition-all duration-150 ease-brand-out`; active →
`bg-bg text-text` + `edge`; inactive → `text-text-muted hover:text-text`.

#### PinInput

Cell `size-11 rounded-xl border bg-bg text-center font-sans text-base
font-medium text-text tabular-nums` + `edge`; separator `h-px w-2
bg-hairline-strong`.

#### TagsInput / MultiSelect

Wrapper `flex w-full flex-wrap items-center gap-1.5 rounded-xl border bg-bg
py-1.5 …` + `edge`.
Chip `inline-flex items-center gap-1 rounded-xl py-0.5 pr-0.5 pl-2 text-xs
font-medium` + `toneSoft`. Remove button `size-4 rounded hover:bg-bg/70`,
glyph `size-2.5`. Inner input `h-7 min-w-24 flex-1 … text-sm`.
MultiSelect option check box `size-4 rounded border`.

#### Combobox / DatePicker / SearchInput / TimeInput / CurrencyInput / ColorInput / FileInput

- Combobox wrapper `rounded-xl … pr-1.5 pl-3` + `edge`, inner input `h-10 text-sm`;
  listbox `z-50 max-h-64 overflow-y-auto rounded-2xl border border-hairline
bg-bg py-1 font-sans` + `soft`; group label `px-3 pt-2 pb-1 text-[11px]
font-semibold text-text-muted`; option `mx-1 rounded-xl px-2.5 py-2 text-sm`,
  active → `toneSoft`.
- DatePicker wrapper `pr-1 pl-3`, input `tabular-nums`; popup
  `z-50 rounded-2xl border border-hairline bg-bg` + `soft`.
- CurrencyInput addon `text-xs font-medium text-text-muted`.
- ColorInput preview `relative grid size-5 place-items-center overflow-hidden
rounded border border-hairline-strong`; swatch buttons `size-6 rounded-lg
border` + `hover:-translate-y-0.5`; selected swatch `border-text`. Hex field
  `uppercase tabular-nums`.
- TimeInput steppers `grid size-6 place-items-center rounded`.
- FileInput row `rounded-xl … px-1` + `edge`; the "choose" button is
  `rounded-lg border border-hairline-strong bg-bg-alt font-sans font-medium
text-text-secondary`. File list `rounded-[20px] border border-hairline bg-bg`
  - `edge`, rows `border-b border-hairline px-4 py-2.5 … last:border-b-0`,
    size in `text-xs text-text-muted tabular-nums`.

#### Dropzone

```
flex w-full flex-col items-center gap-3 rounded-[28px] border-2 border-dashed
px-6 py-10 text-center font-sans transition-colors duration-150 ease-brand-out
{dragging ? toneBorder + toneSurface
          : 'border-hairline-strong bg-bg-alt/50 hover:bg-bg-alt'}
```

Icon medallion `flex size-12 items-center justify-center rounded-full` + `toneSoft`.
Hint line `text-xs text-text-muted`.

#### Calendar

`flex w-[18rem] flex-col gap-3 p-3 font-sans`.
Nav buttons `inline-flex size-8 items-center justify-center rounded-xl
text-text-secondary hover:bg-bg-inset hover:text-text`.
Weekday row `grid grid-cols-7 gap-0.5`, cells `pb-1 text-center text-[11px]
font-medium text-text-muted`.
Day cell `flex h-9 items-center justify-center rounded-xl text-[13px]
tabular-nums`; selected → `toneFill + font-semibold text-text-inverse`;
today (unselected) → `toneSoft + font-semibold`; outside month →
`text-text-muted/60`.

### 11.3 Data display

#### Badge

```
inline-flex items-center gap-1.5 rounded-full font-heading font-medium
tracking-[0.04em]
```

Variants: `soft` → `toneSoft`; `solid` → `toneSolid`; `outline` →
`border {toneBorderSoft} {toneText} bg-bg`. Dot `size-1.5 shrink-0 rounded-full`.

> The badge is a pill in Fredoka with a whisper of letter-spacing — the one
> place a tiny label gets the display face, because at 11–12px Fredoka reads as
> a stamp rather than as text.

#### Avatar

`inline-flex shrink-0 items-center justify-center overflow-hidden font-sans
font-semibold select-none`; `squared` → `rounded-2xl`, else `rounded-full`.
Image `size-full object-cover`; fallback surface `toneSoft`, image surface
`bg-bg-inset`.
AvatarGroup `flex items-center *:-ml-2 *:ring-2 *:ring-bg
[&>*:first-child]:ml-0`.

#### Card

Container `flex flex-col rounded-[28px]` + variant:

| variant   | classes                                     |
| --------- | ------------------------------------------- |
| `outline` | `border border-hairline bg-bg` + **`soft`** |
| `filled`  | `border border-hairline bg-bg-alt` (flat)   |
| `tinted`  | `border border-transparent` + `toneSurface` |

`accent` → `border-l-4` + `toneBorderLeft`.
`interactive` → `transition-[box-shadow,transform,border-color] duration-150
ease-brand-out hover:-translate-y-0.5` + `softOnHover` + `toneHoverBorder`
— **the card rises; a button sinks.**
Header `px-6 pt-6`, eyebrow `font-sans text-xs font-semibold text-text-muted`,
title `font-heading text-base font-semibold text-text`.
Body `px-6 pt-3 pb-6` (or `p-6` with no header).
Footer `rounded-b-[28px] border-t border-hairline bg-bg-alt px-6 py-4`.

#### Stat

Label `flex items-center gap-2 text-sm font-medium text-text-muted`;
value `font-heading text-3xl font-semibold tracking-tight tabular-nums`;
delta `text-sm font-medium` in the trend tone; caption `text-sm text-text-muted`.

#### Table

Shell `flex w-full flex-col overflow-hidden rounded-[20px] border
border-hairline bg-bg` + `edge`.
Toolbar / bulk bar `border-b border-hairline bg-brand-light px-4 py-3`, count
`font-sans text-[13px] font-semibold text-text`.
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
inline-flex h-6 min-w-6 items-center justify-center rounded-xl
border border-hairline bg-bg-alt px-1.5
font-sans text-[11px] font-medium text-text-secondary {edge}
```

### 11.4 Feedback

#### Alert

`flex items-start gap-3 rounded-[20px] p-4 font-sans` + variant:

| variant   | classes                                        |
| --------- | ---------------------------------------------- |
| `soft`    | `toneSurface` + `border` + `toneBorderSoft`    |
| `outline` | `bg-bg` + `edge` + `border` + `toneBorderSoft` |
| `accent`  | `toneSurface` + `border-l-4` + `toneBorder`    |

Title `text-sm leading-snug font-semibold` in `toneText`; body
`text-[13px] leading-relaxed text-text-secondary`; icon `mt-0.5 shrink-0` in
`toneText`; dismiss `-m-1 rounded p-1 text-text-muted hover:bg-bg/60`.
`role` is `alert` for `danger`, otherwise `status`.

#### Toaster

Region `pointer-events-none fixed z-[100] flex w-[min(24rem,calc(100vw-2rem))]
flex-col gap-2.5` + position (`top-4 left-4 items-start` … `bottom-4 right-4
items-end`).
Toast `pointer-events-auto flex w-full items-start gap-3 rounded-2xl border
border-hairline bg-bg p-3.5 font-sans` + `soft` — a neutral card; only the icon
carries the tone. Title `text-sm leading-snug font-semibold text-text`.
Action `mt-1 self-start rounded font-sans text-[13px] font-semibold underline
underline-offset-2` in `toneText`.

#### Progress

Track `w-full overflow-hidden rounded-full bg-bg-inset` (`h-1.5|2|3`); fill
`h-full rounded-full transition-[width] duration-300 ease-brand` + `toneFill`;
indeterminate adds `w-1/3 animate-pulse`. Value label `text-xs font-medium
text-text-muted tabular-nums`.

#### Spinner

`inline-block shrink-0 animate-spin rounded-full border-current/25
border-t-current`.

#### Skeleton

`animate-pulse bg-bg-inset`; `text` `h-4 w-full rounded-xl`, `block`
`h-24 w-full rounded-2xl`, `circle` `size-10 rounded-full`. Multi-line: last
line `w-2/3`, gap `gap-2`.

#### EmptyState

`flex flex-col items-center gap-4 rounded-[28px] px-6 py-12 text-center
font-sans`; bordered → `border border-dashed border-hairline-strong
bg-bg-alt/50`. Medallion `size-12 rounded-full` + `toneSoft`; title
`font-heading text-base font-semibold`.

### 11.5 Layout & navigation

#### Divider

Horizontal `h-px w-full bg-hairline`; vertical `w-px self-stretch bg-hairline`;
labelled `flex items-center gap-3` with rules `h-px flex-1 bg-hairline` and the
label `font-sans text-xs font-medium text-text-muted`.

#### Tabs

List: `underline` → `gap-5 border-b border-hairline`; `pill` → `gap-1.5`;
`panel` → `gap-1 rounded-2xl border border-hairline bg-bg-inset p-1`.
Item base `inline-flex items-center justify-center gap-2 font-sans text-sm
font-medium whitespace-nowrap transition-all duration-150 ease-brand-out`.

| variant     | item                                         | active                     |
| ----------- | -------------------------------------------- | -------------------------- |
| `underline` | `-mb-px rounded-t-xl border-b-2 px-1 pb-2.5` | `toneBorder + toneText`    |
| `pill`      | `h-9 rounded-full px-3.5`                    | `toneSoft`                 |
| `panel`     | `h-8 rounded-xl px-3.5`                      | `bg-bg text-text` + `edge` |

Inactive is always `text-text-muted hover:text-text`.
Count badge `rounded-full bg-bg-inset px-1.5 text-[11px] font-normal
text-text-muted tabular-nums`.

#### Accordion

Container `flex flex-col overflow-hidden rounded-[20px] border border-hairline
bg-bg`. Item `group border-b border-hairline last:border-b-0`.
Summary `flex cursor-pointer list-none items-center gap-4 px-4 py-3.5 font-sans
text-sm font-medium text-text … hover:bg-bg-alt` and hides the native marker.
Marker rotates 180° (`group-open:rotate-180`), `size-4` in `toneText`.
Meta `text-[13px] font-normal text-text-muted`.
Content `px-4 pb-4 font-sans text-sm leading-relaxed text-text-secondary`.

#### Breadcrumb

`font-sans text-sm`; trail `flex flex-wrap items-center gap-1.5`; separator
`text-hairline-strong select-none`; link `inline-flex items-center gap-1.5
rounded px-1 py-0.5 text-text-muted hover:bg-bg-inset` + `toneHoverText`;
current `px-1 py-0.5 font-medium text-text`.

#### Pagination

Cell `inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2
font-sans text-sm font-medium tabular-nums transition-colors duration-150
ease-brand-out` + `focusRing`.
Current page → `toneSolid` + **`liftSm[tone]`** (a raised token); others →
`text-text-secondary hover:bg-bg-inset`; ellipsis → `text-text-muted`.
Prev/next are `size-4` SVG chevrons.

#### Steps

Marker `flex size-8 shrink-0 items-center justify-center rounded-full border
font-sans text-xs font-semibold`:

| state     | classes                                                          |
| --------- | ---------------------------------------------------------------- |
| `error`   | `border-danger bg-danger-light text-danger`                      |
| `done`    | `toneFill border-transparent text-text-inverse` + `liftSm[tone]` |
| `current` | `border-2 border-current bg-bg` + `toneText`                     |
| `todo`    | `border-hairline-strong bg-bg text-text-muted`                   |

Connector `rounded-full`, `h-0.5` horizontal (`mx-3 flex-1`) or `w-0.5` vertical
(`my-1 flex-1`); filled with `toneFill`, else `bg-hairline`.

### 11.6 App shell

#### Navbar

Header `w-full bg-bg`, `sticky top-0 z-40` when sticky, `border-b border-hairline`
when bordered. Nav `mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-6`.
Desktop list `hidden flex-1 items-center gap-1 md:flex`.
Link base `inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-heading
text-sm font-medium transition-colors duration-150 ease-brand-out` — **a pill in
the display face**; active → `toneSoft`; inactive → `text-text-secondary
hover:bg-bg-inset hover:text-text`.
Badge `text-[11px] text-text-muted tabular-nums`.
Mobile trigger `inline-flex size-9 items-center justify-center rounded-xl
text-text-secondary hover:bg-bg-inset hover:text-text md:hidden`.
Mobile drawer rows `flex items-center justify-between gap-3 rounded-xl px-3
py-2.5 font-sans text-sm font-medium`, list `flex flex-col gap-0.5`.

#### Sidebar

Shell `flex shrink-0 flex-col transition-[width] duration-200 ease-brand-out`,
`w-60` (`w-16` collapsed).

| variant    | classes                                                                            |
| ---------- | ---------------------------------------------------------------------------------- |
| `plain`    | `h-full bg-transparent`                                                            |
| `filled`   | `h-full border-r border-hairline bg-bg-alt`                                        |
| `floating` | `m-3 h-[calc(100%-1.5rem)] rounded-2xl border border-hairline bg-bg-alt shadow-sm` |

Header `flex h-16 shrink-0 items-center gap-3 border-b border-hairline px-3`.
Body `flex-1 overflow-y-auto p-2`.
Row base `flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left
font-sans text-sm`. Active → `toneSoft + font-medium`; inactive →
`text-text-secondary hover:bg-bg-inset hover:text-text`.
Section label `px-2.5 pb-1 font-sans text-[11px] font-semibold text-text-muted`.
Nested list `ml-4 … border-l border-hairline pl-2`.
Footer `border-t border-hairline p-2`; collapse toggle `h-8 rounded-xl …
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
Eyebrow is a pill: `inline-flex rounded-full px-3 py-1 font-sans text-[13px]
font-medium` + `toneSoft`.
Heading `max-w-2xl font-heading text-4xl leading-[1.1] font-semibold
tracking-tight text-balance text-text sm:text-5xl`.
Lede `max-w-xl font-sans text-lg leading-relaxed text-pretty text-text-secondary`.

#### FeatureGrid / FeatureCard

Section `w-full px-6 py-20`; header stack `gap-12`; eyebrow `font-sans
text-[13px] font-semibold text-text-muted`.
Grid: bordered → `gap-px overflow-hidden rounded-[28px] border border-hairline
bg-hairline`; otherwise `gap-6`.
Card `group flex flex-col gap-3 rounded-[28px] bg-bg p-6`; with `href` adds
`transition-[box-shadow,transform] duration-150 ease-brand-out
hover:-translate-y-0.5` + `softOnHover`.
Icon tile `flex size-10 items-center justify-center rounded-xl` +
**`toneSolid[tone]` + `liftSm[tone]`** — a solid, raised chip, not a soft tint.
This is sprout's signature detail; do not swap it for `toneSoft`.
Title `font-heading text-base font-semibold`.

#### PricingCard

`flex flex-col rounded-[28px] bg-bg`; featured → `border-2` + `soft` +
`toneBorder`, else `border border-hairline` + `edge`.
Header `flex flex-col gap-4 p-6`. Ribbon `shrink-0 rounded-full px-2.5 py-0.5
font-sans text-[11px] font-medium`, featured → `toneSolid`, else `toneSoft`.
Price `font-heading text-4xl font-semibold tracking-tight text-text tabular-nums`.
Feature list `border-t border-hairline p-6`; tick sits in a `size-4 rounded-full`

- `toneSoft` medallion with a `size-2.5` glyph.

#### Testimonial

`flex flex-col gap-5` + variant: `plain` → nothing; `card` → `rounded-[28px]
border border-hairline bg-bg p-6` + `edge`; `accent` → `rounded-[28px]
toneSurface border-l-4 toneBorderLeft p-6`.
Quote `font-sans leading-relaxed text-pretty text-text-secondary`
(`large` → `text-xl sm:text-2xl`), wrapped in typographic quote marks.

#### LogoCloud

Section `w-full px-6 py-14`; label `text-center font-sans text-[13px]
font-medium text-text-muted`; row `flex flex-wrap items-center justify-center
gap-x-12 gap-y-8`; logo `h-7 w-auto object-contain`; muted →
`opacity-60 grayscale hover:opacity-100 hover:grayscale-0`.

#### CTASection

Section `w-full px-6 py-16`; panel `mx-auto flex w-full max-w-6xl gap-8
rounded-[32px] p-10 sm:p-14` + variant:

| variant   | classes                                    |
| --------- | ------------------------------------------ |
| `tinted`  | `toneSurface border` + `toneBorderSoft`    |
| `solid`   | `toneSolid` + `soft`                       |
| `outline` | `bg-bg border` + `toneBorderSoft` + `edge` |

Heading `font-heading text-3xl font-semibold tracking-tight text-balance`;
on `solid`, text becomes `text-text-inverse` / `text-text-inverse/80`.
`rounded-[32px]` is the largest radius in the library and is used **only here**.

#### StatsBand

Section `w-full px-6 py-16`; grid bordered → `gap-px overflow-hidden
rounded-[28px] border border-hairline bg-hairline` + `edge`, else `gap-8`;
cell `bg-bg p-6`.

### 11.8 Overlays

Floating surfaces share: `rounded-2xl border border-hairline bg-bg` + `soft`,
`z-50` (toasts `z-[100]`). Dialog surfaces use `float` and
`backdrop:bg-text/30 backdrop:backdrop-blur-[1px]`.

#### Modal

```
m-auto w-[calc(100%-2rem)] rounded-[28px] border border-hairline bg-bg p-0
text-text {float} backdrop:bg-text/30 backdrop:backdrop-blur-[1px] {sizes[size]}
```

Header `flex items-start gap-4 px-6 pt-5 pb-3` (no rule under it); title
`font-heading text-base font-semibold text-text`; description
`font-sans text-[13px] text-text-muted`; close `-m-1 rounded-xl p-1
text-text-muted hover:bg-bg-inset … focus-visible:outline-brand`, glyph `size-4`.
Body `px-6 pb-5 font-sans text-sm leading-relaxed text-text-secondary` with
`pt-2` when there is a header, else `pt-5`.
Footer `flex items-center justify-end gap-2 rounded-b-[28px] border-t
border-hairline bg-bg-alt px-6 py-4`.

#### Drawer

Same dialog treatment (`float`, blurred backdrop) plus side classes and the
slide animation. Header `flex items-start gap-4 border-b border-hairline px-5
py-4`; body `flex-1 overflow-y-auto px-5 py-4 font-sans text-sm`; footer
`flex items-center justify-end gap-2 border-t border-hairline bg-bg-alt px-5 py-3.5`.
A drawer is flush to an edge, so it keeps the dialog's own square edge there —
do not round the pinned side.

#### ConfirmDialog

Built on Modal. Icon medallion `flex size-10 shrink-0 items-center justify-center
rounded-full` + `toneSoft`, glyph `size-5`. Title `font-heading text-base
font-semibold`; body `text-[13px] leading-relaxed text-text-secondary`.

#### CommandPalette

Dialog `mx-auto mt-[12vh] mb-auto w-[min(36rem,calc(100vw-2rem))] max-w-none
rounded-[28px] border border-hairline bg-bg p-0 text-text` + `float`.
Search row `flex items-center gap-3 border-b border-hairline px-4`, input
`h-12 … text-sm`. List `max-h-80 overflow-y-auto py-1`. Group label
`px-4 pt-3 pb-1 text-[11px] font-semibold text-text-muted`. Item
`mx-2 rounded-xl px-2.5 py-2 font-sans text-sm`, active → `toneSoft`.
Shortcut hint `text-[11px] text-text-muted`.

#### Dropdown / ContextMenu

`z-50 flex max-h-[min(24rem,80vh)] min-w-48 flex-col overflow-y-auto
rounded-2xl border border-hairline bg-bg py-1 font-sans` + `soft`.

#### MenuItem / MenuSeparator

Item `mx-1 flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-left text-sm
transition-colors duration-100 ease-brand-out focus:outline-none` — inset by
`mx-1` so the rounded highlight floats inside the menu.
`neutral` tone → `text-text-secondary hover:bg-bg-inset focus-visible:bg-bg-inset`;
any other tone → `toneText` + `toneSoftHover`.
Trailing hint `text-[11px] text-text-muted`.
Separator `my-1 h-px bg-hairline`; section label `mt-1 px-3 pt-2 pb-1 font-sans
text-[11px] font-semibold text-text-muted`.

#### Popover

`z-50 flex max-w-xs flex-col gap-2 rounded-2xl border border-hairline bg-bg p-4
font-sans` + `soft`; title `font-heading text-sm font-semibold text-text`.

#### Tooltip

```
pointer-events-none invisible absolute z-50 rounded-xl bg-text px-2 py-1
font-sans text-xs font-medium whitespace-nowrap text-text-inverse opacity-0
{soft} transition-opacity duration-150 ease-brand-out
```

Shown on `group-hover/tt` and `group-focus-within/tt`. Offset **1.5**
(`mb-1.5` / `mt-1.5` / `mr-1.5` / `ml-1.5`). No arrow.

#### ThemeToggle

Segmented form: `inline-flex items-center gap-1 rounded-2xl border
border-hairline bg-bg-inset p-1`; option `inline-flex h-8 items-center gap-1.5
rounded-xl px-2.5 font-sans text-[13px] font-medium`, active →
`bg-bg text-text` + `edge`.
Icon-only form: `inline-flex size-9 items-center justify-center rounded-xl
border border-hairline bg-bg text-text-secondary` + `edge` +
`hover:bg-bg-alt hover:text-text`.

---

## 12. Rules for AI

**Hard invariants — never break these:**

1. Nothing is sharp-cornered. Radius follows the scale in §5.1. The only near-
   square things are the 4px `rounded` micro-affordances (checkbox box, icon
   buttons, chip remove).
2. Elevation comes from `./lift.js` — `edge`, `soft`, `softOnHover`, `float`,
   `lift[tone]`, `liftSm[tone]`. Do **not** write `shadow-xs|sm|md|lg|2xl`
   (the only sanctioned exception already in the code is Sidebar `floating`).
   Do not invent a new `shadow-[…]` by hand.
3. `lift[tone]` is always paired with `active:translate-y-[3px]`. Never one
   without the other.
4. Buttons sink (`translate-y-[3px]` down); cards rise
   (`hover:-translate-y-0.5`). Never the reverse.
5. `font-heading` (Fredoka) is for headings, **Button labels, Badge labels and
   Navbar links — and nothing else.** Running text, form labels, table cells,
   menu items and links are `font-sans`.
6. No `font-mono` anywhere. Use `tabular-nums` for figures.
7. No `dark:` variants. Colour comes from tokens, and the lips are written to
   hold in both themes.
8. No raw hex, no Tailwind palette colours. Only token utilities: `bg-bg`,
   `bg-bg-alt`, `bg-bg-inset`, `border-hairline`, `border-hairline-strong`,
   `text-text`, `text-text-secondary`, `text-text-muted`, `text-text-inverse`,
   and the eight tones.
9. No interpolated class names (`bg-${tone}`). Read `core/tones.ts` and
   `sprout/lift.ts` maps.
10. Base body size is `text-sm`; secondary `text-[13px]`; micro `text-[11px]`.
    Headings are `font-semibold`.
11. Interactive control borders are `border-hairline-strong`; container borders
    are `border-hairline`.
12. Every focusable element carries `{focusRing} {toneRing[tone]}` (or the
    `peer-` pair for `sr-only` inputs).
13. Default `tone` is `'brand'`; default `size` is `'md'`; default `variant` is
    the first listed in its union.
14. Icon boxes come from `./icon.js` (`iconSm|Md|Lg|Xl`).
15. Inline SVG strokes: `stroke-linecap="round"`.

**When adding a new sprout component:**

- Copy the geometry of the nearest existing component in this document.
- Ask: _is it a target?_ → pill + a lip + the press. _Is it a card?_ →
  `rounded-[28px]` + `soft`, and it rises on hover. _Is it a control?_ →
  `rounded-xl` + `edge` + `border-hairline-strong`. _Is it floating?_ →
  `rounded-2xl` + `soft`. _Is it a dialog?_ → `rounded-[28px]` + `float`.
- If you need a new lip, add it to `lift.ts` — never to `theme.css`, and never
  as a one-off arbitrary shadow inside a component.
- Keep the prop surface identical to `matte` and `paper`. The promise of the
  library is: pick a look, get the same component. `src/lib/styles/parity.test.ts`
  enforces this.
- Style-local class-string helpers (`icon.ts`, `lift.ts`) live in the style
  folder, never in `core/` — Tailwind only scans the style folder the app
  installed.
