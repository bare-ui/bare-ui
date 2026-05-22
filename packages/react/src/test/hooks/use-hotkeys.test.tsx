import { renderHook } from '@testing-library/react';
import { useHotkeys } from '@/hooks/use-hotkeys';

function fireKey(init: KeyboardEventInit, target: EventTarget = window) {
	target.dispatchEvent(new KeyboardEvent('keydown', init));
}

describe('useHotkeys', () => {
	it('fires the handler when a simple key matches', () => {
		const handler = vi.fn();
		renderHook(() => useHotkeys({ k: handler }));
		fireKey({ key: 'k' });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('matches keys case-insensitively', () => {
		const handler = vi.fn();
		renderHook(() => useHotkeys({ K: handler }));
		fireKey({ key: 'k' });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('handles modifier combos (meta+k)', () => {
		const handler = vi.fn();
		renderHook(() => useHotkeys({ 'meta+k': handler }));
		fireKey({ key: 'k', metaKey: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('does not fire when the platform mod key is pressed for an unmodified combo', () => {
		// On jsdom isMac depends on navigator.platform; the hook guards against
		// the platform mod modifier being pressed when the combo did not request it.
		const handler = vi.fn();
		renderHook(() => useHotkeys({ k: handler }));
		const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
		fireKey(isMac ? { key: 'k', metaKey: true } : { key: 'k', ctrlKey: true });
		expect(handler).not.toHaveBeenCalled();
	});

	it('resolves key aliases like esc -> escape and space', () => {
		const escHandler = vi.fn();
		const spaceHandler = vi.fn();
		renderHook(() => useHotkeys({ esc: escHandler, space: spaceHandler }));
		fireKey({ key: 'Escape' });
		fireKey({ key: ' ' });
		expect(escHandler).toHaveBeenCalledTimes(1);
		expect(spaceHandler).toHaveBeenCalledTimes(1);
	});

	it('calls preventDefault by default and skips when disabled', () => {
		const handler = vi.fn();
		renderHook(() => useHotkeys({ k: handler }));
		const evt = new KeyboardEvent('keydown', { key: 'k', cancelable: true });
		const spy = vi.spyOn(evt, 'preventDefault');
		window.dispatchEvent(evt);
		expect(spy).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('does not call preventDefault when preventDefault is false', () => {
		const handler = vi.fn();
		renderHook(() => useHotkeys({ k: handler }, { preventDefault: false }));
		const evt = new KeyboardEvent('keydown', { key: 'k', cancelable: true });
		const spy = vi.spyOn(evt, 'preventDefault');
		window.dispatchEvent(evt);
		expect(spy).not.toHaveBeenCalled();
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('does not fire while focus is in an input by default', () => {
		const input = document.createElement('input');
		document.body.appendChild(input);
		const handler = vi.fn();
		renderHook(() => useHotkeys({ k: handler }));
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true }));
		expect(handler).not.toHaveBeenCalled();
		document.body.removeChild(input);
	});

	it('fires inside inputs when enableInInputs is true', () => {
		const input = document.createElement('input');
		document.body.appendChild(input);
		const handler = vi.fn();
		renderHook(() => useHotkeys({ k: handler }, { enableInInputs: true }));
		input.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(1);
		document.body.removeChild(input);
	});

	it('does nothing when enabled is false', () => {
		const handler = vi.fn();
		renderHook(() => useHotkeys({ k: handler }, { enabled: false }));
		fireKey({ key: 'k' });
		expect(handler).not.toHaveBeenCalled();
	});

	it('respects scopes — only fires when scope is active', () => {
		const modalHandler = vi.fn();
		const { rerender } = renderHook(
			({ scopes }: { scopes: string[] }) =>
				useHotkeys({ k: modalHandler }, { scope: 'modal', activeScopes: scopes }),
			{ initialProps: { scopes: ['*'] } },
		);
		fireKey({ key: 'k' });
		expect(modalHandler).not.toHaveBeenCalled();

		rerender({ scopes: ['modal'] });
		fireKey({ key: 'k' });
		expect(modalHandler).toHaveBeenCalledTimes(1);
	});

	it('removes listener on unmount', () => {
		const handler = vi.fn();
		const { unmount } = renderHook(() => useHotkeys({ k: handler }));
		unmount();
		fireKey({ key: 'k' });
		expect(handler).not.toHaveBeenCalled();
	});
});
