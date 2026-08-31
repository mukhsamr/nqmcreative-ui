/**
 * Hex colours for the colour field.
 *
 * Only hex: it is the one notation `<input type="color">` accepts and the one
 * every design tool copies to the clipboard. Anything else the app can convert
 * before it binds.
 */

const HEX = /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/**
 * `abc`, `#ABC`, `#aabbcc` → `#aabbcc`. Returns `null` when it is not a hex
 * colour, so a half-typed value can be left alone rather than corrected under
 * the caret.
 *
 * Shorthand is expanded and alpha is dropped: the native swatch understands
 * neither, and a value the swatch cannot show is worse than a rounded one.
 */
export function normaliseHex(text: string): string | null {
	const match = HEX.exec(text.trim());
	if (!match) return null;

	let digits = match[1].toLowerCase();
	if (digits.length <= 4) digits = [...digits].map((digit) => digit + digit).join('');
	return `#${digits.slice(0, 6)}`;
}

/**
 * True when a colour is dark enough to want light text on top of it.
 *
 * Rec. 601 luma rather than WCAG relative luminance — the threshold is for
 * picking one of two label colours on a swatch, not for proving a contrast
 * ratio, and this is the version everyone's design tokens are tuned against.
 */
export function isDark(hex: string): boolean {
	const value = normaliseHex(hex);
	if (!value) return false;

	const [r, g, b] = [1, 3, 5].map((at) => parseInt(value.slice(at, at + 2), 16));
	return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}
