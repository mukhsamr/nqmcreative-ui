/** Numeric helpers shared by the stepper, the slider and the progress bar. */
/** Decimal places implied by a step, so `0.25` never produces `0.7500000001`. */
export declare function stepDecimals(step: number): number;
/** Clamps into range and rounds to the step's precision. */
export declare function clampToStep(value: number, min: number, max: number, step: number): number;
/** Position of `value` within `min…max`, as 0–100. */
export declare function percentOf(value: number, min: number, max: number): number;
