/**
 * Hex colours for the colour field.
 *
 * Only hex: it is the one notation `<input type="color">` accepts and the one
 * every design tool copies to the clipboard. Anything else the app can convert
 * before it binds.
 */
/**
 * `abc`, `#ABC`, `#aabbcc` → `#aabbcc`. Returns `null` when it is not a hex
 * colour, so a half-typed value can be left alone rather than corrected under
 * the caret.
 *
 * Shorthand is expanded and alpha is dropped: the native swatch understands
 * neither, and a value the swatch cannot show is worse than a rounded one.
 */
export declare function normaliseHex(text: string): string | null;
/**
 * True when a colour is dark enough to want light text on top of it.
 *
 * Rec. 601 luma rather than WCAG relative luminance — the threshold is for
 * picking one of two label colours on a swatch, not for proving a contrast
 * ratio, and this is the version everyone's design tokens are tuned against.
 */
export declare function isDark(hex: string): boolean;
