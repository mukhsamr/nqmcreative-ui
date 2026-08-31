/**
 * Clock times as `HH:MM` strings — the shape `<input type="time">` uses, so a
 * form posts exactly what the browser would have posted.
 *
 * Everything here works in minutes since midnight. A day is 1440 of them, and
 * nothing in this module crosses that boundary: stepping past 23:59 stops
 * there rather than wrapping into a day this module cannot name.
 */
export declare const MINUTES_IN_DAY = 1440;
/**
 * Reads `9:5`, `09:05`, `0905` or `09:05:30` into minutes since midnight.
 * Returns `null` for anything that is not a time, including 24:00 and 12:60.
 */
export declare function parseTime(text: string): number | null;
/** Minutes since midnight back to `HH:MM`, always four digits and a colon. */
export declare function formatTime(minutes: number): string;
/** Clamps into `min…max` and snaps to the nearest multiple of `step` minutes. */
export declare function clampTime(minutes: number, min?: string, max?: string, step?: number): number;
/**
 * Moves by whole steps. Stops at the bounds instead of wrapping — a stepper
 * that rolls 23:55 round to 00:00 turns a late meeting into an early one.
 */
export declare function stepTime(value: string, direction: 1 | -1, step?: number, min?: string, max?: string): string;
/**
 * `13:05` as the locale writes it — `1:05 PM` in en-US, `13.05` in id-ID.
 *
 * Display only. The bound value stays `HH:MM` whatever this returns, because a
 * localised string is not something a form can post.
 */
export declare function formatClock(value: string, locale: string, hour12?: boolean): string;
