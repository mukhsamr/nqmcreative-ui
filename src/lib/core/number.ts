/** Numeric helpers shared by the stepper, the slider and the progress bar. */

/** Decimal places implied by a step, so `0.25` never produces `0.7500000001`. */
export function stepDecimals(step: number): number {
	return (String(step).split('.')[1] ?? '').length;
}

/** Clamps into range and rounds to the step's precision. */
export function clampToStep(value: number, min: number, max: number, step: number): number {
	if (Number.isNaN(value)) return min === -Infinity ? 0 : min;
	return Number(Math.min(max, Math.max(min, value)).toFixed(stepDecimals(step)));
}

/** Position of `value` within `min…max`, as 0–100. */
export function percentOf(value: number, min: number, max: number): number {
	if (max === min) return 0;
	return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

/**
 * How a grouped number is written. Separators are the app's to choose rather
 * than `Intl`'s, because the field has to *parse* what it prints — and a
 * locale that groups with a non-breaking space produces a character nobody can
 * type back in.
 */
export interface GroupOptions {
	/** Thousands separator. */
	group?: string;
	/** Decimal separator. */
	decimal?: string;
	/** Fixed decimal places. `undefined` keeps whatever was typed. */
	precision?: number;
}

/** `1234567.5` → `1,234,567.50`, or `1.234.567,50` in a locale that swaps them. */
export function formatGrouped(value: number, options: GroupOptions = {}): string {
	const { group = ',', decimal = '.', precision } = options;
	if (!Number.isFinite(value)) return '';

	const fixed = precision === undefined ? String(value) : value.toFixed(precision);
	const negative = fixed.startsWith('-');
	const [whole, fraction] = (negative ? fixed.slice(1) : fixed).split('.');

	// Replaced through a function so a separator that looks like `$&` stays put.
	const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, () => group);

	return `${negative ? '-' : ''}${grouped}${fraction ? decimal + fraction : ''}`;
}

/**
 * The inverse, and deliberately forgiving: anything that is not a digit, a
 * minus or the decimal separator is dropped, so a pasted `Rp 1.250.000,-`
 * still reads as a number. `null` means there were no digits at all.
 */
export function parseGrouped(text: string, options: GroupOptions = {}): number | null {
	const { decimal = '.' } = options;

	let cleaned = '';
	for (const char of text) {
		if (char === decimal) cleaned += '.';
		else if (char >= '0' && char <= '9') cleaned += char;
		else if (char === '-' && cleaned === '') cleaned += char;
	}

	if (!cleaned || cleaned === '-' || cleaned === '.') return null;
	const value = Number(cleaned);
	return Number.isFinite(value) ? value : null;
}
