/**
 * Regenerates the `exports` map in package.json from what is actually in
 * `src/lib`, so every component is importable on its own:
 *
 *   import Button from '@nqmcreative/ui/button';
 *   import { toneSoft } from '@nqmcreative/ui/tones';
 *
 * The barrel (`@nqmcreative/ui`) stays, so existing imports keep working.
 *
 * Run with `--check` to fail instead of writing — used by `bun run lint` so a
 * new component cannot be added without its subpath.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const check = process.argv.includes('--check');

/** `AvatarGroup` -> `avatar-group`, `Kbd` -> `kbd` */
function toSubpath(name) {
	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
		.toLowerCase();
}

const components = (await readdir(new URL('src/lib/components/', `file://${root}`)))
	.filter((file) => file.endsWith('.svelte'))
	.map((file) => file.replace('.svelte', ''))
	.sort();

/** Plain TS modules that are useful on their own. */
const modules = [
	['./tones', 'tones'],
	['./locale', 'locale.svelte'],
	['./date', 'date'],
	['./toast', 'toast.svelte'],
	['./actions/anchor', 'actions/anchor'],
	['./actions/dismissable', 'actions/dismissable']
];

const exportsMap = {
	'.': {
		types: './dist/index.d.ts',
		svelte: './dist/index.js'
	}
};

for (const name of components) {
	exportsMap[`./${toSubpath(name)}`] = {
		types: `./dist/components/${name}.svelte.d.ts`,
		svelte: `./dist/components/${name}.svelte`
	};
}

for (const [subpath, file] of modules) {
	exportsMap[subpath] = {
		types: `./dist/${file}.d.ts`,
		default: `./dist/${file}.js`
	};
}

exportsMap['./theme.css'] = './dist/theme.css';
exportsMap['./fonts.css'] = './dist/fonts.css';

const pkgPath = new URL('package.json', `file://${root}`);
const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
const current = JSON.stringify(pkg.exports);
const next = JSON.stringify(exportsMap);

if (current === next) {
	console.log(`exports up to date (${components.length} components)`);
	process.exit(0);
}

if (check) {
	console.error('package.json "exports" is stale — run `bun run exports`');
	process.exit(1);
}

pkg.exports = exportsMap;
await writeFile(pkgPath, JSON.stringify(pkg, null, '\t') + '\n');
console.log(`exports written (${components.length} components)`);
