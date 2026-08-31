/** Numeric helpers shared by the stepper, the slider and the progress bar. */
/** Decimal places implied by a step, so `0.25` never produces `0.7500000001`. */
export declare function stepDecimals(step: number): number;
/** Clamps into range and rounds to the step's precision. */
export declare function clampToStep(value: number, min: number, max: number, step: number): number;
/** Position of `value` within `min…max`, as 0–100. */
export declare function percentOf(value: number, min: number, max: number): number;
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
export declare function formatGrouped(value: number, options?: GroupOptions): string;
/**
 * The inverse, and deliberately forgiving: anything that is not a digit, a
 * minus or the decimal separator is dropped, so a pasted `Rp 1.250.000,-`
 * still reads as a number. `null` means there were no digits at all.
 */
export declare function parseGrouped(text: string, options?: GroupOptions): number | null;
