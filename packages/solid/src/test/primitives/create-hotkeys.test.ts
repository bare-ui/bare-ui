import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createHotkeys } from '@/primitives/create-hotkeys';

function fire(key: string, init: Partial<KeyboardEventInit> = {}, target: EventTarget = window) {
	const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
	target.dispatchEvent(event);
	return event;
}

describe('createHotkeys', () => {
	it('fires a single-key handler', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createHotkeys({ escape: handler }));
		fire('Escape');
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('matches mod combos (ctrl on non-mac)', () => {
		Object.defineProperty(navigator, 'platform', { configurable: true, value: 'Linux x86_64' });
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createHotkeys({ 'mod+k': handler }));
		fire('k', { ctrlKey: true });
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('matches shift combos', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createHotkeys({ 'shift+a': handler }));
		fire('a', { shiftKey: true });
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('disallows extra modifiers when none are requested', () => {
		Object.defineProperty(navigator, 'platform', { configurable: true, value: 'Linux x86_64' });
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createHotkeys({ k: handler }));
		fire('k', { ctrlKey: true });
		expect(handler).not.toHaveBeenCalled();
		fire('k');
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('does not fire for non-matching keys', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createHotkeys({ Enter: handler }));
		fire('Escape');
		expect(handler).not.toHaveBeenCalled();
		cleanup();
	});

	it('calls preventDefault by default', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createHotkeys({ escape: handler }));
		const event = fire('Escape');
		expect(event.defaultPrevented).toBe(true);
		cleanup();
	});

	it('does not call preventDefault when disabled via option', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createHotkeys({ escape: handler }, { preventDefault: false }));
		const event = fire('Escape');
		expect(event.defaultPrevented).toBe(false);
		cleanup();
	});

	it('suppresses hotkeys when focus is inside an input', () => {
		const handler = vi.fn();
		const input = document.createElement('input');
		document.body.appendChild(input);
		const { cleanup } = renderHook(() => createHotkeys({ escape: handler }));
		input.focus();
		fire('Escape', {}, input);
		expect(handler).not.toHaveBeenCalled();
		cleanup();
		document.body.removeChild(input);
	});

	it('fires in inputs when enableInInputs is true', () => {
		const handler = vi.fn();
		const input = document.createElement('input');
		document.body.appendChild(input);
		const { cleanup } = renderHook(() => createHotkeys({ escape: handler }, { enableInInputs: true }));
		fire('Escape', {}, input);
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
		document.body.removeChild(input);
	});

	it('respects activeScopes (reactive via getter)', () => {
		const handler = vi.fn();
		const [scopes, setScopes] = createSignal<string[]>(['*']);
		const { cleanup } = renderHook(() =>
			createHotkeys({ escape: handler }, {
				scope: 'modal',
				get activeScopes() {
					return scopes();
				},
			}),
		);
		fire('Escape');
		expect(handler).not.toHaveBeenCalled();
		setScopes(['modal']);
		fire('Escape');
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('removes the listener on cleanup', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createHotkeys({ escape: handler }));
		cleanup();
		fire('Escape');
		expect(handler).not.toHaveBeenCalled();
	});
});
