/**
 * Shared tone maps. Every tonal component (Button, Badge, Alert, Progress …)
 * reads from here so a `tone` prop means exactly the same thing everywhere.
 *
 * Class strings are written out in full — Tailwind scans source text, so
 * `bg-${tone}` would never be generated.
 */
/** Every tone, in palette order. Handy for docs/preview grids. */
export const TONES = [
    'brand',
    'accent',
    'violet',
    'info',
    'success',
    'warning',
    'danger',
    'neutral'
];
/** Filled surface + inverse text. */
export const toneSolid = {
    brand: 'bg-brand text-text-inverse',
    accent: 'bg-accent text-text-inverse',
    violet: 'bg-violet text-text-inverse',
    info: 'bg-info text-text-inverse',
    success: 'bg-success text-text-inverse',
    warning: 'bg-warning text-text-inverse',
    danger: 'bg-danger text-text-inverse',
    neutral: 'bg-neutral text-text-inverse'
};
/** Hover step for `toneSolid`. */
export const toneSolidHover = {
    brand: 'hover:bg-brand-hover',
    accent: 'hover:bg-accent-hover',
    violet: 'hover:bg-violet-hover',
    info: 'hover:bg-info-hover',
    success: 'hover:bg-success-hover',
    warning: 'hover:bg-warning-hover',
    danger: 'hover:bg-danger-hover',
    neutral: 'hover:bg-neutral-hover'
};
/** Tinted surface + tone-coloured text. */
export const toneSoft = {
    brand: 'bg-brand-light text-brand',
    accent: 'bg-accent-light text-accent',
    violet: 'bg-violet-light text-violet',
    info: 'bg-info-light text-info',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
    neutral: 'bg-neutral-light text-text-secondary'
};
/** Hover step for `toneSoft`. */
export const toneSoftHover = {
    brand: 'hover:bg-brand-border/50',
    accent: 'hover:bg-accent-border/50',
    violet: 'hover:bg-violet-border/50',
    info: 'hover:bg-info-border/50',
    success: 'hover:bg-success-border/50',
    warning: 'hover:bg-warning-border/50',
    danger: 'hover:bg-danger-border/50',
    neutral: 'hover:bg-neutral-border/50'
};
/** Text only. */
export const toneText = {
    brand: 'text-brand',
    accent: 'text-accent',
    violet: 'text-violet',
    info: 'text-info',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    neutral: 'text-text-secondary'
};
/** Strong 1px border in the tone's base colour. */
export const toneBorder = {
    brand: 'border-brand',
    accent: 'border-accent',
    violet: 'border-violet',
    info: 'border-info',
    success: 'border-success',
    warning: 'border-warning',
    danger: 'border-danger',
    neutral: 'border-neutral'
};
/** Soft border that reads against `-light` surfaces. */
export const toneBorderSoft = {
    brand: 'border-brand-border',
    accent: 'border-accent-border',
    violet: 'border-violet-border',
    info: 'border-info-border',
    success: 'border-success-border',
    warning: 'border-warning-border',
    danger: 'border-danger-border',
    neutral: 'border-neutral-border'
};
/** Plain background fill (progress bars, dots, switches). */
export const toneFill = {
    brand: 'bg-brand',
    accent: 'bg-accent',
    violet: 'bg-violet',
    info: 'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
    neutral: 'bg-neutral'
};
/** Keyboard focus ring. */
export const toneRing = {
    brand: 'focus-visible:outline-brand',
    accent: 'focus-visible:outline-accent',
    violet: 'focus-visible:outline-violet',
    info: 'focus-visible:outline-info',
    success: 'focus-visible:outline-success',
    warning: 'focus-visible:outline-warning',
    danger: 'focus-visible:outline-danger',
    neutral: 'focus-visible:outline-neutral'
};
/** Base focus-ring geometry, paired with `toneRing`. */
export const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2';
/** Border colour applied while the control itself has focus. */
export const toneFocusBorder = {
    brand: 'focus:border-brand',
    accent: 'focus:border-accent',
    violet: 'focus:border-violet',
    info: 'focus:border-info',
    success: 'focus:border-success',
    warning: 'focus:border-warning',
    danger: 'focus:border-danger',
    neutral: 'focus:border-neutral'
};
/**
 * Focus-ring geometry for a shell that holds the real control — `Input`'s
 * wrapper, an input group. The ring belongs on the box the reader sees, not on
 * the bare `<input>` inside it, so it is keyed off a focused descendant.
 * `:has(:focus-visible)` rather than `:focus-within` so a pointer click into a
 * field does not draw a keyboard affordance.
 */
export const focusWithinRing = 'has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2';
/** Ring colour for `focusWithinRing`. */
export const toneFocusWithinRing = {
    brand: 'has-[:focus-visible]:outline-brand',
    accent: 'has-[:focus-visible]:outline-accent',
    violet: 'has-[:focus-visible]:outline-violet',
    info: 'has-[:focus-visible]:outline-info',
    success: 'has-[:focus-visible]:outline-success',
    warning: 'has-[:focus-visible]:outline-warning',
    danger: 'has-[:focus-visible]:outline-danger',
    neutral: 'has-[:focus-visible]:outline-neutral'
};
/** Border colour applied while a descendant has focus (wrapped controls). */
export const toneFocusWithinBorder = {
    brand: 'focus-within:border-brand',
    accent: 'focus-within:border-accent',
    violet: 'focus-within:border-violet',
    info: 'focus-within:border-info',
    success: 'focus-within:border-success',
    warning: 'focus-within:border-warning',
    danger: 'focus-within:border-danger',
    neutral: 'focus-within:border-neutral'
};
/** Tinted surface only (no text colour) — alerts, callouts, table rows. */
export const toneSurface = {
    brand: 'bg-brand-light',
    accent: 'bg-accent-light',
    violet: 'bg-violet-light',
    info: 'bg-info-light',
    success: 'bg-success-light',
    warning: 'bg-warning-light',
    danger: 'bg-danger-light',
    neutral: 'bg-neutral-light'
};
/** Checked/selected state for custom checkbox, radio and switch controls. */
export const tonePeerChecked = {
    brand: 'peer-checked:border-brand peer-checked:bg-brand',
    accent: 'peer-checked:border-accent peer-checked:bg-accent',
    violet: 'peer-checked:border-violet peer-checked:bg-violet',
    info: 'peer-checked:border-info peer-checked:bg-info',
    success: 'peer-checked:border-success peer-checked:bg-success',
    warning: 'peer-checked:border-warning peer-checked:bg-warning',
    danger: 'peer-checked:border-danger peer-checked:bg-danger',
    neutral: 'peer-checked:border-neutral peer-checked:bg-neutral'
};
/** Focus ring for the visual box of a control whose real input is `sr-only`. */
export const tonePeerFocus = {
    brand: 'peer-focus-visible:outline-brand',
    accent: 'peer-focus-visible:outline-accent',
    violet: 'peer-focus-visible:outline-violet',
    info: 'peer-focus-visible:outline-info',
    success: 'peer-focus-visible:outline-success',
    warning: 'peer-focus-visible:outline-warning',
    danger: 'peer-focus-visible:outline-danger',
    neutral: 'peer-focus-visible:outline-neutral'
};
/** Base focus-ring geometry for `tonePeerFocus`. */
export const peerFocusRing = 'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2';
/** Border colour on hover — interactive cards, list rows. */
export const toneHoverBorder = {
    brand: 'hover:border-brand',
    accent: 'hover:border-accent',
    violet: 'hover:border-violet',
    info: 'hover:border-info',
    success: 'hover:border-success',
    warning: 'hover:border-warning',
    danger: 'hover:border-danger',
    neutral: 'hover:border-neutral'
};
/** Text colour on hover — links, menu items. */
export const toneHoverText = {
    brand: 'hover:text-brand',
    accent: 'hover:text-accent',
    violet: 'hover:text-violet',
    info: 'hover:text-info',
    success: 'hover:text-success',
    warning: 'hover:text-warning',
    danger: 'hover:text-danger',
    neutral: 'hover:text-text'
};
/** Left-edge rule only — pairs with a full border without fighting it. */
export const toneBorderLeft = {
    brand: 'border-l-brand',
    accent: 'border-l-accent',
    violet: 'border-l-violet',
    info: 'border-l-info',
    success: 'border-l-success',
    warning: 'border-l-warning',
    danger: 'border-l-danger',
    neutral: 'border-l-neutral'
};
