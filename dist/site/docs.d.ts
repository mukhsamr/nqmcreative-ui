/** Docs pages, in reading order. Drives the sidebar and the prev/next links. */
export interface DocPage {
    slug: string;
    title: string;
    summary: string;
}
export declare const docs: DocPage[];
export declare const docBySlug: Map<string, DocPage>;
