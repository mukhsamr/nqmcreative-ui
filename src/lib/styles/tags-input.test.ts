/**
 * TagsInput's commit rules, run against every style.
 *
 * The chips are read as the text of the elements carrying a remove button, and
 * the field is the one `input` that is not hidden — structure a style is free
 * to redraw, but not to drop.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import { STYLES } from './styles.js';

let target: HTMLElement;
let component: Record<string, unknown> | undefined;

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
	document.body.innerHTML = '';
});

describe.each(STYLES)('%s TagsInput', (_name, style) => {
	function render(props: Record<string, unknown> = {}) {
		target = document.createElement('div');
		document.body.appendChild(target);
		component = mount(style.TagsInput, { target, props }) as Record<string, unknown>;
		flushSync();
		return target;
	}

	const field = () =>
		[...target.querySelectorAll('input')].find((el) => el.type !== 'hidden') as HTMLInputElement;

	/** A chip is whatever wraps a remove button; its text is the tag. */
	const chips = () =>
		[...target.querySelectorAll('span')]
			.filter((el) => el.querySelector(':scope > button[aria-label]'))
			.map((el) => el.textContent?.trim());

	function typeInto(text: string) {
		const input = field();
		input.value = text;
		input.dispatchEvent(new Event('input', { bubbles: true }));
		flushSync();
	}

	function press(key: string) {
		field().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
		flushSync();
	}

	function commit(text: string, key = 'Enter') {
		typeInto(text);
		press(key);
	}

	function paste(text: string) {
		const event = new Event('paste', { bubbles: true, cancelable: true });
		Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
		field().dispatchEvent(event);
		flushSync();
	}

	it('shows the tags it was given', () => {
		render({ tags: ['svelte', 'tailwind'] });
		expect(chips()).toEqual(['svelte', 'tailwind']);
	});

	it('commits on Enter and clears the field', () => {
		const onadd = vi.fn();
		render({ onadd });

		commit('svelte');

		expect(chips()).toEqual(['svelte']);
		expect(field().value).toBe('');
		expect(onadd).toHaveBeenCalledExactlyOnceWith('svelte');
	});

	it('commits on a separator key too', () => {
		render({ separators: [','] });
		commit('svelte', ',');
		expect(chips()).toEqual(['svelte']);
	});

	it('trims what it commits', () => {
		render();
		commit('  svelte  ');
		expect(chips()).toEqual(['svelte']);
	});

	it('does nothing on Enter in an empty field', () => {
		const onreject = vi.fn();
		render({ onreject });

		press('Enter');

		expect(chips()).toEqual([]);
		expect(onreject).not.toHaveBeenCalled();
	});

	it('refuses a duplicate and says why', () => {
		const onreject = vi.fn();
		render({ tags: ['svelte'], onreject });

		commit('Svelte');

		expect(chips()).toEqual(['svelte']);
		expect(onreject).toHaveBeenCalledWith('duplicate', 'Svelte');
	});

	it('refuses once the cap is reached', () => {
		const onreject = vi.fn();
		render({ tags: ['a', 'b'], max: 2, onreject });

		commit('c');

		expect(chips()).toEqual(['a', 'b']);
		expect(onreject).toHaveBeenCalledWith('full', 'c');
	});

	it('refuses anything shorter than minLength', () => {
		const onreject = vi.fn();
		render({ minLength: 3, onreject });

		commit('ab');

		expect(chips()).toEqual([]);
		expect(onreject).toHaveBeenCalledWith('short', 'ab');
	});

	it('splits a pasted list into several tags', () => {
		render();
		paste('svelte, tailwind, vite');
		expect(chips()).toEqual(['svelte', 'tailwind', 'vite']);
	});

	it('leaves a paste with no separator to the field', () => {
		render();
		paste('svelte');
		expect(chips()).toEqual([]);
	});

	it('peels the last chip off on Backspace in an empty field', () => {
		const onremove = vi.fn();
		render({ tags: ['svelte', 'tailwind'], onremove });

		press('Backspace');

		expect(chips()).toEqual(['svelte']);
		expect(onremove).toHaveBeenCalledExactlyOnceWith('tailwind');
	});

	it('leaves the chips alone while the field has text', () => {
		render({ tags: ['svelte'] });
		typeInto('tail');
		press('Backspace');
		expect(chips()).toEqual(['svelte']);
	});

	it('removes the chip its own button belongs to', () => {
		render({ tags: ['a', 'b', 'c'] });

		const remove = [...target.querySelectorAll('button[aria-label]')][1] as HTMLButtonElement;
		remove.click();
		flushSync();

		expect(chips()).toEqual(['a', 'c']);
	});

	it('posts the tags from one hidden field', () => {
		render({ tags: ['a', 'b'], name: 'topics' });
		const hidden = target.querySelector('input[type="hidden"]') as HTMLInputElement;
		expect(hidden.name).toBe('topics');
		expect(hidden.value).toBe('a,b');
	});
});
