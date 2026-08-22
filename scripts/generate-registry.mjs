/**
 * Builds `registry.json` — one entry per component, derived from the source so
 * it cannot drift. The CLI reads it to resolve a name to a subpath, and the
 * docs site reads the same file.
 *
 * It also enforces the promise the package makes: **every style implements
 * every component in the catalogue**. A style missing one fails the build here
 * rather than at someone's import.
 *
 * Run with `--check` to fail instead of writing.
 */
import { access, readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { COMPONENTS, DEMO_STYLE, STYLES, toSubpath } from './catalogue.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');

const styleDir = (style) => new URL(`src/lib/styles/${style}/`, `file://${root}`);

/** What each style actually has on disk. */
const present = {};
for (const style of STYLES) {
	present[style.name] = new Set(
		(await readdir(styleDir(style.name)))
			.filter((f) => f.endsWith('.svelte'))
			.map((f) => f.replace('.svelte', ''))
	);
}

let broken = false;
for (const style of STYLES) {
	const missing = COMPONENTS.filter((c) => !present[style.name].has(c.name)).map((c) => c.name);
	if (missing.length) {
		console.error(`${style.name} is missing: ${missing.join(', ')}`);
		broken = true;
	}
}
if (broken) {
	console.error('every style must implement every component in scripts/catalogue.mjs');
	process.exit(1);
}

const components = [];
for (const item of COMPONENTS) {
	const uses = new Set();
	const modules = new Set();
	const subpaths = {};

	for (const style of STYLES) {
		subpaths[style.name] = `@nqmcreative/ui/${style.name}/${toSubpath(item.name)}`;

		const source = await readFile(new URL(`${item.name}.svelte`, styleDir(style.name)), 'utf8');

		// Other components this one renders. The consumer never installs these
		// separately, but the docs should say what a component pulls in.
		for (const m of source.matchAll(/from '\.\/([A-Za-z]+)\.svelte'/g)) uses.add(m[1]);

		// Core modules it needs.
		for (const m of source.matchAll(/from '\.\.\/\.\.\/core\/([A-Za-z/.]+?)(?:\.svelte)?\.js'/g))
			modules.add(m[1].replace('.svelte', ''));
	}

	components.push({
		name: item.name,
		slug: toSubpath(item.name),
		category: item.category,
		description: item.description,
		subpaths,
		uses: [...uses].sort(),
		modules: [...modules].sort()
	});
}

/** Does this style ship its own webfonts? */
const hasFonts = async (style) => {
	try {
		await access(new URL('fonts.css', styleDir(style)));
		return true;
	} catch {
		return false;
	}
};

const styles = [];
for (const style of STYLES) {
	styles.push({
		name: style.name,
		title: style.title,
		description: style.description,
		/** Not every style ships webfonts — paper runs on the system stack. */
		fonts: await hasFonts(style.name),
		/** Components this style adds beyond the shared catalogue. */
		extra: [...present[style.name]].filter((n) => !COMPONENTS.some((c) => c.name === n)).sort()
	});
}

const registry = {
	name: '@nqmcreative/ui',
	homepage: 'https://github.com/mukhsamr/nqmcreative-ui',
	count: components.length,
	/** The style the docs demos are authored in; the rest are generated. */
	demoStyle: DEMO_STYLE,
	styles,
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

const summary = `${styles.length} styles × ${components.length} components`;

if (current === next) {
	console.log(`registry up to date (${summary})`);
	process.exit(0);
}

if (check) {
	console.error('registry.json is stale — run `bun run registry`');
	process.exit(1);
}

await writeFile(path, next);
console.log(`registry written (${summary})`);
