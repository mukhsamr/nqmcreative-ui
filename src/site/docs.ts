/** Docs pages, in reading order. Drives the sidebar and the prev/next links. */
export interface DocPage {
	slug: string;
	title: string;
	summary: string;
}

export const docs: DocPage[] = [
	{
		slug: 'installation',
		title: 'Installation',
		summary: 'Install the package, wire up Tailwind, and render the first component.'
	},
	{
		slug: 'theming',
		title: 'Theming',
		summary: 'Eight tones on one token system, plus light and dark.'
	},
	{
		slug: 'inputs',
		title: 'Form inputs',
		summary: 'The eight specialised fields: what each adds over Input, and what it binds.'
	},
	{
		slug: 'adding-components',
		title: 'Adding a component',
		summary: 'For working on the library itself: the conventions and the two traps.'
	}
];

export const docBySlug = new Map(docs.map((page) => [page.slug, page]));
