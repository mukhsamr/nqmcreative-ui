/**
 * The logic every style shares. These run without a DOM and without mounting
 * anything, which is the point: if a rule lives here, no style can get it
 * wrong, and no style needs its own test for it.
 */
import { describe, expect, it } from 'vitest';
import { formatSize, matchesAccept, sortFiles } from './files.js';
import { nextSort, sortRows, toggleKey } from './table.js';
import { pageRange } from './pagination.js';
import { passwordScore } from './password.js';
import { groupItems, matchQuery, type ListItem } from './list.svelte.js';
import { clampToStep, percentOf, stepDecimals } from './number.js';
import { calendarKeyMove, dateHint } from './calendar.js';
import { toISO } from './date.js';

const KB = 1024;
const MB = 1024 * KB;
const file = (name: string, type = '', size = 10) =>
	new File([new Uint8Array(size)], name, { type });

describe('matchesAccept', () => {
	it('takes anything with no rule', () => {
		expect(matchesAccept(file('a.xyz'), undefined)).toBe(true);
	});

	it('matches a wildcard MIME family', () => {
		expect(matchesAccept(file('a.png', 'image/png'), 'image/*')).toBe(true);
		expect(matchesAccept(file('a.txt', 'text/plain'), 'image/*')).toBe(false);
	});

	it('matches a bare extension regardless of MIME', () => {
		expect(matchesAccept(file('brief.pdf', ''), '.pdf')).toBe(true);
	});

	it('matches an exact MIME type', () => {
		expect(matchesAccept(file('a.pdf', 'application/pdf'), 'application/pdf')).toBe(true);
	});

	it('is case-insensitive about the rule', () => {
		expect(matchesAccept(file('A.PNG', 'image/png'), '.png')).toBe(true);
	});
});

describe('sortFiles', () => {
	it('reports the first rule a file breaks, not every one', () => {
		const { rejected } = sortFiles([file('big.txt', 'text/plain', 2 * MB)], {
			accept: 'image/*',
			maxSize: 1 * MB
		});
		// Wrong type *and* too big — type is checked first.
		expect(rejected[0].reason).toBe('type');
	});

	it('counts files already held against maxFiles', () => {
		const { accepted, rejected } = sortFiles([file('b.png'), file('c.png')], {
			maxFiles: 2,
			held: 1
		});
		expect(accepted).toHaveLength(1);
		expect(rejected[0].reason).toBe('count');
	});

	it('stops after one file when multiple is off', () => {
		const { accepted } = sortFiles([file('a.png'), file('b.png')], { multiple: false });
		expect(accepted).toHaveLength(1);
	});

	it('accepts a file exactly on the size limit', () => {
		const { accepted } = sortFiles([file('edge.png', 'image/png', 1 * KB)], { maxSize: 1 * KB });
		expect(accepted).toHaveLength(1);
	});

	it('returns empty lists for a null drop', () => {
		expect(sortFiles(null)).toEqual({ accepted: [], rejected: [] });
	});
});

describe('formatSize', () => {
	const units = ['B', 'KB', 'MB', 'GB'];

	it('leaves bytes alone', () => {
		expect(formatSize(900, units)).toBe('900 B');
	});

	it('climbs units and drops the decimal on whole numbers', () => {
		expect(formatSize(2 * MB, units)).toBe('2 MB');
	});

	it('keeps one decimal below 10', () => {
		expect(formatSize(1.5 * KB, units)).toBe('1.5 KB');
	});

	it('stops at the largest unit it was given', () => {
		expect(formatSize(5 * 1024 * MB, units)).toBe('5 GB');
	});
});

describe('nextSort', () => {
	it('cycles ascending → descending → unsorted', () => {
		expect(nextSort(null, 'a')).toEqual({ key: 'a', direction: 'asc' });
		expect(nextSort({ key: 'a', direction: 'asc' }, 'a')).toEqual({ key: 'a', direction: 'desc' });
		expect(nextSort({ key: 'a', direction: 'desc' }, 'a')).toBeNull();
	});

	it('restarts at ascending on a different column', () => {
		expect(nextSort({ key: 'a', direction: 'desc' }, 'b')).toEqual({ key: 'b', direction: 'asc' });
	});
});

describe('sortRows', () => {
	const rows = [
		{ n: 84, s: 'b' },
		{ n: 9, s: 'a' },
		{ n: 120, s: 'c' }
	];

	it('returns the rows untouched with no sort', () => {
		expect(sortRows(rows, null)).toBe(rows);
	});

	it('compares numbers numerically', () => {
		expect(sortRows(rows, { key: 'n', direction: 'asc' }).map((r) => r.n)).toEqual([9, 84, 120]);
	});

	it('sorts strings naturally', () => {
		const natural = [{ s: 'item 10' }, { s: 'item 2' }];
		expect(sortRows(natural, { key: 's', direction: 'asc' }).map((r) => r.s)).toEqual([
			'item 2',
			'item 10'
		]);
	});

	it('sinks nullish values whichever way round', () => {
		const withGap = [{ n: 2 }, { n: null }, { n: 1 }];
		expect(sortRows(withGap, { key: 'n', direction: 'asc' }).map((r) => r.n)).toEqual([1, 2, null]);
		expect(sortRows(withGap, { key: 'n', direction: 'desc' }).map((r) => r.n)).toEqual([
			2,
			1,
			null
		]);
	});

	it('does not mutate the input', () => {
		const original = [...rows];
		sortRows(rows, { key: 'n', direction: 'desc' });
		expect(rows).toEqual(original);
	});
});

describe('toggleKey', () => {
	it('adds at the end and removes in place', () => {
		expect(toggleKey(['a'], 'b')).toEqual(['a', 'b']);
		expect(toggleKey(['a', 'b'], 'a')).toEqual(['b']);
	});
});

describe('pageRange', () => {
	it('lists every page while the run is short', () => {
		expect(pageRange(1, 6)).toEqual([1, 2, 3, 4, 5, 6]);
	});

	it('collapses the far side only', () => {
		expect(pageRange(2, 20)).toEqual([1, 2, 3, '…', 20]);
		expect(pageRange(19, 20)).toEqual([1, '…', 18, 19, 20]);
	});

	it('collapses both sides in the middle', () => {
		expect(pageRange(10, 20)).toEqual([1, '…', 9, 10, 11, '…', 20]);
	});

	it('widens with more siblings', () => {
		expect(pageRange(10, 20, 2)).toEqual([1, '…', 8, 9, 10, 11, 12, '…', 20]);
	});

	it('always keeps the first and last page', () => {
		for (const page of [1, 5, 10, 15, 20]) {
			const range = pageRange(page, 20);
			expect(range[0]).toBe(1);
			expect(range.at(-1)).toBe(20);
		}
	});
});

describe('passwordScore', () => {
	it('is zero for nothing typed', () => {
		expect(passwordScore('')).toBe(0);
	});

	it('rewards length and variety, capped at four', () => {
		expect(passwordScore('abc')).toBe(0);
		expect(passwordScore('abcdefgh')).toBe(1);
		expect(passwordScore('Abcdefgh1!')).toBe(4);
		expect(passwordScore('Abcdefghijkl1!@#')).toBe(4);
	});
});

describe('matchQuery', () => {
	const items = [{ label: 'Alpha' }, { label: 'Beta' }];

	it('returns everything for a blank query', () => {
		expect(matchQuery(items, '   ', (i) => i.label)).toBe(items);
	});

	it('matches case-insensitively on the chosen fields', () => {
		expect(matchQuery(items, 'ALP', (i) => i.label)).toEqual([{ label: 'Alpha' }]);
	});
});

describe('groupItems', () => {
	interface Row extends ListItem {
		id: number;
	}

	it('keeps first-seen order for groups and their members', () => {
		const rows: Row[] = [
			{ group: 'b', id: 1 },
			{ group: 'a', id: 2 },
			{ group: 'b', id: 3 }
		];
		expect(groupItems(rows).map(([name, items]) => [name, items.map((i) => i.id)])).toEqual([
			['b', [1, 3]],
			['a', [2]]
		]);
	});

	it('files ungrouped items under an empty key', () => {
		const rows: Row[] = [{ id: 1 }];
		expect(groupItems(rows)[0][0]).toBe('');
	});
});

describe('numbers', () => {
	it('reads the precision off the step', () => {
		expect(stepDecimals(1)).toBe(0);
		expect(stepDecimals(0.25)).toBe(2);
	});

	it('clamps into range at the step precision', () => {
		expect(clampToStep(11, 0, 10, 1)).toBe(10);
		expect(clampToStep(-1, 0, 10, 1)).toBe(0);
		expect(clampToStep(0.1 + 0.2, 0, 1, 0.1)).toBe(0.3);
	});

	it('falls back to the minimum for NaN', () => {
		expect(clampToStep(NaN, 5, 10, 1)).toBe(5);
		expect(clampToStep(NaN, -Infinity, 10, 1)).toBe(0);
	});

	it('reports position as a clamped percentage', () => {
		expect(percentOf(5, 0, 10)).toBe(50);
		expect(percentOf(-5, 0, 10)).toBe(0);
		expect(percentOf(50, 0, 0)).toBe(0);
	});
});

describe('calendarKeyMove', () => {
	// 2026-03-12 is a Thursday.
	const thursday = new Date(2026, 2, 12);

	it('walks days and weeks', () => {
		expect(toISO(calendarKeyMove('ArrowRight', thursday, 1)!)).toBe('2026-03-13');
		expect(toISO(calendarKeyMove('ArrowDown', thursday, 1)!)).toBe('2026-03-19');
	});

	it('sends Home and End to the edges of the displayed week', () => {
		// Monday-first: back to the 9th, forward to the 15th.
		expect(toISO(calendarKeyMove('Home', thursday, 1)!)).toBe('2026-03-09');
		expect(toISO(calendarKeyMove('End', thursday, 1)!)).toBe('2026-03-15');
		// Sunday-first shifts both by one.
		expect(toISO(calendarKeyMove('Home', thursday, 0)!)).toBe('2026-03-08');
		expect(toISO(calendarKeyMove('End', thursday, 0)!)).toBe('2026-03-14');
	});

	it('pages by month, or by year with shift', () => {
		expect(toISO(calendarKeyMove('PageDown', thursday, 1)!)).toBe('2026-04-12');
		expect(toISO(calendarKeyMove('PageUp', thursday, 1, true)!)).toBe('2025-03-12');
	});

	it('returns null for a key the grid does not own', () => {
		expect(calendarKeyMove('Enter', thursday, 1)).toBeNull();
	});
});

describe('dateHint', () => {
	it('spells the placeholder in the locale part order', () => {
		expect(dateHint('dmy')).toBe('DD/MM/YYYY');
		expect(dateHint('mdy')).toBe('MM/DD/YYYY');
		expect(dateHint('ymd')).toBe('YYYY/MM/DD');
	});
});
