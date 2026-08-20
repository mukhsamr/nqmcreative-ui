/**
 * The docs site's view of the library: registry metadata joined to the demo
 * component and its source text.
 *
 * `registry.json` is generated from `src/lib` by `bun run registry`, so a new
 * component appears here — and on the site — without touching this file.
 */
import type { Component } from 'svelte';
import data from '../../../registry.json' with { type: 'json' };

export interface CatalogueEntry {
	name: string;
	slug: string;
	subpath: string;
	file: string;
	category: string;
	description: string;
	/** Components this one renders internally. */
	uses: string[];
	/** Shared modules it imports from the package root. */
	modules: string[];
	demo?: Component;
	demoSource?: string;
}

const demoModules = import.meta.glob('./demos/*.svelte', { eager: true }) as Record<
	string,
	{ default: Component }
>;

const demoSources = import.meta.glob('./demos/*.svelte', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

const slugOf = (path: string) => path.replace('./demos/', '').replace('.svelte', '');

export const components: CatalogueEntry[] = data.components.map((item) => {
	const slug = item.subpath.split('/').pop()!;
	const key = `./demos/${slug}.svelte`;
	return {
		...item,
		slug,
		demo: demoModules[key]?.default,
		demoSource: demoSources[key]
	};
});

export const bySlug = new Map(components.map((item) => [item.slug, item]));

/** Categories in the order the library exports them, each with its members. */
export const categories = components.reduce<{ name: string; items: CatalogueEntry[] }[]>(
	(groups, item) => {
		const group = groups.find((g) => g.name === item.category);
		if (group) group.items.push(item);
		else groups.push({ name: item.category, items: [item] });
		return groups;
	},
	[]
);

export const count = components.length;

/** Every demo has a slug; this guards against one going missing. */
export const missingDemos = components.filter((item) => !item.demo).map((item) => item.slug);

export { slugOf };
