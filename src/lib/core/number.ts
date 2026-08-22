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
