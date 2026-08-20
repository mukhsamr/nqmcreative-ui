/**
 * Builds `registry.json` — one entry per component, derived from the source so
 * it cannot drift. The CLI reads it to resolve a name to a subpath, and the
 * docs site will read the same file.
 *
 * Categories come from the `/* --- forms --- *\/` comments in `src/lib/index.ts`,
 * which already group the exports.
 *
 * Run with `--check` to fail instead of writing.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');

/** `AvatarGroup` -> `avatar-group` */
const toSubpath = (name) =>
	name
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
		.toLowerCase();

/** Reads the category each component was exported under. */
async function categories() {
	const source = await readFile(new URL('src/lib/index.ts', `file://${root}`), 'utf8');
	const map = {};
	let current = 'misc';
	for (const line of source.split('\n')) {
		const heading = /^\/\* --- (.+) --- \*\/$/.exec(line.trim());
		if (heading) {
			current = heading[1];
			continue;
		}
		const exported = /from '\.\/components\/([A-Za-z]+)\.svelte'/.exec(line);
		if (exported) map[exported[1]] = current;
	}
	return map;
}

/** The first `/** … *\/` block in the file, used as the description. */
function leadingDoc(source) {
	const match = /\/\*\*\s*\n([\s\S]*?)\*\//.exec(source);
	if (!match) return '';
	return match[1]
		.split('\n')
		.map((line) => line.replace(/^\s*\*ature?\s?/, '').replace(/^\s*\*\s?/, ''))
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim();
}

const dir = new URL('src/lib/components/', `file://${root}`);
const files = (await readdir(dir)).filter((f) => f.endsWith('.svelte')).sort();
const byCategory = await categories();

const components = [];
for (const file of files) {
	const name = file.replace('.svelte', '');
	const source = await readFile(new URL(file, dir), 'utf8');

	// Other components this one renders — the consumer never installs these
	// separately, but the docs should say what a component pulls in.
	const uses = [...source.matchAll(/from '\.\/([A-Za-z]+)\.svelte'/g)].map((m) => m[1]).sort();

	// Shared modules it needs from the package root.
	const modules = [...source.matchAll(/from '\.\.\/([A-Za-z/.]+?)(?:\.svelte)?\.js'/g)]
		.map((m) => m[1].replace('.svelte', ''))
		.filter((v, i, a) => a.indexOf(v) === i)
		.sort();

	components.push({
		name,
		subpath: `@nqmcreative/ui/${toSubpath(name)}`,
		file: `src/lib/components/${file}`,
		category: byCategory[name] ?? 'misc',
		description: leadingDoc(source),
		uses,
		modules
	});
}

const registry = {
	name: '@nqmcreative/ui',
	homepage: 'https://github.com/mukhsamr/nqmcreative-ui',
	count: components.length,
	components
};

const path = new URL('registry.json', `file://${root}`);
const next = JSON.stringify(registry, null, '\t') + '\n';

let current = '';
try {
	current = await readFile(path, 'utf8');
} catch {
	/* first run */
}

if (current === next) {
	console.log(`registry up to date (${components.length} components)`);
	process.exit(0);
}

if (check) {
	console.error('registry.json is stale — run `bun run registry`');
	process.exit(1);
}

await writeFile(path, next);
console.log(`registry written (${components.length} components)`);
