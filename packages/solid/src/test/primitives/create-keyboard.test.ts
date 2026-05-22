import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createKeyboard } from '@/primitives/create-keyboard';

function fireKey(target: EventTarget, key: string, init: Partial<KeyboardEventInit> = {}) {
	target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init }));
}

describe('createKeyboard', () => {
	it('fires the matching handler on keydown', () => {
		const onEscape = vi.fn();
		const { cleanup } = renderHook(() => createKeyboard({ Escape: onEscape }));
		fireKey(window, 'Escape');
		expect(onEscape).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('matches keys case-insensitively', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createKeyboard({ a: handler }));
		fireKey(window, 'A');
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('does not fire for non-matching keys', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createKeyboard({ Enter: handler }));
		fireKey(window, 'Escape');
		expect(handler).not.toHaveBeenCalled();
		cleanup();
	});

	it('respects modifier requirements', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createKeyboard({ s: [handler, { meta: true }] }));
		fireKey(window, 's');
		expect(handler).not.toHaveBeenCalled();
		fireKey(window, 's', { metaKey: true });
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('calls preventDefault when configured', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() =>
			createKeyboard({ s: [handler, { meta: true, preventDefault: true }] }),
		);
		const event = new KeyboardEvent('keydown', { key: 's', metaKey: true, bubbles: true, cancelable: true });
		window.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
		cleanup();
	});

	it('attaches to the given target element', () => {
		const target = document.createElement('div');
		document.body.appendChild(target);
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createKeyboard({ Enter: handler }, { target }));
		fireKey(target, 'Enter');
		expect(handler).toHaveBeenCalled();
		cleanup();
		document.body.removeChild(target);
	});

	it('removes the listener on cleanup', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createKeyboard({ Escape: handler }));
		cleanup();
		fireKey(window, 'Escape');
		expect(handler).not.toHaveBeenCalled();
	});

	it('toggles attachment via the enabled option', () => {
		const handler = vi.fn();
		const [enabled, setEnabled] = createSignal(false);
		const { cleanup } = renderHook(() =>
			createKeyboard({ Escape: handler }, {
				get enabled() {
					return enabled();
				},
			}),
		);
		fireKey(window, 'Escape');
		expect(handler).not.toHaveBeenCalled();
		setEnabled(true);
		fireKey(window, 'Escape');
		expect(handler).toHaveBeenCalledTimes(1);
		setEnabled(false);
		fireKey(window, 'Escape');
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});
});
