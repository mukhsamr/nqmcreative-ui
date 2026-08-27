/**
 * The docs site's view of the library: registry metadata joined to each
 * style's demo component and its source text.
 *
 * `registry.json` is generated from `src/lib` by `bun run registry`, so a new
 * component appears here — and on the site — without touching this file.
 *
 * Demos are authored once against `demoStyle` and copied into every other
 * style by `bun run demos`, so `/paper/components/card` really does mount
 * paper's Card rather than repainting matte's.
 */
import type { Component } from 'svelte';
import data from '../../registry.json' with { type: 'json' };

export interface StyleInfo {
	name: string;
	title: string;
	description: string;
	/** Whether the style ships its own webfonts. */
	fonts: boolean;
	/** Components this style adds beyond the shared catalogue. */
	extra: string[];
}

export interface CatalogueEntry {
	name: string;
	slug: string;
	/** Import path per style, keyed by style name. */
	subpaths: Record<string, string>;
	category: string;
	description: string;
	/** Components this one renders internally. */
	uses: string[];
	/** Core modules it imports. */
	modules: string[];
	/** The demo component, keyed by style name. */
	demos: Record<string, Component | undefined>;
	/** The demo's source, rewritten to the import path a consumer would type. */
	sources: Record<string, string | undefined>;
	/**
	 * The optional variants demo — `<slug>.variants.svelte` — keyed by style
	 * name. A component only has one once somebody writes it.
	 */
	variants: Record<string, Component | undefined>;
	/** The variants demo's source, rewritten the same way as `sources`. */
	variantSources: Record<string, string | undefined>;
}

export const styles: StyleInfo[] = data.styles;

/** The style the demos are authored in. */
export const demoStyle = data.demoStyle;

const modules = {
	...(import.meta.glob('./demos/*.svelte', { eager: true }) as Record<
		string,
		{ default: Component }
	>),
	...(import.meta.glob('./demos-*/*.svelte', { eager: true }) as Record<
		string,
		{ default: Component }
	>)
};

const sources = {
	...(import.meta.glob('./demos/*.svelte', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>),
	...(import.meta.glob('./demos-*/*.svelte', {
		eager: true,
		query: '?raw',
		import: 'default'
	}) as Record<string, string>)
};

/** `./demos-paper/card.svelte` -> `paper`, `./demos/card.svelte` -> the base. */
const styleOf = (path: string) => path.match(/^\.\/demos-([^/]+)\//)?.[1] ?? demoStyle;

const slugOf = (path: string) => path.replace(/^\.\/demos[^/]*\//, '').replace('.svelte', '');

/**
 * What a reader should copy. The demo imports `$lib/styles/…` because it lives
 * in this repo; nobody outside it would ever write that, so the displayed
 * source shows the published subpath instead — and the generated-file banner
 * goes, since it is noise to a reader.
 */
function forDisplay(source: string, style: string) {
	return (
		source
			.replace(/^(<!--[\s\S]*?-->\n)+/, '')
			.replaceAll(
				new RegExp(`'\\$lib/styles/${style}/(\\w+)\\.svelte'`, 'g'),
				`'@nqmcreative/ui/${style}'`
			)
			// The barrel exports by name, so the default-import form the demo used for
			// a file path has to become a named one. Indentation is captured and put
			// back: these lines sit inside a <script> block.
			.replace(
				/^(\s*)import (\w+) from '@nqmcreative\/ui\/(\w+)';$/gm,
				"$1import { $2 } from '@nqmcreative/ui/$3';"
			)
			.trim()
	);
}

/**
 * Collapses the one-per-line imports a demo needs — it imports each component
 * by file — into the single line a reader would actually write.
 */
function mergeImports(source: string, style: string) {
	const line = new RegExp(`^([ \\t]*)import \\{ (\\w+) \\} from '@nqmcreative/ui/${style}';$`);
	const lines = source.split('\n');

	const names: string[] = [];
	let first = -1;

	for (const [i, text] of lines.entries()) {
		const match = line.exec(text);
		if (!match) continue;
		if (first === -1) first = i;
		names.push(match[2]);
	}

	if (names.length < 2) return source;

	const indent = line.exec(lines[first])![1];
	const merged = `${indent}import { ${names.join(', ')} } from '@nqmcreative/ui/${style}';`;

	// The merged line takes the place of the first; the rest simply go.
	return lines
		.map((text, i) => (i === first ? merged : line.test(text) ? null : text))
		.filter((text) => text !== null)
		.join('\n');
}

/** The demo file a style holds for one slug, or `undefined` if there is none. */
const keyFor = (style: string, slug: string) =>
	Object.keys(modules).find((path) => styleOf(path) === style && slugOf(path) === slug);

export const components: CatalogueEntry[] = data.components.map((item) => {
	const demos: Record<string, Component | undefined> = {};
	const entrySources: Record<string, string | undefined> = {};
	const variants: Record<string, Component | undefined> = {};
	const variantSources: Record<string, string | undefined> = {};

	for (const style of styles) {
		const key = keyFor(style.name, item.slug);
		demos[style.name] = key ? modules[key].default : undefined;
		entrySources[style.name] = key
			? mergeImports(forDisplay(sources[key], style.name), style.name)
			: undefined;

		// Optional second demo. Nothing breaks when it is missing — the page
		// simply leaves the variants section out.
		const variantKey = keyFor(style.name, `${item.slug}.variants`);
		variants[style.name] = variantKey ? modules[variantKey].default : undefined;
		variantSources[style.name] = variantKey
			? mergeImports(forDisplay(sources[variantKey], style.name), style.name)
			: undefined;
	}

	return { ...item, demos, sources: entrySources, variants, variantSources };
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

/** Every style needs a demo for every component; this guards against a gap. */
export const missingDemos = components.flatMap((item) =>
	styles.filter((style) => !item.demos[style.name]).map((style) => `${style.name}/${item.slug}`)
);

export { slugOf };
