/**
 * Dropzone validation, run against every style.
 *
 * The selectors below are deliberately structural — roles, element order, aria
 * labels — never class names. A style is free to redraw the zone however it
 * likes; what it may not do is accept a file this suite says should be turned
 * away.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import { STYLES } from './styles.js';

const KB = 1024;
const MB = 1024 * KB;

function file(name: string, type: string, size: number) {
	// happy-dom keeps `size` from the blob parts, so allocate for real.
	return new File([new Uint8Array(size)], name, { type });
}

let target: HTMLElement;
let component: Record<string, unknown> | undefined;

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
	document.body.innerHTML = '';
});

describe.each(STYLES)('%s Dropzone', (_name, style) => {
	function render(props: Record<string, unknown> = {}) {
		target = document.createElement('div');
		document.body.appendChild(target);
		component = mount(style.Dropzone, { target, props }) as Record<string, unknown>;
		flushSync();
		return target;
	}

	/** Fires a drop with a hand-rolled dataTransfer — happy-dom has no real one. */
	function drop(files: File[]) {
		const zone = target.querySelector('button')!;
		const event = new Event('drop', { bubbles: true, cancelable: true });
		Object.defineProperty(event, 'dataTransfer', { value: files ? { files } : null });
		zone.dispatchEvent(event);
		flushSync();
	}

	/** The list whose rows carry a remove button is the accepted one. */
	const acceptedList = () =>
		[...target.querySelectorAll('ul')].find((ul) => ul.querySelector('button[aria-label]'));

	const accepted = () =>
		[...(acceptedList()?.querySelectorAll('li') ?? [])].map((li) =>
			li.querySelector('span')?.textContent?.trim()
		);

	/** The other list — plain text rows, one per rejected file. */
	const rejected = () =>
		[...target.querySelectorAll('ul')]
			.filter((ul) => !ul.querySelector('button[aria-label]'))
			.flatMap((ul) => [...ul.querySelectorAll('li')])
			.map((li) => li.textContent?.replace(/\s+/g, ' ').trim());

	it('accepts a file that matches every rule', () => {
		const onaccept = vi.fn();
		render({ accept: 'image/*', maxSize: 5 * MB, onaccept });

		drop([file('logo.png', 'image/png', 100 * KB)]);

		expect(accepted()).toEqual(['logo.png']);
		expect(onaccept).toHaveBeenCalledOnce();
		expect(onaccept.mock.calls[0][0][0].name).toBe('logo.png');
	});

	it('turns away the wrong type and says why', () => {
		const onreject = vi.fn();
		render({ accept: 'image/*,.pdf', onreject });

		drop([file('notes.txt', 'text/plain', 10)]);

		expect(accepted()).toEqual([]);
		expect(rejected()[0]).toContain('wrong file type');
		expect(onreject).toHaveBeenCalledWith([expect.objectContaining({ reason: 'type' })]);
	});

	it('matches a bare extension as well as a MIME type', () => {
		render({ accept: 'image/*,.pdf' });
		drop([file('brief.pdf', 'application/pdf', 1 * KB)]);
		expect(accepted()).toEqual(['brief.pdf']);
	});

	it('turns away anything over maxSize', () => {
		const onreject = vi.fn();
		render({ maxSize: 1 * MB, onreject });

		drop([file('huge.pdf', 'application/pdf', 2 * MB)]);

		expect(accepted()).toEqual([]);
		expect(rejected()[0]).toContain('too large');
		expect(onreject).toHaveBeenCalledWith([expect.objectContaining({ reason: 'size' })]);
	});

	it('accepts a file exactly on the size limit', () => {
		render({ maxSize: 1 * KB });
		drop([file('edge.png', 'image/png', 1 * KB)]);
		expect(accepted()).toEqual(['edge.png']);
	});

	it('sorts a mixed drop into accepted and rejected', () => {
		render({ accept: 'image/*,.pdf', maxSize: 1 * MB });

		drop([
			file('logo.png', 'image/png', 100 * KB),
			file('huge.pdf', 'application/pdf', 2 * MB),
			file('notes.txt', 'text/plain', 10)
		]);

		expect(accepted()).toEqual(['logo.png']);
		expect(rejected()).toHaveLength(2);
	});

	it('stops at maxFiles and marks the overflow', () => {
		const onreject = vi.fn();
		render({ maxFiles: 2, onreject });

		drop([
			file('a.png', 'image/png', 10),
			file('b.png', 'image/png', 10),
			file('c.png', 'image/png', 10)
		]);

		expect(accepted()).toEqual(['a.png', 'b.png']);
		expect(onreject).toHaveBeenCalledWith([expect.objectContaining({ reason: 'count' })]);
	});

	it('counts files already held against maxFiles', () => {
		render({ maxFiles: 2 });

		drop([file('a.png', 'image/png', 10)]);
		drop([file('b.png', 'image/png', 10), file('c.png', 'image/png', 10)]);

		expect(accepted()).toEqual(['a.png', 'b.png']);
	});

	it('replaces rather than appends when multiple is off', () => {
		render({ multiple: false });

		drop([file('first.png', 'image/png', 10)]);
		expect(accepted()).toEqual(['first.png']);

		drop([file('second.png', 'image/png', 10)]);
		expect(accepted()).toEqual(['second.png']);
	});

	it('ignores a drop entirely while disabled', () => {
		const onaccept = vi.fn();
		render({ disabled: true, onaccept });

		drop([file('logo.png', 'image/png', 10)]);

		expect(accepted()).toEqual([]);
		expect(onaccept).not.toHaveBeenCalled();
	});

	it('takes anything when no rules are set', () => {
		render();
		drop([file('whatever.xyz', '', 999 * MB)]);
		expect(accepted()).toEqual(['whatever.xyz']);
	});

	it('drops a file from the list when its remove button is clicked', () => {
		render();
		drop([file('a.png', 'image/png', 10), file('b.png', 'image/png', 10)]);
		expect(accepted()).toEqual(['a.png', 'b.png']);

		target.querySelector<HTMLButtonElement>('li button[aria-label]')!.click();
		flushSync();

		expect(accepted()).toEqual(['b.png']);
	});

	it('prints a readable size next to each file', () => {
		render();
		drop([file('a.png', 'image/png', 900), file('b.png', 'image/png', 2 * MB)]);

		// Second direct span in each row: name first, size second.
		const sizes = [...(acceptedList()?.querySelectorAll('li') ?? [])].map((li) =>
			li.querySelectorAll(':scope > span')[1]?.textContent?.trim()
		);
		expect(sizes).toEqual(['900 B', '2 MB']);
	});
});
