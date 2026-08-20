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

/**
 * One line per component. Kept here rather than in 57 source files so the
 * whole catalogue can be read — and reworded — in one place.
 */
const descriptions = {
	Accordion: 'Wrapper that stacks collapsible items with hairlines between them.',
	AccordionItem: 'A single collapsible row, built on <details> so it works without JS.',
	Alert: 'Inline message in any tone, optionally dismissible.',
	Avatar: 'Image or initials, circular or squared, in five sizes.',
	AvatarGroup: 'Overlapping row of avatars with a ring cut out of the background.',
	Badge: 'Pill label for status and counts. Solid, soft or outline.',
	Breadcrumb: 'Trail of links to the current page.',
	Button: 'Five variants and four sizes, with a loading state and an href mode.',
	Calendar: 'Month grid with keyboard navigation, bounds and disabled days.',
	Card: 'Bordered, filled or tinted surface with an optional header and footer.',
	Checkbox: 'Single checkbox with a label, description and indeterminate state.',
	CheckboxGroup: 'A set of checkboxes bound to a string array, with an optional cap.',
	CTASection: 'Closing call to action — tinted, solid or outlined.',
	Combobox: 'Single-select with a text filter and keyboard navigation.',
	FeatureCard: 'One feature: glyph, heading, copy. Optionally a whole link.',
	FeatureGrid: 'Section wrapper that lays feature cards out in 2, 3 or 4 columns.',
	HeroSection: 'Page opener — eyebrow, headline, copy, actions, optional media column.',
	LogoCloud: 'Row of client or partner marks, dimmed until hovered.',
	PricingCard: 'One plan: price, period, ticked feature list, optional featured styling.',
	StatsBand: 'A row of figures, built on Stat.',
	Testimonial: 'A quote with an attributed author.',
	CommandPalette: 'Cmd+K launcher with grouping, shortcuts and hidden keywords.',
	ConfirmDialog: 'Small dialog that stays busy until an async confirm settles.',
	ContextMenu: 'Right-click menu placed at the pointer, flipped near the edges.',
	DatePicker: 'Text field plus a calendar popover. Value is a YYYY-MM-DD string.',
	Divider: 'Hairline rule, horizontal or vertical, with an optional caption.',
	Drawer: 'Panel that slides in from any edge, on the native dialog top layer.',
	Dropdown: 'Menu anchored to a trigger, with focus trap and viewport flipping.',
	Dropzone: 'Drag-and-drop file input with type, size and count validation.',
	EmptyState: 'Placeholder for an empty list, with a glyph and an action slot.',
	Field: 'Wraps any control with a label, hint and error message.',
	Footer: 'Site footer with link columns and a bottom bar.',
	Input: 'Text field with prefix and suffix slots, sizes and an invalid state.',
	InputGroup: 'Joins an input to a button or addon with a single shared border.',
	Kbd: 'Keyboard key, styled with a thicker bottom edge.',
	Label: 'Form label with an optional required marker.',
	Link: 'Anchor in any tone, with an external variant.',
	LocaleProvider: 'Scopes a locale to a subtree — the SSR-safe way to translate.',
	MenuItem: 'Row inside a Dropdown or ContextMenu, with a shortcut hint.',
	MenuSeparator: 'Rule between menu groups, with an optional caption.',
	Modal: 'Centred dialog on the native top layer, with a footer slot.',
	MultiSelect: 'Multi-select with chips, grouping and a selection cap.',
	Navbar: 'Top bar that collapses into a drawer below the md breakpoint.',
	NumberInput: 'Number field with steppers, clamping and decimal handling.',
	Pagination: 'Page numbers that collapse to an ellipsis around the current one.',
	PasswordInput: 'Password field with a visibility toggle and a strength meter.',
	Popover: 'Anchored panel that opens on click or hover.',
	Progress: 'Determinate or indeterminate bar, in three sizes.',
	Radio: 'Single radio bound to a shared group value.',
	RadioGroup: 'A set of radios, optionally rendered as selectable cards.',
	SegmentedControl: 'Exclusive choice as one joined row, with arrow-key movement.',
	Select: 'Native select with a chevron and data-driven options.',
	Sidebar: 'Nested, collapsible navigation rail for an app shell.',
	Skeleton: 'Pulsing placeholder in text, block or circle form.',
	Slider: 'Range input with ticks, a value bubble and dual-handle mode.',
	Spinner: 'Rotating ring that inherits the surrounding colour.',
	Stat: 'Figure with a label, delta and trend arrow.',
	Steps: 'Progress through a flow, horizontal or vertical, with a failed state.',
	Switch: 'On/off toggle with a label and description.',
	Table: 'Data-driven table with sorting, row selection and a cell snippet.',
	Tabs: 'Underline, pill or segmented tabs bound to a value.',
	Textarea: 'Multi-line field that can grow with its content.',
	ThemeToggle: 'Light, dark and system, remembered in localStorage.',
	Toaster: 'Renders the toast queue. Mount once, near the root.',
	Tooltip: 'CSS-only label on hover and focus, in four placements.'
};

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
		description: descriptions[name] ?? leadingDoc(source),
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
