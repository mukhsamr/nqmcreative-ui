/**
 * Clock times as `HH:MM` strings — the shape `<input type="time">` uses, so a
 * form posts exactly what the browser would have posted.
 *
 * Everything here works in minutes since midnight. A day is 1440 of them, and
 * nothing in this module crosses that boundary: stepping past 23:59 stops
 * there rather than wrapping into a day this module cannot name.
 */
export const MINUTES_IN_DAY = 1440;
/**
 * Reads `9:5`, `09:05`, `0905` or `09:05:30` into minutes since midnight.
 * Returns `null` for anything that is not a time, including 24:00 and 12:60.
 */
export function parseTime(text) {
    const trimmed = text.trim();
    // Digits and colons only: `9a` and `later` are refusals, not a hint that
    // someone meant 09:00. Without this a bare `Number('')` reads as midnight.
    if (!trimmed || !/^[0-9:]+$/.test(trimmed))
        return null;
    const digits = trimmed.replace(/[^0-9]/g, '');
    if (!digits)
        return null;
    let hours;
    let minutes;
    if (trimmed.includes(':')) {
        const [rawHours, rawMinutes = '0'] = trimmed.split(':');
        hours = Number(rawHours);
        minutes = Number(rawMinutes);
    }
    else if (digits.length <= 2) {
        // A bare number is an hour: `9` means 09:00.
        hours = Number(digits);
        minutes = 0;
    }
    else {
        hours = Number(digits.slice(0, digits.length - 2));
        minutes = Number(digits.slice(-2));
    }
    if (!Number.isInteger(hours) || !Number.isInteger(minutes))
        return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59)
        return null;
    return hours * 60 + minutes;
}
/** Minutes since midnight back to `HH:MM`, always four digits and a colon. */
export function formatTime(minutes) {
    const total = Math.max(0, Math.min(MINUTES_IN_DAY - 1, Math.round(minutes)));
    const hours = Math.floor(total / 60);
    return `${String(hours).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
/** Clamps into `min…max` and snaps to the nearest multiple of `step` minutes. */
export function clampTime(minutes, min, max, step = 1) {
    const floor = min ? (parseTime(min) ?? 0) : 0;
    const ceiling = max ? (parseTime(max) ?? MINUTES_IN_DAY - 1) : MINUTES_IN_DAY - 1;
    const snapped = step > 1 ? Math.round(minutes / step) * step : minutes;
    return Math.max(floor, Math.min(ceiling, snapped));
}
/**
 * Moves by whole steps. Stops at the bounds instead of wrapping — a stepper
 * that rolls 23:55 round to 00:00 turns a late meeting into an early one.
 */
export function stepTime(value, direction, step = 1, min, max) {
    const current = parseTime(value) ?? clampTime(0, min, max, step);
    return formatTime(clampTime(current + direction * step, min, max, step));
}
/**
 * `13:05` as the locale writes it — `1:05 PM` in en-US, `13.05` in id-ID.
 *
 * Display only. The bound value stays `HH:MM` whatever this returns, because a
 * localised string is not something a form can post.
 */
export function formatClock(value, locale, hour12) {
    const minutes = parseTime(value);
    if (minutes === null)
        return '';
    const date = new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60);
    return new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12 }).format(date);
}
