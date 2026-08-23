/**
 * Every style, side by side — the docs site is the one consumer that is meant
 * to load more than one.
 *
 * An app imports a single style and never sees this. The site imports every
 * style so a route can render its whole page in one of them: `UI[style].Button`
 * is a different component from `UI[other].Button`, not the same one repainted.
 */
import * as matte from '$lib/styles/matte/index.js';
import * as paper from '$lib/styles/paper/index.js';
import * as sprout from '$lib/styles/sprout/index.js';

export const UI = { matte, paper, sprout };

export type StyleName = keyof typeof UI;

/** Narrowing guard for the `[style]` route parameter. */
export function isStyle(value: string): value is StyleName {
	return value in UI;
}
