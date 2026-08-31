/**
 * One-time codes: what a character box accepts, and where a paste lands.
 *
 * The value is a plain compact string — `'0421'` means the first four boxes
 * are filled and the rest are empty. Holes are impossible by construction,
 * which is what lets the component always know which box to focus next.
 */

export type PinMode = 'numeric' | 'alphanumeric';

const ALLOWED: Record<PinMode, RegExp> = {
	numeric: /[^0-9]/g,
	alphanumeric: /[^0-9a-zA-Z]/g
};

/** Strips whatever the mode refuses, then trims to `length` characters. */
export function sanitisePin(text: string, mode: PinMode = 'numeric', length = Infinity): string {
	return text.replace(ALLOWED[mode], '').slice(0, length);
}

/**
 * Writes `text` into the boxes from `index` on.
 *
 * One keystroke replaces one box and leaves the tail alone; a six-character
 * paste into the first box fills all six. Anything past `length` is dropped
 * rather than wrapped, because the extra characters were never part of a code
 * this long.
 */
export function fillFrom(
	value: string,
	index: number,
	text: string,
	length: number,
	mode: PinMode = 'numeric'
): string {
	const head = value.slice(0, index);
	const clean = sanitisePin(text, mode, length - head.length);
	if (!clean) return value;
	return (head + clean + value.slice(index + clean.length)).slice(0, length);
}

/** Clears one box and everything after it — what Backspace on a filled box does. */
export function clearFrom(value: string, index: number): string {
	return value.slice(0, index);
}

/** The box the caret belongs in: the first empty one, or the last. */
export function caretIndex(value: string, length: number): number {
	return Math.min(value.length, length - 1);
}
