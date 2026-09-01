/**
 * The boxed variants of RadioGroup and CheckboxGroup, run against every style.
 *
 * `boxed` wraps each option in a clickable card. The card and the control
 * inside it both want to own the click, and if both do, a checkbox toggles
 * twice and lands back where it started — the option looks unselectable. One
 * click, one change, whatever the style draws around it.
 */
import { afterEach, describe, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import { STYLES } from './styles.js';

let target: HTMLElement;
let component: Record<string, unknown> | undefined;

afterEach(() => {
	if (component) unmount(component);
	component = undefined;
	document.body.innerHTML = '';
});

function render(Component: unknown, props: Record<string, unknown>) {
	target = document.createElement('div');
	document.body.appendChild(target);
	component = mount(Component as never, { target, props }) as Record<string, unknown>;
	flushSync();
	return target;
}

const options = [
	{ value: 'a', label: 'Apples', description: 'Picked this morning' },
	{ value: 'b', label: 'Pears', description: 'Still ripening' }
];

/** The card a reader actually clicks — the box, not the control inside it. */
const card = (index: number) =>
	target.querySelectorAll('label, [data-option]')[index] as HTMLElement;

describe.each(STYLES)('%s CheckboxGroup boxed', (_name, style) => {
	it('checks the option on one click of the card, and unchecks it on the next', () => {
		render(style.CheckboxGroup, { options, boxed: true, value: [] });

		const input = target.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
		card(0).click();
		flushSync();
		expect(input.checked, 'one click should select').toBe(true);

		card(0).click();
		flushSync();
		expect(input.checked, 'a second click should clear it').toBe(false);
	});

	it('describes each option rather than folding the description into its name', () => {
		render(style.CheckboxGroup, { options, boxed: true, value: [] });
		const input = target.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
		const described = input.getAttribute('aria-describedby');
		expect(described, 'the description needs an id to point at').toBeTruthy();
		expect(document.getElementById(described!)?.textContent?.trim()).toBe('Picked this morning');
	});
});

describe.each(STYLES)('%s RadioGroup boxed', (_name, style) => {
	it('selects the option on one click of the card', () => {
		render(style.RadioGroup, { options, boxed: true, value: '' });

		const input = target.querySelector<HTMLInputElement>('input[type="radio"]')!;
		card(0).click();
		flushSync();
		expect(input.checked).toBe(true);
	});

	it('points the group at its own hint', () => {
		render(style.RadioGroup, { options, legend: 'Fruit', hint: 'Pick one' });
		const fieldset = target.querySelector('fieldset')!;
		const described = fieldset.getAttribute('aria-describedby');
		expect(described, 'the fieldset needs to point at its hint').toBeTruthy();
		expect(document.getElementById(described!)?.textContent?.trim()).toBe('Pick one');
	});
});
