import { render } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createFocusTrap } from '@/primitives/create-focus-trap';

function stubOffsetParent(el: HTMLElement) {
	Object.defineProperty(el, 'offsetParent', { configurable: true, get: () => document.body });
}

function fireTab(shift = false) {
	const event = new KeyboardEvent('keydown', {
		key: 'Tab',
		bubbles: true,
		cancelable: true,
		shiftKey: shift,
	});
	document.dispatchEvent(event);
	return event;
}

function Trap(props: { active: boolean | (() => boolean); returnFocus?: boolean }) {
	let trap: HTMLDivElement | undefined;
	createFocusTrap(() => trap, {
		get active() {
			return typeof props.active === 'function' ? props.active() : props.active;
		},
		get returnFocus() {
			return props.returnFocus;
		},
	});
	return (
		<div
			ref={(el) => {
				trap = el;
				stubOffsetParent(el);
			}}
		>
			<button
				data-testid='first'
				ref={stubOffsetParent}
			>
				first
			</button>
			<button
				data-testid='last'
				ref={stubOffsetParent}
			>
				last
			</button>
		</div>
	);
}

describe('createFocusTrap', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('focuses the first focusable element on activation', async () => {
		const [active, setActive] = createSignal(false);
		const { getByTestId } = render(() => <Trap active={active} />);
		setActive(true);
		await new Promise<void>((r) => queueMicrotask(r));
		expect(document.activeElement).toBe(getByTestId('first'));
	});

	it('Tab from last focusable wraps to first', async () => {
		const [active, setActive] = createSignal(false);
		const { getByTestId } = render(() => <Trap active={active} />);
		setActive(true);
		await new Promise<void>((r) => queueMicrotask(r));
		getByTestId('last').focus();
		fireTab(false);
		expect(document.activeElement).toBe(getByTestId('first'));
	});

	it('Shift+Tab from first focusable wraps to last', async () => {
		const [active, setActive] = createSignal(false);
		const { getByTestId } = render(() => <Trap active={active} />);
		setActive(true);
		await new Promise<void>((r) => queueMicrotask(r));
		getByTestId('first').focus();
		fireTab(true);
		expect(document.activeElement).toBe(getByTestId('last'));
	});

	it('restores focus to the previously-focused element when deactivated', async () => {
		const previous = document.createElement('button');
		document.body.appendChild(previous);
		stubOffsetParent(previous);
		previous.focus();

		const [active, setActive] = createSignal(false);
		render(() => <Trap active={active} />);
		setActive(true);
		await new Promise<void>((r) => queueMicrotask(r));
		setActive(false);
		expect(document.activeElement).toBe(previous);
	});

	it('does not restore focus when returnFocus is false', async () => {
		const previous = document.createElement('button');
		document.body.appendChild(previous);
		stubOffsetParent(previous);
		previous.focus();

		const [active, setActive] = createSignal(false);
		render(() => <Trap active={active} returnFocus={false} />);
		setActive(true);
		await new Promise<void>((r) => queueMicrotask(r));
		expect(document.activeElement).not.toBe(previous);
		setActive(false);
		expect(document.activeElement).not.toBe(previous);
	});

	it('does not intercept Tab when inactive', async () => {
		const { getByTestId } = render(() => <Trap active={false} />);
		await new Promise<void>((r) => queueMicrotask(r));
		getByTestId('last').focus();
		fireTab(false);
		expect(document.activeElement).toBe(getByTestId('last'));
	});
});
