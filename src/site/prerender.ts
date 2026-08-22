/**
 * Shared prerender config for every page under `[style]`.
 *
 * The whole site is static, and each page exists once per style, so every route
 * with a `[style]` parameter re-exports both of these rather than restating
 * them. Relying on the crawler instead would work until the day a page stops
 * being linked from another.
 */
import { styles } from './catalogue.js';

export const prerender = true;

export function entries() {
	return styles.map((style) => ({ style: style.name }));
}
