import { renderHook } from '@testing-library/react';
import { useKeyboard } from '@/hooks/use-keyboard';

function fireKey(init: KeyboardEventInit, target: EventTarget = window, type: 'keydown' | 'keyup' = 'keydown') {
	target.dispatchEvent(new KeyboardEvent(type, init));
}

describe('useKeyboard', () => {
	it('fires the handler when key matches', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboard({ Escape: handler }));
		fireKey({ key: 'Escape' });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('matches case-insensitively', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboard({ escape: handler }));
		fireKey({ key: 'Escape' });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('requires modifier when tuple specifies meta:true', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboard({ s: [handler, { meta: true }] }));
		fireKey({ key: 's' });
		expect(handler).not.toHaveBeenCalled();
		fireKey({ key: 's', metaKey: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('explicit modifier:false requires it to be off', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboard({ s: [handler, { shift: false }] }));
		fireKey({ key: 's', shiftKey: true });
		expect(handler).not.toHaveBeenCalled();
		fireKey({ key: 's' });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('calls preventDefault and stopPropagation when configured', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboard({ Enter: [handler, { preventDefault: true, stopPropagation: true }] }));
		const evt = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
		const pd = vi.spyOn(evt, 'preventDefault');
		const sp = vi.spyOn(evt, 'stopPropagation');
		window.dispatchEvent(evt);
		expect(pd).toHaveBeenCalledTimes(1);
		expect(sp).toHaveBeenCalledTimes(1);
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('does not call preventDefault by default', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboard({ Enter: handler }));
		const evt = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
		const pd = vi.spyOn(evt, 'preventDefault');
		window.dispatchEvent(evt);
		expect(pd).not.toHaveBeenCalled();
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('listens on the given event type (keyup)', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboard({ a: handler }, { event: 'keyup' }));
		fireKey({ key: 'a' }, window, 'keydown');
		expect(handler).not.toHaveBeenCalled();
		fireKey({ key: 'a' }, window, 'keyup');
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('targets a specific element when provided', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const handler = vi.fn();
		renderHook(() => useKeyboard({ x: handler }, { target: el }));
		fireKey({ key: 'x' }, window);
		expect(handler).not.toHaveBeenCalled();
		fireKey({ key: 'x' }, el);
		expect(handler).toHaveBeenCalledTimes(1);
		document.body.removeChild(el);
	});

	it('is disabled when enabled is false', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboard({ a: handler }, { enabled: false }));
		fireKey({ key: 'a' });
		expect(handler).not.toHaveBeenCalled();
	});

	it('removes listener on unmount', () => {
		const handler = vi.fn();
		const { unmount } = renderHook(() => useKeyboard({ a: handler }));
		unmount();
		fireKey({ key: 'a' });
		expect(handler).not.toHaveBeenCalled();
	});
});
