/**
 * The catalogue: what the library is, independent of how any style draws it.
 *
 * Every style must implement this exact list — that is the promise the package
 * makes, and `generate-registry.mjs --check` enforces it. A style may add
 * components of its own on top; it may never be missing one from here.
 *
 * Order matters: it decides the order of the generated barrels, the registry
 * and the docs site's sidebar.
 */

/** Where a component sits in the docs, in the order the sections appear. */
export const CATEGORIES = [
	'actions',
	'forms',
	'data display',
	'feedback',
	'layout & navigation',
	'app shell',
	'marketing',
	'overlay'
];

/**
 * One line each, kept here rather than in 65 × N source files so the whole
 * catalogue can be read — and reworded — in one place. The wording describes
 * what a component *does*, never what it looks like, because it is shared by
 * every style.
 */
export const COMPONENTS = [
	['Button', 'actions', 'Five variants and four sizes, with a loading state and an href mode.'],
	['Link', 'actions', 'Anchor in any tone, with an external variant.'],

	['Input', 'forms', 'Text field with prefix and suffix slots, sizes and an invalid state.'],
	['Textarea', 'forms', 'Multi-line field that can grow with its content.'],
	['Select', 'forms', 'Native select with a chevron and data-driven options.'],
	['Checkbox', 'forms', 'Single checkbox with a label, description and indeterminate state.'],
	['Radio', 'forms', 'Single radio bound to a shared group value.'],
	['Switch', 'forms', 'On/off toggle with a label and description.'],
	['Field', 'forms', 'Wraps any control with a label, hint and error message.'],
	['Label', 'forms', 'Form label with an optional required marker.'],
	['Slider', 'forms', 'Range input with ticks and a printed value.'],
	['RadioGroup', 'forms', 'A set of radios, optionally rendered as selectable cards.'],
	['CheckboxGroup', 'forms', 'A set of checkboxes bound to a string array, with an optional cap.'],
	['SegmentedControl', 'forms', 'Exclusive choice as one joined row, with arrow-key movement.'],
	['InputGroup', 'forms', 'Joins an input to a button or addon with a single shared border.'],
	['InputAddon', 'forms', 'Fixed label joined to an input inside an InputGroup.'],
	['SearchInput', 'forms', 'Search field with a clear button and a debounced callback.'],
	['PinInput', 'forms', 'One box per character, with paste spreading and arrow keys.'],
	['TagsInput', 'forms', 'Free-text tokens committed on Enter, deduplicated and capped.'],
	['CurrencyInput', 'forms', 'Amount field that groups on blur and binds a number.'],
	['TimeInput', 'forms', 'HH:MM field with steppers, bounds and a minute step.'],
	['ColorInput', 'forms', 'Hex field paired with the native swatch and fixed choices.'],
	['FileInput', 'forms', 'One-line file picker with type, size and count validation.'],
	['Combobox', 'forms', 'Single-select with a text filter and keyboard navigation.'],
	['MultiSelect', 'forms', 'Multi-select with chips, grouping and a selection cap.'],
	['DatePicker', 'forms', 'Text field plus a calendar popover. Value is a YYYY-MM-DD string.'],
	['Calendar', 'forms', 'Month grid with keyboard navigation, bounds and disabled days.'],
	['Dropzone', 'forms', 'Drag-and-drop file input with type, size and count validation.'],

	['Badge', 'data display', 'Pill label for status and counts. Solid, soft or outline.'],
	['Avatar', 'data display', 'Image or initials, circular or squared, in five sizes.'],
	['AvatarGroup', 'data display', 'Overlapping row of avatars, each ringed in the background.'],
	['Card', 'data display', 'Surface with an optional header and footer, in three variants.'],
	['Stat', 'data display', 'Figure with a label, delta and trend arrow.'],
	['Table', 'data display', 'Data-driven table with sorting, row selection and a cell snippet.'],
	['Kbd', 'data display', 'Keyboard key.'],

	['Alert', 'feedback', 'Inline message in any tone, optionally dismissible.'],
	['Progress', 'feedback', 'Determinate or indeterminate bar, in three sizes.'],
	['Spinner', 'feedback', 'Rotating ring that inherits the surrounding colour.'],
	['Skeleton', 'feedback', 'Pulsing placeholder in text, block or circle form.'],
	['EmptyState', 'feedback', 'Placeholder for an empty list, with a glyph and an action slot.'],
	['Toaster', 'feedback', 'Renders the toast queue. Mount once, near the root.'],

	['Divider', 'layout & navigation', 'Rule, horizontal or vertical, with an optional caption.'],
	['Tabs', 'layout & navigation', 'Underline, pill or segmented tabs bound to a value.'],
	['Accordion', 'layout & navigation', 'Wrapper that stacks collapsible items.'],
	[
		'AccordionItem',
		'layout & navigation',
		'A single collapsible row, built on <details> so it works without JS.'
	],
	['Breadcrumb', 'layout & navigation', 'Trail of links to the current page.'],
	[
		'Pagination',
		'layout & navigation',
		'Page numbers that collapse to an ellipsis around the current one.'
	],
	[
		'Steps',
		'layout & navigation',
		'Progress through a flow, horizontal or vertical, with a failed state.'
	],

	['Navbar', 'app shell', 'Top bar that collapses into a drawer below the md breakpoint.'],
	['Sidebar', 'app shell', 'Nested, collapsible navigation rail for an app shell.'],
	['Footer', 'app shell', 'Site footer with link columns and a bottom bar.'],

	[
		'HeroSection',
		'marketing',
		'Page opener — eyebrow, headline, copy, actions, optional media column.'
	],
	['FeatureGrid', 'marketing', 'Section wrapper that lays feature cards out in 2, 3 or 4 columns.'],
	['FeatureCard', 'marketing', 'One feature: glyph, heading, copy. Optionally a whole link.'],
	[
		'PricingCard',
		'marketing',
		'One plan: price, period, ticked feature list, optional featured styling.'
	],
	['Testimonial', 'marketing', 'A quote with an attributed author.'],
	['LogoCloud', 'marketing', 'Row of client or partner marks, dimmed until hovered.'],
	['CTASection', 'marketing', 'Closing call to action, in three variants.'],
	['StatsBand', 'marketing', 'A row of figures, built on Stat.'],

	['Modal', 'overlay', 'Centred dialog on the native top layer, with a footer slot.'],
	['Drawer', 'overlay', 'Panel that slides in from any edge, on the native dialog top layer.'],
	['ConfirmDialog', 'overlay', 'Small dialog that stays busy until an async confirm settles.'],
	['CommandPalette', 'overlay', 'Cmd+K launcher with grouping, shortcuts and hidden keywords.'],
	['ContextMenu', 'overlay', 'Right-click menu placed at the pointer, flipped near the edges.'],
	['Dropdown', 'overlay', 'Menu anchored to a trigger, with focus trap and viewport flipping.'],
	['MenuItem', 'overlay', 'Row inside a Dropdown or ContextMenu, with a shortcut hint.'],
	['MenuSeparator', 'overlay', 'Rule between menu groups, with an optional caption.'],
	['Popover', 'overlay', 'Anchored panel that opens on click or hover.'],
	['ThemeToggle', 'overlay', 'Light, dark and system, remembered in localStorage.'],
	['Tooltip', 'overlay', 'CSS-only label on hover and focus, in four placements.']
].map(([name, category, description]) => ({ name, category, description }));

/** The styles that ship, in the order they should be listed. */
export const STYLES = [
	{
		name: 'matte',
		title: 'Matte',
		description:
			'Flat and sharp-cornered — no radius, no shadow, no gloss. Hairline rules and mono micro-labels do the work borders usually do.'
	},
	{
		name: 'paper',
		title: 'Paper',
		description:
			'The neutral one. Start here if unsure: soft corners, light shadows, generous spacing, and nothing that fights the content.'
	},
	{
		name: 'sprout',
		title: 'Sprout',
		description:
			'Warm and fully rounded — leaf green on cream, pill buttons, and a round display face. For school, community and family sites.'
	}
];

/**
 * The style the demos are authored in. Every other style's copy is generated
 * from it by `scripts/generate-demos.mjs`, so a demo is only ever written once.
 */
export const DEMO_STYLE = 'matte';

/** `AvatarGroup` -> `avatar-group` */
export const toSubpath = (name) =>
	name
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
		.toLowerCase();
