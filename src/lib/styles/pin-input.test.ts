/**
 * PinInput's keyboard and paste behaviour, run against every style.
 *
 * The selectors are structural — the boxes are the `input` elements, in order.
 * A style may draw them however it likes; what it may not do is put the caret
 * somewhere else, or let a character through that the mode refuses.
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

describe.each(STYLES)('%s PinInput', (_name, style) => {
	function render(props: Record<string, unknown> = {}) {
		target = document.createElement('div');
		document.body.appendChild(target);
		component = mount(style.PinInput, { target, props: { length: 4, ...props } }) as Record<
			string,
			unknown
		>;
		flushSync();
		return target;
	}

	/** The visible boxes, in order — the hidden `name` field is not one. */
	const boxes = () => [...target.querySelectorAll('input')].filter((el) => el.type !== 'hidden');

	const code = () =>
		boxes()
			.map((box) => box.value)
			.join('');

	function type(index: number, text: string) {
		const box = boxes()[index];
		box.value = text;
		box.dispatchEvent(new Event('input', { bubbles: true }));
		flushSync();
	}

	function press(index: number, key: string) {
		boxes()[index].dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
		flushSync();
	}

	function paste(index: number, text: string) {
		const event = new Event('paste', { bubbles: true, cancelable: true });
		Object.defineProperty(event, 'clipboardData', { value: { getData: () => text } });
		boxes()[index].dispatchEvent(event);
		flushSync();
	}

	it('draws one box per character', () => {
		render({ length: 6 });
		expect(boxes()).toHaveLength(6);
	});

	it('fills one box per keystroke and moves on', () => {
		render();
		type(0, '1');
		type(1, '2');
		expect(code()).toBe('12');
		expect(document.activeElement).toBe(boxes()[2]);
	});

	it('refuses a letter in numeric mode', () => {
		render();
		type(0, 'a');
		expect(code()).toBe('');
	});

	it('takes a letter in alphanumeric mode', () => {
		render({ mode: 'alphanumeric' });
		type(0, 'a');
		expect(code()).toBe('a');
	});

	it('spreads a paste across every box', () => {
		render();
		paste(0, '1234');
		expect(code()).toBe('1234');
	});

	it('strips what the mode refuses out of a paste', () => {
		render();
		paste(0, '12-34-56');
		expect(code()).toBe('1234');
	});

	it('fires oncomplete once the last box is filled', () => {
		const oncomplete = vi.fn();
		render({ oncomplete });

		paste(0, '1234');

		expect(oncomplete).toHaveBeenCalledExactlyOnceWith('1234');
	});

	it('does not fire oncomplete while the code is short', () => {
		const oncomplete = vi.fn();
		render({ oncomplete });
		type(0, '1');
		expect(oncomplete).not.toHaveBeenCalled();
	});

	it('clears the box under the caret on Backspace', () => {
		render();
		paste(0, '1234');
		press(3, 'Backspace');
		expect(code()).toBe('123');
	});

	it('deletes backwards from an empty box', () => {
		render();
		type(0, '1');
		type(1, '2');
		// The caret sits on box 2, which is empty — so this takes box 1.
		press(2, 'Backspace');
		expect(code()).toBe('1');
		expect(document.activeElement).toBe(boxes()[1]);
	});

	it('moves the caret with the arrow keys', () => {
		render();
		paste(0, '1234');
		press(3, 'ArrowLeft');
		expect(document.activeElement).toBe(boxes()[2]);
		press(2, 'ArrowRight');
		expect(document.activeElement).toBe(boxes()[3]);
	});

	it('stops the caret at the ends', () => {
		render();
		press(0, 'ArrowLeft');
		expect(document.activeElement).toBe(boxes()[0]);
	});

	it('posts the whole code from one hidden field', () => {
		render({ name: 'otp' });
		paste(0, '1234');
		const hidden = target.querySelector('input[type="hidden"]') as HTMLInputElement;
		expect(hidden.name).toBe('otp');
		expect(hidden.value).toBe('1234');
	});

	it('labels every box for a screen reader', () => {
		render();
		expect(boxes().map((box) => box.getAttribute('aria-label'))).toEqual([
			'Digit 1',
			'Digit 2',
			'Digit 3',
			'Digit 4'
		]);
	});
});
