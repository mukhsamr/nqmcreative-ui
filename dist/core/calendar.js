/**
 * Keyboard movement inside a month grid.
 *
 * The arrow keys are obvious; Home/End are not — they go to the start and end
 * of the *displayed* week, which depends on whether the grid starts on Monday
 * or Sunday. Returns the day focus should move to, or `null` for a key the
 * grid does not handle.
 */
import { addDays, addMonths } from './date.js';
export function calendarKeyMove(key, focused, weekStart, shiftKey = false) {
    const intoWeek = (focused.getDay() - weekStart + 7) % 7;
    switch (key) {
        case 'ArrowLeft':
            return addDays(focused, -1);
        case 'ArrowRight':
            return addDays(focused, 1);
        case 'ArrowUp':
            return addDays(focused, -7);
        case 'ArrowDown':
            return addDays(focused, 7);
        case 'Home':
            return addDays(focused, -intoWeek);
        case 'End':
            return addDays(focused, 6 - intoWeek);
        case 'PageUp':
            return addMonths(focused, shiftKey ? -12 : -1);
        case 'PageDown':
            return addMonths(focused, shiftKey ? 12 : 1);
        default:
            return null;
    }
}
/** The placeholder a text date field shows for a locale's part order. */
export function dateHint(format) {
    return { dmy: 'DD/MM/YYYY', mdy: 'MM/DD/YYYY', ymd: 'YYYY/MM/DD' }[format];
}
