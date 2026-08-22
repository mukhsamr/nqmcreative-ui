/**
 * Combobox keyboard navigation, run against every style.
 *
 * The moving parts all live in `core/list.svelte.ts` — filtering, grouping and
 * the active cursor — so this suite is really testing core through the markup
 * each style wraps around it.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import { STYLES } from './styles.js';

const options = [
	{ value: 'jkt', label: 'Jakarta' },
	{ value: 'bdg', label: 'Bandung' },
	{ value: 'sby', label: 'Surabaya' },
	{ value: 'dps', label: 'Denpasar' }
];

let target: HTMLElement;
let component: Record<string, unknown> | undefined;

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
	document.body.innerHTML = '';
});

describe.each(STYLES)('%s Combobox', (_name, style) => {
	function render(props: Record<string, unknown> = {}) {
		target = document.createElement('div');
		document.body.appendChild(target);
		component = mount(style.Combobox, { target, props: { options, ...props } }) as Record<
			string,
			unknown
		>;
		flushSync();
		return target;
	}

	const input = () => document.querySelector<HTMLInputElement>('[role="combobox"]')!;

	/** The listbox is portalled to <body>, so it is not inside `target`. */
	const listbox = () => document.querySelector<HTMLElement>('[role="listbox"]');

	const labels = () =>
		[...(listbox()?.querySelectorAll('[role="option"]') ?? [])].map(
			(o) => o.textContent?.trim().split('\n')[0]
		);

	const open = () => {
		input().dispatchEvent(new FocusEvent('focus'));
		flushSync();
	};

	const press = (key: string) => {
		input().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
		flushSync();
	};

	/** Which option the cursor is on, read the way a screen reader would. */
	const active = () => input().getAttribute('aria-activedescendant');

	it('opens the list on focus', () => {
		render();
		expect(listbox()).toBeNull();
		open();
		expect(labels()).toEqual(['Jakarta', 'Bandung', 'Surabaya', 'Denpasar']);
		expect(input().getAttribute('aria-expanded')).toBe('true');
	});

	it('walks the list with the arrow keys', () => {
		render({ id: 'city' });
		open();
		expect(active()).toBe('city-opt-0');

		press('ArrowDown');
		expect(active()).toBe('city-opt-1');

		press('ArrowDown');
		expect(active()).toBe('city-opt-2');

		press('ArrowUp');
		expect(active()).toBe('city-opt-1');
	});

	it('wraps around at both ends', () => {
		render({ id: 'city' });
		open();

		press('ArrowUp');
		expect(active()).toBe('city-opt-3');

		press('ArrowDown');
		expect(active()).toBe('city-opt-0');
	});

	it('skips a disabled option', () => {
		render({
			id: 'city',
			options: [options[0], { ...options[1], disabled: true }, options[2]]
		});
		open();

		press('ArrowDown');
		expect(active()).toBe('city-opt-2');
	});

	it('chooses the active option on Enter', () => {
		render({ id: 'city' });
		open();
		press('ArrowDown');
		press('Enter');

		expect(input().getAttribute('aria-expanded')).toBe('false');
		expect(input().value).toBe('Bandung');
	});

	it('starts on the selected option when reopened', () => {
		render({ id: 'city', value: 'sby' });
		open();
		expect(active()).toBe('city-opt-2');
	});

	it('filters as you type and resets the cursor', () => {
		render({ id: 'city' });
		open();
		press('ArrowDown');

		const el = input();
		el.value = 'den';
		el.dispatchEvent(new Event('input', { bubbles: true }));
		flushSync();

		expect(labels()).toEqual(['Denpasar']);
		expect(active()).toBe('city-opt-0');
	});

	it('closes on Escape', () => {
		render();
		open();
		press('Escape');
		expect(input().getAttribute('aria-expanded')).toBe('false');
		expect(listbox()).toBeNull();
	});
});
