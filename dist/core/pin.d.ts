/**
 * One-time codes: what a character box accepts, and where a paste lands.
 *
 * The value is a plain compact string — `'0421'` means the first four boxes
 * are filled and the rest are empty. Holes are impossible by construction,
 * which is what lets the component always know which box to focus next.
 */
export type PinMode = 'numeric' | 'alphanumeric';
/** Strips whatever the mode refuses, then trims to `length` characters. */
export declare function sanitisePin(text: string, mode?: PinMode, length?: number): string;
/**
 * Writes `text` into the boxes from `index` on.
 *
 * One keystroke replaces one box and leaves the tail alone; a six-character
 * paste into the first box fills all six. Anything past `length` is dropped
 * rather than wrapped, because the extra characters were never part of a code
 * this long.
 */
export declare function fillFrom(value: string, index: number, text: string, length: number, mode?: PinMode): string;
/** Clears one box and everything after it — what Backspace on a filled box does. */
export declare function clearFrom(value: string, index: number): string;
/** The box the caret belongs in: the first empty one, or the last. */
export declare function caretIndex(value: string, length: number): number;
