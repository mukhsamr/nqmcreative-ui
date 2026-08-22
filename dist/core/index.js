/**
 * @nqmcreative/ui/core — everything the styles share.
 *
 * Behaviour, not looks: focus containment, keyboard navigation, date maths,
 * file validation, the toast queue, the locale strings. Nothing in here
 * renders anything, and nothing in here knows which style is being used.
 *
 * Styles are free to ignore any of it — but there is no `matte` version of a
 * focus trap, so none of them should have to write one.
 */
/* --- tones --- */
export { TONES, focusRing, peerFocusRing, toneBorder, toneBorderLeft, toneBorderSoft, toneFill, toneFocusBorder, toneFocusWithinBorder, toneHoverBorder, toneHoverText, tonePeerChecked, tonePeerFocus, toneRing, toneSoft, toneSoftHover, toneSolid, toneSolidHover, toneSurface, toneText } from './tones.js';
/* --- actions --- */
export { anchored } from './actions/anchor.js';
export { clickOutside, focusTrap, focusable, navigateList, portal } from './actions/dismissable.js';
/* --- overlays --- */
export { syncDialog, isBackdropClick } from './dialog.svelte.js';
export { popupTrigger, describeTrigger, menuItems, HOVER_GRACE } from './trigger.js';
/* --- lists --- */
export { ListCursor, groupItems, matchQuery, revealIndex } from './list.svelte.js';
/* --- data --- */
export { nextSort, sortRows, toggleKey } from './table.js';
export { pageRange } from './pagination.js';
export { sortFiles, matchesAccept, formatSize } from './files.js';
export { passwordScore } from './password.js';
export { clampToStep, percentOf, stepDecimals } from './number.js';
/* --- dates --- */
export { toISO, fromISO, today, isSameDay, addDays, addMonths, monthGrid, weekdayNames, monthLabel, isOutOfRange, formatISO, parseFormatted } from './date.js';
export { calendarKeyMove, dateHint } from './calendar.js';
/* --- toast --- */
export { toast } from './toast.svelte.js';
/* --- theme --- */
export { applyTheme, storedTheme, persistTheme, nextTheme } from './theme.svelte.js';
/* --- locale --- */
export { locale, setLocale, provideLocale, useLocale, enUS, idID, LocaleStore } from './locale.svelte.js';
