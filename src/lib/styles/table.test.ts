/**
 * Table sorting and selection, run against every style.
 *
 * Everything asserted here comes out of `core/table.ts`, so a style that
 * renders its own header markup still has to produce the same order, the same
 * `aria-sort`, and the same selection callbacks.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRawSnippet, flushSync, mount, unmount } from 'svelte';
import { STYLES } from './styles.js';
import type { TableSort } from '../core/table.js';

interface Row extends Record<string, unknown> {
	id: string;
	project: string;
	budget: number;
}

const rows: Row[] = [
	{ id: 'p1', project: 'Sundara', budget: 84 },
	{ id: 'p2', project: 'Nusantara', budget: 9 },
	{ id: 'p3', project: 'Kelana', budget: 120 }
];

const columns = [
	{ key: 'project', label: 'Project', sortable: true },
	{ key: 'budget', label: 'Budget', sortable: true },
	{ key: 'id', label: 'Id' }
];

let target: HTMLElement;
let component: Record<string, unknown> | undefined;

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
	document.body.innerHTML = '';
});

describe.each(STYLES)('%s Table', (_name, style) => {
	function render(props: Record<string, unknown> = {}) {
		target = document.createElement('div');
		document.body.appendChild(target);
		component = mount(style.Table, { target, props: { columns, rows, ...props } }) as Record<
			string,
			unknown
		>;
		flushSync();
		return target;
	}

	const cellsIn = (column: number) =>
		[...target.querySelectorAll('tbody tr')].map((tr) =>
			tr.querySelectorAll('td')[column]?.textContent?.trim()
		);

	const header = (label: string) =>
		[...target.querySelectorAll('th button')].find((b) =>
			b.textContent?.includes(label)
		) as HTMLButtonElement;

	describe('sorting', () => {
		it('leaves the rows in source order until a header is clicked', () => {
			render();
			expect(cellsIn(0)).toEqual(['Sundara', 'Nusantara', 'Kelana']);
		});

		it('sorts numbers numerically, not as strings', () => {
			render();
			header('Budget').click();
			flushSync();
			// A string sort would put 120 before 84.
			expect(cellsIn(1)).toEqual(['9', '84', '120']);
		});

		it('cycles ascending → descending → unsorted', () => {
			render();
			const button = header('Budget');

			button.click();
			flushSync();
			expect(cellsIn(1)).toEqual(['9', '84', '120']);

			button.click();
			flushSync();
			expect(cellsIn(1)).toEqual(['120', '84', '9']);

			button.click();
			flushSync();
			expect(cellsIn(1)).toEqual(['84', '9', '120']);
		});

		it('sorts strings alphabetically', () => {
			render();
			header('Project').click();
			flushSync();
			expect(cellsIn(0)).toEqual(['Kelana', 'Nusantara', 'Sundara']);
		});

		it('reflects the direction in aria-sort', () => {
			render();
			const button = header('Budget');
			const th = button.closest('th')!;

			expect(th.getAttribute('aria-sort')).toBeNull();
			button.click();
			flushSync();
			expect(th.getAttribute('aria-sort')).toBe('ascending');
			button.click();
			flushSync();
			expect(th.getAttribute('aria-sort')).toBe('descending');
		});

		it('reports each change through onsort', () => {
			const onsort = vi.fn();
			render({ onsort });

			header('Budget').click();
			flushSync();
			expect(onsort).toHaveBeenLastCalledWith({
				key: 'budget',
				direction: 'asc'
			} satisfies TableSort);

			header('Budget').click();
			flushSync();
			expect(onsort).toHaveBeenLastCalledWith({ key: 'budget', direction: 'desc' });

			header('Budget').click();
			flushSync();
			expect(onsort).toHaveBeenLastCalledWith(null);
		});

		it('leaves the rows alone when sorting is handed to the server', () => {
			render({ sortLocally: false });
			header('Budget').click();
			flushSync();
			expect(cellsIn(1)).toEqual(['84', '9', '120']);
		});

		it('does not make a header a button unless the column opts in', () => {
			render();
			expect(target.querySelectorAll('th button')).toHaveLength(2);
		});
	});

	describe('selection', () => {
		const boxes = () => [
			...target.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]')
		];
		const selectAll = () => target.querySelector<HTMLInputElement>('thead input[type="checkbox"]')!;

		it('adds no checkbox column unless selectable', () => {
			render();
			expect(target.querySelector('input[type="checkbox"]')).toBeNull();
		});

		it('reports the row key of each ticked row', () => {
			const onselect = vi.fn();
			render({ selectable: true, onselect });

			boxes()[0].click();
			flushSync();
			expect(onselect).toHaveBeenLastCalledWith(['p1']);

			boxes()[2].click();
			flushSync();
			expect(onselect).toHaveBeenLastCalledWith(['p1', 'p3']);

			boxes()[0].click();
			flushSync();
			expect(onselect).toHaveBeenLastCalledWith(['p3']);
		});

		it('selects and clears every row from the header box', () => {
			const onselect = vi.fn();
			render({ selectable: true, onselect });

			selectAll().click();
			flushSync();
			expect(onselect).toHaveBeenLastCalledWith(['p1', 'p2', 'p3']);

			selectAll().click();
			flushSync();
			expect(onselect).toHaveBeenLastCalledWith([]);
		});

		it('honours a custom rowKey', () => {
			const onselect = vi.fn();
			render({ selectable: true, rowKey: 'project', onselect });

			boxes()[1].click();
			flushSync();
			expect(onselect).toHaveBeenLastCalledWith(['Nusantara']);
		});

		it('selects what is on screen after sorting, not the original order', () => {
			const onselect = vi.fn();
			render({ selectable: true, onselect });

			header('Budget').click();
			flushSync();
			// Rows are now 9, 84, 120 → p2, p1, p3.
			boxes()[0].click();
			flushSync();
			expect(onselect).toHaveBeenLastCalledWith(['p2']);
		});
	});

	describe('header, footer and bulk bar', () => {
		const snippet = (label: string) =>
			createRawSnippet(() => ({ render: () => `<span>${label}</span>` }));

		/** The component's own root: [header?] [scroller] [footer?]. */
		const shell = () => target.firstElementChild!;
		const flat = (el: Element) => el.textContent?.replace(/\s+/g, ' ').trim() ?? '';
		const tick = (i: number) =>
			target.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]')[i].click();

		it('renders no bar unless a snippet is passed', () => {
			render();
			expect(shell().children).toHaveLength(1);
			expect(shell().firstElementChild!.querySelector('table')).not.toBeNull();
		});

		it('puts the header above the table and the footer below it', () => {
			render({ header: snippet('toolbar'), footer: snippet('pager') });
			const [first, scroller, last] = [...shell().children];
			expect(shell().children).toHaveLength(3);
			expect(flat(first)).toBe('toolbar');
			expect(scroller.querySelector('table')).not.toBeNull();
			expect(flat(last)).toBe('pager');
		});

		it('keeps the table scrolling on its own so a header can stay put', () => {
			render({ header: snippet('toolbar') });
			const scroller = target.querySelector('table')!.parentElement!;
			expect(scroller.className).toContain('overflow-auto');
		});

		it('leaves the header up while nothing is ticked', () => {
			render({ selectable: true, header: snippet('toolbar'), bulkActions: snippet('bulk') });
			expect(flat(shell().firstElementChild!)).toBe('toolbar');
		});

		it('swaps the header for the count and the bulk actions once a row is ticked', () => {
			render({ selectable: true, header: snippet('toolbar'), bulkActions: snippet('bulk') });
			tick(0);
			flushSync();

			const bar = flat(shell().firstElementChild!);
			expect(bar).not.toContain('toolbar');
			expect(bar).toContain('1 selected');
			expect(bar).toContain('bulk');
		});

		it('empties the selection from the bulk bar', () => {
			const onselect = vi.fn();
			render({ selectable: true, bulkActions: snippet('bulk'), onselect });
			tick(0);
			tick(2);
			flushSync();
			expect(flat(shell().firstElementChild!)).toContain('2 selected');

			const clear = [...shell().querySelectorAll('button')].find((b) =>
				b.textContent?.includes('Clear')
			)!;
			clear.click();
			flushSync();

			expect(onselect).toHaveBeenLastCalledWith([]);
			expect(shell().children).toHaveLength(1);
		});

		it('stays out of the way of a selectable table with no bulk actions', () => {
			render({ selectable: true, header: snippet('toolbar') });
			tick(0);
			flushSync();
			expect(flat(shell().firstElementChild!)).toBe('toolbar');
		});
	});

	describe('empty state', () => {
		it('spans every column, including the checkbox one', () => {
			render({ rows: [], selectable: true });
			const cell = target.querySelector('tbody td')!;
			expect(cell.getAttribute('colspan')).toBe('4');
			expect(cell.textContent?.trim()).toBe('No data');
		});
	});
});
