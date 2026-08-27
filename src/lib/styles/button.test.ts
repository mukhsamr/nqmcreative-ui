/**
 * Button's busy state, run against every style.
 *
 * The interesting behaviour is the one a parent should not have to write: an
 * `onclick` that returns a promise locks the button and spins it until the work
 * lands. A style is free to draw that however it likes, but it has to disable
 * the control, mark it `aria-busy`, and let go again — including when the
 * promise rejects.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { STYLES } from './styles.js';

let target: HTMLElement;
let component: Record<string, unknown> | undefined;

/** Lets the awaits inside the click handler resume before asserting. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
	document.body.innerHTML = '';
});

describe.each(STYLES)('%s Button', (_name, style) => {
	const label = createRawSnippet(() => ({ render: () => `<span>Save</span>` }));
	const check = createRawSnippet(() => ({ render: () => `<svg viewBox="0 0 16 16"></svg>` }));

	function render(props: Record<string, unknown> = {}) {
		target = document.createElement('div');
		document.body.appendChild(target);
		component = mount(style.Button, {
			target,
			props: { children: label, ...props }
		}) as Record<string, unknown>;
		flushSync();
		return target.querySelector('button, a') as HTMLButtonElement;
	}

	const spinner = () => target.querySelector('[role="status"]');

	it('renders a button by default and an anchor with href', () => {
		expect(render().tagName).toBe('BUTTON');
		unmount(component!);
		component = undefined;
		expect(render({ href: '#' }).tagName).toBe('A');
	});

	it('spins and disables itself while loading', () => {
		const button = render({ loading: true });
		expect(button.disabled).toBe(true);
		expect(button.getAttribute('aria-busy')).toBe('true');
		expect(spinner()).not.toBeNull();
	});

	it('marks a loading link aria-disabled, since an anchor cannot be disabled', () => {
		const link = render({ href: '#', loading: true });
		expect(link.getAttribute('aria-disabled')).toBe('true');
	});

	it('locks itself until an async onclick settles', async () => {
		let finish: () => void = () => {};
		const onclick = () => new Promise<void>((resolve) => (finish = resolve));
		const button = render({ onclick });

		button.click();
		flushSync();
		expect(button.disabled).toBe(true);
		expect(button.getAttribute('aria-busy')).toBe('true');
		expect(spinner()).not.toBeNull();

		finish();
		await settle();
		flushSync();
		expect(button.disabled).toBe(false);
		expect(button.getAttribute('aria-busy')).toBeNull();
		expect(spinner()).toBeNull();
	});

	it('lets go again when the promise rejects', async () => {
		const onclick = () => Promise.reject(new Error('offline'));
		const button = render({ onclick });

		button.click();
		flushSync();
		expect(button.disabled).toBe(true);

		await settle();
		flushSync();
		expect(button.disabled).toBe(false);
	});

	it('takes no second click while the first is in flight', async () => {
		const onclick = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 5)));
		const button = render({ onclick });

		button.click();
		flushSync();
		button.click();
		flushSync();
		expect(onclick).toHaveBeenCalledTimes(1);

		await new Promise((resolve) => setTimeout(resolve, 10));
		flushSync();
		expect(button.disabled).toBe(false);
	});

	it('leaves a plain handler alone', () => {
		const onclick = vi.fn();
		const button = render({ onclick });

		button.click();
		flushSync();
		expect(onclick).toHaveBeenCalledTimes(1);
		expect(button.disabled).toBe(false);
		expect(spinner()).toBeNull();
	});

	it('renders leading and trailing icons', () => {
		render({ icon: check, iconEnd: check });
		expect(target.querySelectorAll('svg')).toHaveLength(2);
	});

	it('hides the leading icon behind the spinner while busy', () => {
		render({ icon: check, loading: true });
		expect(target.querySelector('svg')).toBeNull();
		expect(spinner()).not.toBeNull();
	});

	it('drops the label and squares off for an icon-only button', () => {
		const button = render({
			icon: check,
			iconOnly: true,
			children: undefined,
			'aria-label': 'Delete'
		});
		expect(button.textContent?.trim()).toBe('');
		expect(button.className).toMatch(/\bsize-\d+\b/);
		expect(button.getAttribute('aria-label')).toBe('Delete');
	});
});
