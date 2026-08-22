import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { anchored } from './anchor.js';

/** happy-dom has no layout engine, so both rects are stubbed by hand. */
function makeAnchor(rect: Partial<DOMRect>) {
	const el = document.createElement('button');
	document.body.appendChild(el);
	const full = { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, ...rect };
	el.getBoundingClientRect = () => ({ ...full, toJSON: () => full }) as DOMRect;
	return el;
}

function makeFloating(width: number, height: number) {
	const el = document.createElement('div');
	document.body.appendChild(el);
	Object.defineProperty(el, 'offsetWidth', { value: width, configurable: true });
	Object.defineProperty(el, 'offsetHeight', { value: height, configurable: true });
	return el;
}

const viewport = (width: number, height: number) => {
	window.innerWidth = width;
	window.innerHeight = height;
};

beforeEach(() => viewport(1000, 800));
afterEach(() => (document.body.innerHTML = ''));

describe('anchored', () => {
	it('places the element below the anchor, left edges aligned', () => {
		const anchor = makeAnchor({
			top: 100,
			bottom: 130,
			left: 200,
			right: 320,
			width: 120,
			height: 30
		});
		const floating = makeFloating(180, 200);

		const action = anchored(floating, { anchor, placement: 'bottom-start', offset: 6 });

		expect(floating.style.position).toBe('fixed');
		expect(floating.style.top).toBe('136px'); // 130 + 6
		expect(floating.style.left).toBe('200px');
		expect(floating.dataset.placement).toBe('bottom-start');
		action.destroy();
	});

	it('aligns right edges for a -end placement', () => {
		const anchor = makeAnchor({
			top: 100,
			bottom: 130,
			left: 200,
			right: 320,
			width: 120,
			height: 30
		});
		const floating = makeFloating(180, 200);

		const action = anchored(floating, { anchor, placement: 'bottom-end', offset: 0 });

		expect(floating.style.left).toBe('140px'); // 320 - 180
		action.destroy();
	});

	it('flips above when there is no room below', () => {
		// 40px of viewport left under the anchor, but the element is 200 tall.
		const anchor = makeAnchor({
			top: 730,
			bottom: 760,
			left: 100,
			right: 220,
			width: 120,
			height: 30
		});
		const floating = makeFloating(180, 200);

		const action = anchored(floating, { anchor, placement: 'bottom-start', offset: 6 });

		expect(floating.dataset.placement).toBe('top-start');
		expect(floating.style.top).toBe('524px'); // 730 - 200 - 6
		action.destroy();
	});

	it('stays put when neither side fits, rather than flipping into a worse spot', () => {
		viewport(1000, 260);
		const anchor = makeAnchor({
			top: 120,
			bottom: 150,
			left: 100,
			right: 220,
			width: 120,
			height: 30
		});
		const floating = makeFloating(180, 200);

		const action = anchored(floating, { anchor, placement: 'bottom-start', offset: 6 });

		expect(floating.dataset.placement).toBe('bottom-start');
		action.destroy();
	});

	it('clamps inside the viewport instead of overhanging the right edge', () => {
		const anchor = makeAnchor({
			top: 100,
			bottom: 130,
			left: 950,
			right: 990,
			width: 40,
			height: 30
		});
		const floating = makeFloating(180, 100);

		const action = anchored(floating, { anchor, placement: 'bottom-start', offset: 6, padding: 8 });

		// 950 would overhang; the most it can be is 1000 - 180 - 8.
		expect(floating.style.left).toBe('812px');
		action.destroy();
	});

	it('clamps to the padding on the left edge too', () => {
		const anchor = makeAnchor({ top: 100, bottom: 130, left: 2, right: 42, width: 40, height: 30 });
		const floating = makeFloating(180, 100);

		const action = anchored(floating, { anchor, placement: 'bottom-end', offset: 0, padding: 8 });

		expect(floating.style.left).toBe('8px');
		action.destroy();
	});

	it('centres on the cross axis for a bare placement', () => {
		const anchor = makeAnchor({
			top: 300,
			bottom: 330,
			left: 400,
			right: 500,
			width: 100,
			height: 30
		});
		const floating = makeFloating(200, 80);

		const action = anchored(floating, { anchor, placement: 'top', offset: 10 });

		expect(floating.style.left).toBe('350px'); // 400 + 50 - 100
		expect(floating.style.top).toBe('210px'); // 300 - 80 - 10
		action.destroy();
	});

	it('places to the side and centres vertically', () => {
		const anchor = makeAnchor({
			top: 200,
			bottom: 240,
			left: 400,
			right: 460,
			width: 60,
			height: 40
		});
		const floating = makeFloating(120, 100);

		const action = anchored(floating, { anchor, placement: 'right', offset: 8 });

		expect(floating.style.left).toBe('468px'); // 460 + 8
		expect(floating.style.top).toBe('170px'); // 200 + 20 - 50
		action.destroy();
	});

	it('matches the anchor width when asked', () => {
		const anchor = makeAnchor({
			top: 100,
			bottom: 130,
			left: 100,
			right: 340,
			width: 240,
			height: 30
		});
		const floating = makeFloating(180, 100);

		const action = anchored(floating, { anchor, placement: 'bottom-start', matchWidth: true });

		expect(floating.style.width).toBe('240px');
		action.destroy();
	});

	it('does nothing while disabled, and nothing without an anchor', () => {
		const anchor = makeAnchor({
			top: 100,
			bottom: 130,
			left: 100,
			right: 200,
			width: 100,
			height: 30
		});
		const off = makeFloating(180, 100);
		const orphan = makeFloating(180, 100);

		const a = anchored(off, { anchor, enabled: false });
		const b = anchored(orphan, {});

		expect(off.style.top).toBe('');
		expect(orphan.style.top).toBe('');
		a.destroy();
		b.destroy();
	});

	it('repositions when update() hands it a different anchor', () => {
		const first = makeAnchor({
			top: 100,
			bottom: 130,
			left: 100,
			right: 200,
			width: 100,
			height: 30
		});
		const second = makeAnchor({
			top: 400,
			bottom: 430,
			left: 500,
			right: 600,
			width: 100,
			height: 30
		});
		const floating = makeFloating(180, 100);

		const action = anchored(floating, { anchor: first, placement: 'bottom-start', offset: 0 });
		expect(floating.style.top).toBe('130px');

		action.update({ anchor: second, placement: 'bottom-start', offset: 0 });
		expect(floating.style.top).toBe('430px');
		expect(floating.style.left).toBe('500px');
		action.destroy();
	});

	it('stops listening once destroyed', () => {
		const anchor = makeAnchor({
			top: 100,
			bottom: 130,
			left: 100,
			right: 200,
			width: 100,
			height: 30
		});
		const floating = makeFloating(180, 100);

		const action = anchored(floating, { anchor, placement: 'bottom-start', offset: 0 });
		action.destroy();

		const before = floating.style.top;
		anchor.getBoundingClientRect = () =>
			({ top: 500, bottom: 530, left: 100, right: 200, width: 100, height: 30 }) as DOMRect;
		window.dispatchEvent(new Event('resize'));

		expect(floating.style.top).toBe(before);
	});
});
