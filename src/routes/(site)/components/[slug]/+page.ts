import { error } from '@sveltejs/kit';
import { bySlug, components } from '$lib/site/catalogue.js';

/** Every component page is prerendered — the site is static on Cloudflare. */
export const prerender = true;

export function entries() {
	return components.map((item) => ({ slug: item.slug }));
}

export function load({ params }) {
	const entry = bySlug.get(params.slug);
	if (!entry) error(404, `No component called "${params.slug}"`);

	const index = components.indexOf(entry);
	return {
		entry,
		previous: components[index - 1] ?? null,
		next: components[index + 1] ?? null
	};
}
