import type { Handle } from '@sveltejs/kit';
import { isStyle } from '$site/ui.js';
import { demoStyle } from '$site/catalogue.js';

/**
 * Stamps the page's style onto `<html>` before it is sent.
 *
 * It has to be `<html>` rather than a wrapper, for two reasons: overlays portal
 * to `<body>` and would otherwise miss the tokens, and dark mode is a class on
 * `<html>` — `styles.css` carries a compound selector for exactly this pairing.
 *
 * Doing it here rather than in an effect means the first paint is already
 * right. The site is prerendered, so this runs at build time and the attribute
 * is baked into each HTML file.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const first = event.url.pathname.split('/')[1] ?? '';
	const style = isStyle(first) ? first : demoStyle;

	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%nqm.style%', style)
	});
};
