/**
 * Password strength, 0–4, for labelling as you see fit.
 *
 * Deliberately simple — length plus character variety. It is a nudge in the
 * form, not a security control, and anything cleverer would need a dictionary
 * this package has no business shipping.
 */
export function passwordScore(value: string): number {
	if (!value) return 0;
	let points = 0;
	if (value.length >= 8) points++;
	if (value.length >= 12) points++;
	if (/[a-z]/.test(value) && /[A-Z]/.test(value)) points++;
	if (/\d/.test(value)) points++;
	if (/[^\w\s]/.test(value)) points++;
	return Math.min(4, points);
}
