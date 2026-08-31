/**
 * The contract between styles: every style ships every component in the
 * catalogue, under the same name, and re-exports the same core surface.
 *
 * Without this the styles drift silently — someone adds a component to matte,
 * forgets paper, and a consumer of paper hits a missing export at build time
 * instead of here.
 */
import { describe, expect, it } from 'vitest';
import { STYLES } from './styles.js';
import registry from '../../../registry.json' with { type: 'json' };

const catalogue = registry.components.map((c) => c.name);

/** Values every style promises to re-export from core. */
const CORE_SURFACE = [
	'TONES',
	'focusRing',
	'toneSoft',
	'toneSolid',
	'anchored',
	'focusTrap',
	'portal',
	'toast',
	'applyTheme',
	'storedTheme',
	'toISO',
	'fromISO'
];

describe.each(STYLES)('%s', (name, style) => {
	it('exports every component in the catalogue', () => {
		const missing = catalogue.filter((component) => !(component in style));
		expect(missing, `${name} is missing components`).toEqual([]);
	});

	it('re-exports the shared core surface', () => {
		const missing = CORE_SURFACE.filter((key) => !(key in style));
		expect(missing, `${name} is missing core re-exports`).toEqual([]);
	});

	it('exports components as callable Svelte components', () => {
		for (const component of catalogue) {
			expect(typeof (style as Record<string, unknown>)[component], `${name}.${component}`).toBe(
				'function'
			);
		}
	});
});

describe('catalogue', () => {
	it('is the same set in every style', () => {
		const [, first] = STYLES[0];
		const baseline = catalogue.filter((c) => c in first);
		for (const [name, style] of STYLES) {
			expect(
				catalogue.filter((c) => c in style),
				`${name} differs from the catalogue`
			).toEqual(baseline);
		}
	});

	it('matches the number the registry advertises', () => {
		expect(catalogue).toHaveLength(registry.count);
	});
});
