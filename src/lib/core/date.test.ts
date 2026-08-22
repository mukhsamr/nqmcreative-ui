import { describe, expect, it } from 'vitest';
import {
	addDays,
	addMonths,
	formatISO,
	fromISO,
	isOutOfRange,
	isSameDay,
	monthGrid,
	parseFormatted,
	toISO
} from './date.js';

describe('fromISO / toISO', () => {
	it('round-trips a date without shifting across the timezone', () => {
		// The bug this guards: `new Date('2026-03-01')` is a UTC instant, which is
		// 28 February for anyone west of Greenwich.
		expect(toISO(fromISO('2026-03-01')!)).toBe('2026-03-01');
		expect(fromISO('2026-03-01')!.getDate()).toBe(1);
		expect(fromISO('2026-03-01')!.getMonth()).toBe(2);
	});

	it('rejects dates that do not exist instead of rolling them forward', () => {
		expect(fromISO('2026-02-31')).toBeNull();
		expect(fromISO('2026-13-01')).toBeNull();
		expect(fromISO('2025-02-29')).toBeNull();
	});

	it('accepts a real leap day', () => {
		expect(toISO(fromISO('2024-02-29')!)).toBe('2024-02-29');
	});

	it('rejects malformed input', () => {
		for (const value of ['', '2026-3-1', '01/03/2026', 'today', undefined, null]) {
			expect(fromISO(value)).toBeNull();
		}
	});
});

describe('addDays / addMonths', () => {
	it('crosses a month boundary', () => {
		expect(toISO(addDays(fromISO('2026-01-31')!, 1))).toBe('2026-02-01');
	});

	it('crosses a DST boundary without losing a day', () => {
		// 29 March 2026 is the European spring-forward.
		expect(toISO(addDays(fromISO('2026-03-28')!, 1))).toBe('2026-03-29');
		expect(toISO(addDays(fromISO('2026-03-29')!, 1))).toBe('2026-03-30');
	});

	it('clamps to the last day when the target month is shorter', () => {
		expect(toISO(addMonths(fromISO('2026-01-31')!, 1))).toBe('2026-02-28');
		expect(toISO(addMonths(fromISO('2024-01-31')!, 1))).toBe('2024-02-29');
		expect(toISO(addMonths(fromISO('2026-03-31')!, -1))).toBe('2026-02-28');
	});
});

describe('monthGrid', () => {
	it('always returns six full weeks, so the grid never changes height', () => {
		for (const month of ['2026-02-01', '2026-08-01', '2027-01-01']) {
			expect(monthGrid(fromISO(month)!)).toHaveLength(42);
		}
	});

	it('starts on the requested weekday', () => {
		const monday = monthGrid(fromISO('2026-08-01')!, 1);
		expect(monday[0].getDay()).toBe(1);

		const sunday = monthGrid(fromISO('2026-08-01')!, 0);
		expect(sunday[0].getDay()).toBe(0);
	});

	it('pads with the neighbouring months and contains every day of this one', () => {
		const grid = monthGrid(fromISO('2026-08-01')!, 1);
		const inMonth = grid.filter((d) => d.getMonth() === 7);
		expect(inMonth).toHaveLength(31);
		expect(toISO(inMonth[0])).toBe('2026-08-01');
		expect(toISO(inMonth[30])).toBe('2026-08-31');
	});
});

describe('isSameDay / isOutOfRange', () => {
	it('compares by calendar day', () => {
		expect(isSameDay(fromISO('2026-08-15'), fromISO('2026-08-15'))).toBe(true);
		expect(isSameDay(fromISO('2026-08-15'), fromISO('2026-08-16'))).toBe(false);
		expect(isSameDay(null, fromISO('2026-08-15'))).toBe(false);
	});

	it('treats min and max as inclusive', () => {
		const day = fromISO('2026-08-15')!;
		expect(isOutOfRange(day, '2026-08-15', '2026-08-15')).toBe(false);
		expect(isOutOfRange(day, '2026-08-16')).toBe(true);
		expect(isOutOfRange(day, undefined, '2026-08-14')).toBe(true);
		expect(isOutOfRange(day)).toBe(false);
	});
});

describe('formatISO / parseFormatted', () => {
	it('prints each locale order', () => {
		expect(formatISO('2026-08-15', 'dmy')).toBe('15/08/2026');
		expect(formatISO('2026-08-15', 'mdy')).toBe('08/15/2026');
		expect(formatISO('2026-08-15', 'ymd')).toBe('2026/08/15');
	});

	it('prints nothing for an invalid value rather than throwing', () => {
		expect(formatISO('', 'dmy')).toBe('');
		expect(formatISO('2026-02-31', 'dmy')).toBe('');
	});

	it('round-trips through every format', () => {
		for (const format of ['dmy', 'mdy', 'ymd'] as const) {
			expect(parseFormatted(formatISO('2026-08-15', format), format)).toBe('2026-08-15');
		}
	});

	it('is forgiving about separators and single digits', () => {
		expect(parseFormatted('5-3-2026', 'dmy')).toBe('2026-03-05');
		expect(parseFormatted('5.3.2026', 'dmy')).toBe('2026-03-05');
		expect(parseFormatted(' 5 3 2026 ', 'dmy')).toBe('2026-03-05');
	});

	it('reads the same digits differently per format', () => {
		expect(parseFormatted('03/09/2026', 'dmy')).toBe('2026-09-03');
		expect(parseFormatted('03/09/2026', 'mdy')).toBe('2026-03-09');
	});

	it('returns null for incomplete or impossible dates', () => {
		expect(parseFormatted('15/08', 'dmy')).toBeNull();
		expect(parseFormatted('31/02/2026', 'dmy')).toBeNull();
		expect(parseFormatted('15/08/26', 'dmy')).toBeNull();
		expect(parseFormatted('', 'dmy')).toBeNull();
	});
});
