import { renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef } from 'react';
import { useFocusTrap, type UseFocusTrapOptions } from '@/hooks/use-focus-trap';

interface Setup {
	container: HTMLDivElement;
	first: HTMLButtonElement;
	middle: HTMLButtonElement;
	last: HTMLButtonElement;
}

function buildContainer(): Setup {
	const container = document.createElement('div');
	const first = document.createElement('button');
	first.textContent = 'first';
	const middle = document.createElement('button');
	middle.textContent = 'middle';
	const last = document.createElement('button');
	last.textContent = 'last';

	// Stub offsetParent so getFocusable() considers them visible in jsdom.
	for (const el of [first, middle, last]) {
		Object.defineProperty(el, 'offsetParent', { configurable: true, get: () => document.body });
	}

	container.appendChild(first);
	container.appendChild(middle);
	container.appendChild(last);
	document.body.appendChild(container);
	return { container, first, middle, last };
}

function renderTrap(container: HTMLElement, options: UseFocusTrapOptions) {
	return renderHook(
		(opts: UseFocusTrapOptions) => {
			const ref = useRef<HTMLElement | null>(container);
			useFocusTrap(ref, opts);
		},
		{ initialProps: options },
	);
}

describe('useFocusTrap', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('moves focus to the first focusable child when activated', () => {
		const { container, first } = buildContainer();
		renderTrap(container, { active: true });
		expect(document.activeElement).toBe(first);
	});

	it('does not move focus when inactive', () => {
		const outside = document.createElement('button');
		document.body.appendChild(outside);
		outside.focus();

		const { container } = buildContainer();
		renderTrap(container, { active: false });
		expect(document.activeElement).toBe(outside);
	});

	it('cycles forward from last to first on Tab', async () => {
		const user = userEvent.setup();
		const { container, first, last } = buildContainer();
		renderTrap(container, { active: true });

		last.focus();
		await user.tab();
		expect(document.activeElement).toBe(first);
	});

	it('cycles backward from first to last on Shift+Tab', async () => {
		const user = userEvent.setup();
		const { container, first, last } = buildContainer();
		renderTrap(container, { active: true });

		first.focus();
		await user.tab({ shift: true });
		expect(document.activeElement).toBe(last);
	});

	it('restores focus to the previously focused element on deactivation', () => {
		const trigger = document.createElement('button');
		document.body.appendChild(trigger);
		trigger.focus();
		expect(document.activeElement).toBe(trigger);

		const { container } = buildContainer();
		const { unmount } = renderTrap(container, { active: true });
		unmount();
		expect(document.activeElement).toBe(trigger);
	});

	it('does not restore focus when returnFocus is false', () => {
		const trigger = document.createElement('button');
		document.body.appendChild(trigger);
		trigger.focus();

		const { container } = buildContainer();
		const { unmount } = renderTrap(container, { active: true, returnFocus: false });
		unmount();
		expect(document.activeElement).not.toBe(trigger);
	});

	it('focuses the provided initialFocus element instead of the first focusable', () => {
		const { container, middle } = buildContainer();
		renderTrap(container, { active: true, initialFocus: middle });
		expect(document.activeElement).toBe(middle);
	});

	it('focuses the element pointed to by an initialFocus ref', () => {
		const { container, last } = buildContainer();
		const ref = { current: last } as { current: HTMLElement | null };
		renderTrap(container, { active: true, initialFocus: ref });
		expect(document.activeElement).toBe(last);
	});

	it('toggles trapping based on the active flag', async () => {
		const user = userEvent.setup();
		const { container, first, last } = buildContainer();
		const { rerender } = renderTrap(container, { active: true });
		expect(document.activeElement).toBe(first);

		// Disable the trap; tabbing past `last` should no longer cycle back to `first`.
		rerender({ active: false });
		last.focus();
		await user.tab();
		expect(document.activeElement).not.toBe(first);
	});

	it('removes the keydown listener on unmount', async () => {
		const user = userEvent.setup();
		const { container, last } = buildContainer();
		const { unmount } = renderTrap(container, { active: true });
		unmount();
		last.focus();
		await act(async () => {
			await user.tab();
		});
		// Without the trap listener, focus should not cycle back to first.
		expect(document.activeElement).not.toBe(container.firstChild);
	});
});
