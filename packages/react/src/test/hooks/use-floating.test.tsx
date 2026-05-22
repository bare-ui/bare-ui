import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';
import { useFloating, type UseFloatingOptions } from '@/hooks/use-floating';

interface Rect {
	top: number;
	left: number;
	width: number;
	height: number;
}

function makeRect({ top, left, width, height }: Rect): DOMRect {
	return {
		top,
		left,
		width,
		height,
		right: left + width,
		bottom: top + height,
		x: left,
		y: top,
		toJSON: () => ({}),
	} as DOMRect;
}

function setupElements(referenceRect: Rect, floatingSize: { width: number; height: number }) {
	const reference = document.createElement('button');
	const floating = document.createElement('div');
	document.body.appendChild(reference);
	document.body.appendChild(floating);

	reference.getBoundingClientRect = () => makeRect(referenceRect);
	Object.defineProperty(floating, 'offsetWidth', { configurable: true, value: floatingSize.width });
	Object.defineProperty(floating, 'offsetHeight', { configurable: true, value: floatingSize.height });

	return { reference, floating };
}

function renderFloating(
	reference: HTMLElement,
	floating: HTMLElement,
	options: UseFloatingOptions,
) {
	return renderHook(
		(opts: UseFloatingOptions) => {
			const refRef = useRef<HTMLElement | null>(reference);
			const floatRef = useRef<HTMLElement | null>(floating);
			return useFloating(refRef, floatRef, opts);
		},
		{ initialProps: options },
	);
}

describe('useFloating', () => {
	const originalInnerWidth = window.innerWidth;
	const originalInnerHeight = window.innerHeight;

	beforeEach(() => {
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024, writable: true });
		Object.defineProperty(window, 'innerHeight', { configurable: true, value: 768, writable: true });
		Object.defineProperty(window, 'scrollX', { configurable: true, value: 0, writable: true });
		Object.defineProperty(window, 'scrollY', { configurable: true, value: 0, writable: true });
	});

	afterEach(() => {
		document.body.innerHTML = '';
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth, writable: true });
		Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight, writable: true });
	});

	it('positions on the bottom by default with center alignment', () => {
		const { reference, floating } = setupElements(
			{ top: 100, left: 100, width: 100, height: 40 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, {});
		// bottom: y = ref.bottom + offset(8) = 140 + 8 = 148
		// center align: x = ref.left + (ref.width - float.width)/2 = 100 + 10 = 110
		expect(result.current.side).toBe('bottom');
		expect(result.current.align).toBe('center');
		expect(result.current.x).toBe(110);
		expect(result.current.y).toBe(148);
	});

	it('positions on the top with start alignment', () => {
		const { reference, floating } = setupElements(
			{ top: 200, left: 100, width: 100, height: 40 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { side: 'top', align: 'start' });
		// y = ref.top - float.height - offset = 200 - 30 - 8 = 162
		// align start: x = ref.left = 100
		expect(result.current.side).toBe('top');
		expect(result.current.x).toBe(100);
		expect(result.current.y).toBe(162);
	});

	it('positions on the right with end alignment', () => {
		const { reference, floating } = setupElements(
			{ top: 100, left: 100, width: 100, height: 60 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { side: 'right', align: 'end' });
		// x = ref.right + offset = 200 + 8 = 208
		// align end: y = ref.bottom - float.height = 160 - 30 = 130
		expect(result.current.side).toBe('right');
		expect(result.current.x).toBe(208);
		expect(result.current.y).toBe(130);
	});

	it('positions on the left with center alignment', () => {
		const { reference, floating } = setupElements(
			{ top: 100, left: 300, width: 100, height: 60 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { side: 'left', align: 'center' });
		// x = ref.left - float.width - offset = 300 - 80 - 8 = 212
		// align center: y = ref.top + (ref.height - float.height)/2 = 100 + 15 = 115
		expect(result.current.x).toBe(212);
		expect(result.current.y).toBe(115);
	});

	it('flips from top to bottom when there is not enough room above', () => {
		const { reference, floating } = setupElements(
			{ top: 5, left: 100, width: 100, height: 40 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { side: 'top' });
		// top would give y = 5 - 30 - 8 = -33 (does not fit), so flip to bottom
		expect(result.current.side).toBe('bottom');
	});

	it('keeps preferred side when flip is disabled even if it overflows', () => {
		const { reference, floating } = setupElements(
			{ top: 5, left: 100, width: 100, height: 40 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { side: 'top', flip: false });
		expect(result.current.side).toBe('top');
	});

	it('shifts the floating element to stay within the viewport on the x axis', () => {
		const { reference, floating } = setupElements(
			// reference near the right edge -> bottom+center would overflow on x
			{ top: 100, left: 1000, width: 50, height: 40 },
			{ width: 200, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { side: 'bottom', align: 'center', flip: false });
		// viewport width = 1024; floating width = 200 → max x = 824
		expect(result.current.x).toBe(824);
	});

	it('applies the requested strategy and exposes floatingStyles', () => {
		const { reference, floating } = setupElements(
			{ top: 100, left: 100, width: 100, height: 40 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { strategy: 'fixed' });
		expect(result.current.strategy).toBe('fixed');
		expect(result.current.floatingStyles.position).toBe('fixed');
		expect(result.current.floatingStyles.transform).toMatch(/translate3d\(\d+px, \d+px, 0\)/);
	});

	it('does not compute position while closed', () => {
		const { reference, floating } = setupElements(
			{ top: 100, left: 100, width: 100, height: 40 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { open: false });
		expect(result.current.x).toBe(0);
		expect(result.current.y).toBe(0);
	});

	it('recomputes on window resize', () => {
		const { reference, floating } = setupElements(
			{ top: 100, left: 100, width: 100, height: 40 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, { side: 'bottom' });
		const initialY = result.current.y;

		// Move the reference and dispatch resize so update() runs.
		reference.getBoundingClientRect = () => makeRect({ top: 300, left: 100, width: 100, height: 40 });
		act(() => {
			window.dispatchEvent(new Event('resize'));
		});
		expect(result.current.y).not.toBe(initialY);
		expect(result.current.y).toBe(348);
	});

	it('returns an update function that re-runs positioning', () => {
		const { reference, floating } = setupElements(
			{ top: 100, left: 100, width: 100, height: 40 },
			{ width: 80, height: 30 },
		);
		const { result } = renderFloating(reference, floating, {});
		const initialY = result.current.y;

		reference.getBoundingClientRect = () => makeRect({ top: 500, left: 100, width: 100, height: 40 });
		act(() => {
			result.current.update();
		});
		expect(result.current.y).not.toBe(initialY);
		expect(result.current.y).toBe(548);
	});
});
