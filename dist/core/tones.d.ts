/**
 * Shared tone maps. Every tonal component (Button, Badge, Alert, Progress …)
 * reads from here so a `tone` prop means exactly the same thing everywhere.
 *
 * Class strings are written out in full — Tailwind scans source text, so
 * `bg-${tone}` would never be generated.
 */
export type Tone = 'brand' | 'accent' | 'violet' | 'info' | 'success' | 'warning' | 'danger' | 'neutral';
/** Every tone, in palette order. Handy for docs/preview grids. */
export declare const TONES: Tone[];
/** Filled surface + inverse text. */
export declare const toneSolid: Record<Tone, string>;
/** Hover step for `toneSolid`. */
export declare const toneSolidHover: Record<Tone, string>;
/** Tinted surface + tone-coloured text. */
export declare const toneSoft: Record<Tone, string>;
/** Hover step for `toneSoft`. */
export declare const toneSoftHover: Record<Tone, string>;
/** Text only. */
export declare const toneText: Record<Tone, string>;
/** Strong 1px border in the tone's base colour. */
export declare const toneBorder: Record<Tone, string>;
/** Soft border that reads against `-light` surfaces. */
export declare const toneBorderSoft: Record<Tone, string>;
/** Plain background fill (progress bars, dots, switches). */
export declare const toneFill: Record<Tone, string>;
/** Keyboard focus ring. */
export declare const toneRing: Record<Tone, string>;
/** Base focus-ring geometry, paired with `toneRing`. */
export declare const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-2";
/** Border colour applied while the control itself has focus. */
export declare const toneFocusBorder: Record<Tone, string>;
/** Border colour applied while a descendant has focus (wrapped controls). */
export declare const toneFocusWithinBorder: Record<Tone, string>;
/** Tinted surface only (no text colour) — alerts, callouts, table rows. */
export declare const toneSurface: Record<Tone, string>;
/** Checked/selected state for custom checkbox, radio and switch controls. */
export declare const tonePeerChecked: Record<Tone, string>;
/** Focus ring for the visual box of a control whose real input is `sr-only`. */
export declare const tonePeerFocus: Record<Tone, string>;
/** Base focus-ring geometry for `tonePeerFocus`. */
export declare const peerFocusRing = "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2";
/** Border colour on hover — interactive cards, list rows. */
export declare const toneHoverBorder: Record<Tone, string>;
/** Text colour on hover — links, menu items. */
export declare const toneHoverText: Record<Tone, string>;
/** Left-edge rule only — pairs with a full border without fighting it. */
export declare const toneBorderLeft: Record<Tone, string>;
