/**
 * @nqmcreative/ui/core — everything the styles share.
 *
 * Behaviour, not looks: focus containment, keyboard navigation, date maths,
 * file validation, the toast queue. Nothing in here
 * renders anything, and nothing in here knows which style is being used.
 *
 * Styles are free to ignore any of it — but there is no `matte` version of a
 * focus trap, so none of them should have to write one.
 */
export { TONES, focusRing, peerFocusRing, toneBorder, toneBorderLeft, toneBorderSoft, toneFill, toneFocusBorder, toneFocusWithinBorder, focusWithinRing, toneFocusWithinRing, toneHoverBorder, toneHoverText, tonePeerChecked, tonePeerFocus, toneRing, toneSoft, toneSoftHover, toneSolid, toneSolidHover, toneSurface, toneText } from './tones.js';
export type { Tone } from './tones.js';
export { anchored } from './actions/anchor.js';
export type { Placement, AnchorOptions } from './actions/anchor.js';
export { clickOutside, focusTrap, focusable, navigateList, portal } from './actions/dismissable.js';
export type { ClickOutsideOptions, FocusTrapOptions } from './actions/dismissable.js';
export { syncDialog, isBackdropClick } from './dialog.svelte.js';
export { popupTrigger, describeTrigger, menuItems, isTypingTarget, HOVER_GRACE } from './trigger.js';
export type { PopupTriggerOptions } from './trigger.js';
export { ListCursor, groupItems, matchQuery, revealIndex } from './list.svelte.js';
export type { ListItem } from './list.svelte.js';
export { nextSort, sortRows, toggleKey } from './table.js';
export type { TableSort, SortDirection } from './table.js';
export { pageRange } from './pagination.js';
export { sortFiles, matchesAccept, formatSize } from './files.js';
export type { RejectedFile, FileRules } from './files.js';
export { passwordScore } from './password.js';
export { clampToStep, formatGrouped, parseGrouped, percentOf, stepDecimals } from './number.js';
export type { GroupOptions } from './number.js';
export { caretIndex, clearFrom, fillFrom, sanitisePin } from './pin.js';
export type { PinMode } from './pin.js';
export { addTag, splitTags } from './tags.js';
export type { TagRules, TagRejection } from './tags.js';
export { normaliseHex, isDark } from './color.js';
export { MINUTES_IN_DAY, clampTime, formatClock, formatTime, parseTime, stepTime } from './time.js';
export { toISO, fromISO, today, isSameDay, addDays, addMonths, monthGrid, weekdayNames, monthLabel, isOutOfRange, formatISO, parseFormatted } from './date.js';
export type { DateFormat } from './date.js';
export { calendarKeyMove, dateHint } from './calendar.js';
export { toast } from './toast.svelte.js';
export type { Toast, ToastOptions, ToastAction } from './toast.svelte.js';
export { applyTheme, storedTheme, persistTheme, nextTheme } from './theme.svelte.js';
export type { Theme } from './theme.svelte.js';
