import { redirect } from '@sveltejs/kit';
import { demoStyle } from '$site/catalogue.js';

export const prerender = true;

/**
 * The root has no style of its own, so it hands over to one. `matte` is the
 * signature style and the one the demos are authored in; the switcher in the
 * header is one click from the rest.
 */
export function load() {
	redirect(307, `/${demoStyle}`);
}
