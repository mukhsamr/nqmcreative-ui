/**
 * Password strength, 0–4, for labelling as you see fit.
 *
 * Deliberately simple — length plus character variety. It is a nudge in the
 * form, not a security control, and anything cleverer would need a dictionary
 * this package has no business shipping.
 */
export declare function passwordScore(value: string): number;
