/**
 * The docs site's view of the library: registry metadata joined to the demo
 * component and its source text.
 *
 * `registry.json` is generated from `src/lib` by `bun run registry`, so a new
 * component appears here — and on the site — without touching this file.
 */
import type { Component } from 'svelte';
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
declare const slugOf: (path: string) => string;
export declare const components: CatalogueEntry[];
export declare const bySlug: Map<string, CatalogueEntry>;
/** Categories in the order the library exports them, each with its members. */
export declare const categories: {
    name: string;
    items: CatalogueEntry[];
}[];
export declare const count: number;
/** Every demo has a slug; this guards against one going missing. */
export declare const missingDemos: string[];
export { slugOf };
