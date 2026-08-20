import data from '../../../registry.json' with { type: 'json' };
const demoModules = import.meta.glob('./demos/*.svelte', { eager: true });
const demoSources = import.meta.glob('./demos/*.svelte', {
    eager: true,
    query: '?raw',
    import: 'default'
});
const slugOf = (path) => path.replace('./demos/', '').replace('.svelte', '');
export const components = data.components.map((item) => {
    const slug = item.subpath.split('/').pop();
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
export const categories = components.reduce((groups, item) => {
    const group = groups.find((g) => g.name === item.category);
    if (group)
        group.items.push(item);
    else
        groups.push({ name: item.category, items: [item] });
    return groups;
}, []);
export const count = components.length;
/** Every demo has a slug; this guards against one going missing. */
export const missingDemos = components.filter((item) => !item.demo).map((item) => item.slug);
export { slugOf };
