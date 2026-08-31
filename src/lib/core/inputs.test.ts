/**
 * The logic behind the newer input components — code boxes, tokens, clock
 * times, hex colours and grouped numbers.
 *
 * Same reasoning as `core.test.ts`: a rule proved here cannot be got wrong by
 * a style, so none of the three needs its own copy of these cases.
 */
import { describe, expect, it } from 'vitest';
import { caretIndex, clearFrom, fillFrom, sanitisePin } from './pin.js';
import { addTag, splitTags } from './tags.js';
import { clampTime, formatClock, formatTime, parseTime, stepTime } from './time.js';
import { isDark, normaliseHex } from './color.js';
import { formatGrouped, parseGrouped } from './number.js';

describe('sanitisePin', () => {
	it('keeps only digits in numeric mode', () => {
		expect(sanitisePin('1a2-3', 'numeric')).toBe('123');
	});

	it('keeps letters too in alphanumeric mode', () => {
		expect(sanitisePin('a1 b2!', 'alphanumeric')).toBe('a1b2');
	});

	it('trims to the length asked for', () => {
		expect(sanitisePin('123456789', 'numeric', 4)).toBe('1234');
	});
});

describe('fillFrom', () => {
	it('replaces one box and leaves the tail alone', () => {
		expect(fillFrom('1234', 1, '9', 6)).toBe('1934');
	});

	it('spreads a paste across the boxes that follow', () => {
		expect(fillFrom('', 0, '123456', 6)).toBe('123456');
	});

	it('drops whatever runs past the last box', () => {
		expect(fillFrom('12', 2, '99999', 4)).toBe('1299');
	});

	it('ignores a paste with nothing the mode accepts', () => {
		expect(fillFrom('12', 2, 'abc', 6, 'numeric')).toBe('12');
	});

	it('never leaves a hole in the middle', () => {
		// Writing past the end is clamped by the component, but the value stays
		// compact either way — a hole would break `value.length` as a count.
		expect(fillFrom('12', 1, '7', 6)).toBe('17');
	});
});

describe('clearFrom and caretIndex', () => {
	it('clears the box and everything after it', () => {
		expect(clearFrom('12345', 2)).toBe('12');
	});

	it('puts the caret on the first empty box', () => {
		expect(caretIndex('123', 6)).toBe(3);
	});

	it('stops at the last box once the code is full', () => {
		expect(caretIndex('123456', 6)).toBe(5);
	});
});

describe('addTag', () => {
	it('appends a trimmed tag', () => {
		expect(addTag([], '  svelte  ').tags).toEqual(['svelte']);
	});

	it('collapses inner whitespace', () => {
		expect(addTag([], 'design   system').tags).toEqual(['design system']);
	});

	it('refuses an empty commit', () => {
		expect(addTag(['a'], '   ')).toEqual({ tags: ['a'], rejected: 'empty' });
	});

	it('refuses a duplicate, ignoring case by default', () => {
		expect(addTag(['Svelte'], 'svelte').rejected).toBe('duplicate');
	});

	it('allows a case difference when asked to', () => {
		expect(addTag(['Svelte'], 'svelte', { caseInsensitive: false }).tags).toEqual([
			'Svelte',
			'svelte'
		]);
	});

	it('refuses anything shorter than minLength', () => {
		expect(addTag([], 'ab', { minLength: 3 }).rejected).toBe('short');
	});

	it('refuses once the cap is reached', () => {
		expect(addTag(['a', 'b'], 'c', { max: 2 }).rejected).toBe('full');
	});

	it('judges duplicates before the cap', () => {
		expect(addTag(['a', 'b'], 'a', { max: 2 }).rejected).toBe('duplicate');
	});

	it('leaves the original array untouched', () => {
		const tags = ['a'];
		addTag(tags, 'b');
		expect(tags).toEqual(['a']);
	});
});

describe('splitTags', () => {
	it('splits on the separators and drops the empties', () => {
		expect(splitTags('a, b,,c ')).toEqual(['a', 'b', 'c']);
	});

	it('always splits on newlines and tabs', () => {
		expect(splitTags('a\nb\tc')).toEqual(['a', 'b', 'c']);
	});

	it('treats a regex metacharacter as a plain separator', () => {
		expect(splitTags('a|b|c', ['|'])).toEqual(['a', 'b', 'c']);
	});

	it('returns one tag when nothing separates it', () => {
		expect(splitTags('one tag')).toEqual(['one tag']);
	});
});

describe('parseTime', () => {
	it('reads a padded time', () => {
		expect(parseTime('09:05')).toBe(545);
	});

	it('reads an unpadded one', () => {
		expect(parseTime('9:5')).toBe(545);
	});

	it('reads four bare digits', () => {
		expect(parseTime('0905')).toBe(545);
	});

	it('reads a bare hour as the top of it', () => {
		expect(parseTime('9')).toBe(540);
	});

	it('ignores anything past the minutes', () => {
		expect(parseTime('09:05:30')).toBe(545);
	});

	it('refuses an hour or minute out of range', () => {
		expect(parseTime('24:00')).toBeNull();
		expect(parseTime('12:60')).toBeNull();
	});

	it('refuses text and empty input', () => {
		expect(parseTime('later')).toBeNull();
		expect(parseTime('  ')).toBeNull();
	});
});

describe('formatTime and clampTime', () => {
	it('always pads to HH:MM', () => {
		expect(formatTime(545)).toBe('09:05');
		expect(formatTime(0)).toBe('00:00');
	});

	it('never leaves the day', () => {
		expect(formatTime(5000)).toBe('23:59');
		expect(formatTime(-30)).toBe('00:00');
	});

	it('clamps into the bounds', () => {
		expect(formatTime(clampTime(parseTime('07:00')!, '08:00', '17:00'))).toBe('08:00');
		expect(formatTime(clampTime(parseTime('19:00')!, '08:00', '17:00'))).toBe('17:00');
	});

	it('snaps to the step', () => {
		expect(formatTime(clampTime(parseTime('09:07')!, undefined, undefined, 15))).toBe('09:00');
		expect(formatTime(clampTime(parseTime('09:08')!, undefined, undefined, 15))).toBe('09:15');
	});
});

describe('stepTime', () => {
	it('moves by one step', () => {
		expect(stepTime('09:00', 1, 15)).toBe('09:15');
		expect(stepTime('09:00', -1, 15)).toBe('08:45');
	});

	it('stops at the bounds rather than wrapping', () => {
		expect(stepTime('16:55', 1, 15, '08:00', '17:00')).toBe('17:00');
		expect(stepTime('08:00', -1, 15, '08:00', '17:00')).toBe('08:00');
	});

	it('starts from the lower bound when there is no value yet', () => {
		expect(stepTime('', 1, 30, '08:00')).toBe('08:30');
	});
});

describe('formatClock', () => {
	it('prints a 24-hour clock as 24 hours', () => {
		expect(formatClock('13:05', 'id-ID', false)).toContain('13');
	});

	it('gives nothing back for an unparseable time', () => {
		expect(formatClock('nope', 'en-US')).toBe('');
	});
});

describe('normaliseHex', () => {
	it('expands shorthand', () => {
		expect(normaliseHex('#abc')).toBe('#aabbcc');
	});

	it('adds the missing hash and lowercases', () => {
		expect(normaliseHex('AABBCC')).toBe('#aabbcc');
	});

	it('drops the alpha channel the swatch cannot show', () => {
		expect(normaliseHex('#aabbccdd')).toBe('#aabbcc');
	});

	it('refuses anything that is not hex', () => {
		expect(normaliseHex('#ab')).toBeNull();
		expect(normaliseHex('rebeccapurple')).toBeNull();
	});
});

describe('isDark', () => {
	it('calls near-black dark and near-white light', () => {
		expect(isDark('#000000')).toBe(true);
		expect(isDark('#ffffff')).toBe(false);
	});

	it('is false for a colour it cannot read', () => {
		expect(isDark('nope')).toBe(false);
	});
});

describe('formatGrouped', () => {
	it('groups in threes', () => {
		expect(formatGrouped(1234567, { precision: 0 })).toBe('1,234,567');
	});

	it('takes swapped separators', () => {
		expect(formatGrouped(1234567.5, { group: '.', decimal: ',', precision: 2 })).toBe(
			'1.234.567,50'
		);
	});

	it('keeps the sign outside the grouping', () => {
		expect(formatGrouped(-1234, { precision: 0 })).toBe('-1,234');
	});

	it('leaves a short number alone', () => {
		expect(formatGrouped(42, { precision: 0 })).toBe('42');
	});

	it('gives nothing back for a non-number', () => {
		expect(formatGrouped(NaN)).toBe('');
	});
});

describe('parseGrouped', () => {
	it('reads back what it wrote', () => {
		const options = { group: '.', decimal: ',', precision: 2 };
		expect(parseGrouped(formatGrouped(1234567.5, options), options)).toBe(1234567.5);
	});

	it('forgives the noise around a pasted amount', () => {
		expect(parseGrouped('Rp 1.250.000,-', { group: '.', decimal: ',' })).toBe(1250000);
	});

	it('keeps a leading minus and ignores a later one', () => {
		expect(parseGrouped('-1,200')).toBe(-1200);
		expect(parseGrouped('1,2-00')).toBe(1200);
	});

	it('is null when there are no digits at all', () => {
		expect(parseGrouped('')).toBeNull();
		expect(parseGrouped('-')).toBeNull();
	});
});
