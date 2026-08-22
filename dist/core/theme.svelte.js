/**
 * Light/dark preference, shared by every style.
 *
 * The classes written here are the ones each style's `theme.css` reads:
 * `.dark` forces dark, `.light` forces light, and neither means "follow the
 * OS". Nothing here knows what a theme looks like — only how it is chosen.
 */
const STORAGE_KEY = 'nqm-theme';
/** Writes the theme classes `theme.css` reads. Safe to call before mount. */
export function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme === 'light');
}
/** The stored choice, or `'system'` when the visitor has never picked one. */
export function storedTheme() {
    if (typeof localStorage === 'undefined')
        return 'system';
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'light' || saved === 'dark' ? saved : 'system';
}
/** Persists a choice, clearing the key when it goes back to `'system'`. */
export function persistTheme(theme) {
    if (typeof localStorage === 'undefined')
        return;
    if (theme === 'system')
        localStorage.removeItem(STORAGE_KEY);
    else
        localStorage.setItem(STORAGE_KEY, theme);
}
/** Cycles light → dark → system, the order the one-button toggle uses. */
export function nextTheme(theme) {
    return theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
}
