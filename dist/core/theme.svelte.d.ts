/**
 * Light/dark preference, shared by every style.
 *
 * The classes written here are the ones each style's `theme.css` reads:
 * `.dark` forces dark, `.light` forces light, and neither means "follow the
 * OS". Nothing here knows what a theme looks like — only how it is chosen.
 */
export type Theme = 'light' | 'dark' | 'system';
/** Writes the theme classes `theme.css` reads. Safe to call before mount. */
export declare function applyTheme(theme: Theme): void;
/** The stored choice, or `'system'` when the visitor has never picked one. */
export declare function storedTheme(): Theme;
/** Persists a choice, clearing the key when it goes back to `'system'`. */
export declare function persistTheme(theme: Theme): void;
/** Cycles light → dark → system, the order the one-button toggle uses. */
export declare function nextTheme(theme: Theme): Theme;
