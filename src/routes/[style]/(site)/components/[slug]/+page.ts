import { error } from '@sveltejs/kit';
import { bySlug, components, styles } from '$site/catalogue.js';

/** Every component page is prerendered — the site is static on Cloudflare. */
export const prerender = true;

/** One page per component, per style. */
export function entries() {
	return styles.flatMap((style) =>
		components.map((item) => ({ style: style.name, slug: item.slug }))
	);
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
