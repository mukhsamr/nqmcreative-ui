/**
 * Date helpers for `Calendar` and `DatePicker`.
 *
 * Dates cross the component boundary as `YYYY-MM-DD` strings, never as `Date`
 * objects: a `Date` is a UTC instant, so `new Date('2026-03-01')` is the last
 * day of February for anyone west of Greenwich. Everything below stays in the
 * viewer's local calendar.
 */
/** `YYYY-MM-DD` for a local date. */
export declare function toISO(date: Date): string;
/** Parses `YYYY-MM-DD` as local midnight. Returns `null` for anything else. */
export declare function fromISO(value: string | undefined | null): Date | null;
export declare function today(): Date;
export declare function isSameDay(a: Date | null, b: Date | null): boolean;
export declare function addDays(date: Date, days: number): Date;
export declare function addMonths(date: Date, months: number): Date;
/**
 * The 42 cells of a month grid: trailing days of the previous month, the month
 * itself, then enough of the next to fill six rows, so the grid never jumps
 * height between months.
 */
export declare function monthGrid(month: Date, weekStart?: 0 | 1): Date[];
/** Localised weekday initials, starting on `weekStart`. */
export declare function weekdayNames(locale: string, weekStart?: 0 | 1): string[];
export declare function monthLabel(month: Date, locale: string): string;
/** `true` when `date` falls outside `min`/`max`, both inclusive and optional. */
export declare function isOutOfRange(date: Date, min?: string, max?: string): boolean;
export type DateFormat = 'dmy' | 'mdy' | 'ymd';
/** Prints `YYYY-MM-DD` in the locale's part order, e.g. `31/12/2026`. */
export declare function formatISO(value: string, format: DateFormat, separator?: string): string;
/**
 * The inverse of `formatISO`, forgiving about separators and single digits.
 * Returns `null` when the text isn't a complete, real date.
 */
export declare function parseFormatted(text: string, format: DateFormat): string | null;
