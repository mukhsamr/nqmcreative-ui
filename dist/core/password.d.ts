/**
 * Password strength, 0–4, matching the five labels in the locale.
 *
 * Deliberately simple — length plus character variety. It is a nudge in the
 * form, not a security control, and anything cleverer would need a dictionary
 * this package has no business shipping.
 */
export declare function passwordScore(value: string): number;
