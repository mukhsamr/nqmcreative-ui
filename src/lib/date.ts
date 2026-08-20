/**
 * Date helpers for `Calendar` and `DatePicker`.
 *
 * Dates cross the component boundary as `YYYY-MM-DD` strings, never as `Date`
 * objects: a `Date` is a UTC instant, so `new Date('2026-03-01')` is the last
 * day of February for anyone west of Greenwich. Everything below stays in the
 * viewer's local calendar.
 */

/** `YYYY-MM-DD` for a local date. */
export function toISO(date: Date): string {
	const month = `${date.getMonth() + 1}`.padStart(2, '0');
	const day = `${date.getDate()}`.padStart(2, '0');
	return `${date.getFullYear()}-${month}-${day}`;
}

/** Parses `YYYY-MM-DD` as local midnight. Returns `null` for anything else. */
export function fromISO(value: string | undefined | null): Date | null {
	if (!value) return null;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
	if (!match) return null;
	const [, y, m, d] = match;
	const date = new Date(Number(y), Number(m) - 1, Number(d));
	// Rejects 2026-02-31 and friends, which Date would roll forward.
	return date.getMonth() === Number(m) - 1 ? date : null;
}

export function today(): Date {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
	return !!a && !!b && toISO(a) === toISO(b);
}

export function addDays(date: Date, days: number): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function addMonths(date: Date, months: number): Date {
	const target = new Date(date.getFullYear(), date.getMonth() + months, 1);
	const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
	target.setDate(Math.min(date.getDate(), lastDay));
	return target;
}

/**
 * The 42 cells of a month grid: trailing days of the previous month, the month
 * itself, then enough of the next to fill six rows, so the grid never jumps
 * height between months.
 */
export function monthGrid(month: Date, weekStart: 0 | 1 = 1): Date[] {
	const first = new Date(month.getFullYear(), month.getMonth(), 1);
	const offset = (first.getDay() - weekStart + 7) % 7;
	const start = addDays(first, -offset);
	return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/** Localised weekday initials, starting on `weekStart`. */
export function weekdayNames(locale: string, weekStart: 0 | 1 = 1): string[] {
	const format = new Intl.DateTimeFormat(locale, { weekday: 'short' });
	// 2024-01-07 was a Sunday, so this walks a full week in order.
	return Array.from({ length: 7 }, (_, i) =>
		format.format(new Date(2024, 0, 7 + ((i + weekStart) % 7)))
	);
}

export function monthLabel(month: Date, locale: string): string {
	return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);
}

/** `true` when `date` falls outside `min`/`max`, both inclusive and optional. */
export function isOutOfRange(date: Date, min?: string, max?: string): boolean {
	const iso = toISO(date);
	if (min && iso < min) return true;
	if (max && iso > max) return true;
	return false;
}

export type DateFormat = 'dmy' | 'mdy' | 'ymd';

/** Prints `YYYY-MM-DD` in the locale's part order, e.g. `31/12/2026`. */
export function formatISO(value: string, format: DateFormat, separator = '/'): string {
	const date = fromISO(value);
	if (!date) return '';
	const d = `${date.getDate()}`.padStart(2, '0');
	const m = `${date.getMonth() + 1}`.padStart(2, '0');
	const y = `${date.getFullYear()}`;
	if (format === 'ymd') return [y, m, d].join(separator);
	if (format === 'mdy') return [m, d, y].join(separator);
	return [d, m, y].join(separator);
}

/**
 * The inverse of `formatISO`, forgiving about separators and single digits.
 * Returns `null` when the text isn't a complete, real date.
 */
export function parseFormatted(text: string, format: DateFormat): string | null {
	const parts = text
		.trim()
		.split(/[^\d]+/)
		.filter(Boolean);
	if (parts.length !== 3) return null;

	let y: string, m: string, d: string;
	if (format === 'ymd') [y, m, d] = parts;
	else if (format === 'mdy') [m, d, y] = parts;
	else [d, m, y] = parts;

	if (y.length !== 4) return null;
	const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
	return fromISO(iso) ? iso : null;
}
