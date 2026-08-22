import { error } from '@sveltejs/kit';
import { isStyle } from '$site/ui.js';

/**
 * The style is a route segment, not a toggle: `/matte/components/button` and
 * `/paper/components/button` are two pages that render two different sets of
 * components. That way a whole page — chrome included — is genuinely in one
 * style, and the URL says which.
 */
export function load({ params }) {
	if (!isStyle(params.style)) error(404, `No style called "${params.style}"`);
	return { style: params.style };
}
