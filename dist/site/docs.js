export const docs = [
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
        slug: 'locale',
        title: 'Locale',
        summary: 'Every built-in string, in one object you can override.'
    },
    {
        slug: 'adding-components',
        title: 'Adding a component',
        summary: 'For working on the library itself: the conventions and the two traps.'
    }
];
export const docBySlug = new Map(docs.map((page) => [page.slug, page]));
