import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createEventListener } from '@/primitives/create-event-listener';

describe('createEventListener', () => {
	it('attaches a listener to a target element', () => {
		const target = document.createElement('button');
		document.body.appendChild(target);
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createEventListener('click', handler, target));
		target.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
		document.body.removeChild(target);
	});

	it('passes the event to the handler', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createEventListener('resize', handler));
		const evt = new Event('resize');
		window.dispatchEvent(evt);
		expect(handler).toHaveBeenCalledWith(evt);
		cleanup();
	});

	it('defaults to window when no target is given', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createEventListener('resize', handler));
		window.dispatchEvent(new Event('resize'));
		expect(handler).toHaveBeenCalledTimes(1);
		cleanup();
	});

	it('attaches to document when document is the target', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createEventListener('click', handler, document));
		document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(handler).toHaveBeenCalled();
		cleanup();
	});

	it('removes the listener on cleanup', () => {
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createEventListener('resize', handler));
		cleanup();
		window.dispatchEvent(new Event('resize'));
		expect(handler).not.toHaveBeenCalled();
	});

	it('reattaches when the target accessor changes', () => {
		const a = document.createElement('div');
		const b = document.createElement('div');
		document.body.append(a, b);
		const handler = vi.fn();
		const [target, setTarget] = createSignal<HTMLDivElement>(a);
		const { cleanup } = renderHook(() => createEventListener('click', handler, target));
		a.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(1);
		setTarget(b);
		a.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(1);
		b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(2);
		cleanup();
		a.remove();
		b.remove();
	});

	it('passes options through to addEventListener', () => {
		const target = document.createElement('div');
		const spy = vi.spyOn(target, 'addEventListener');
		const handler = vi.fn();
		const { cleanup } = renderHook(() => createEventListener('click', handler, target, { passive: true }));
		expect(spy).toHaveBeenCalledWith('click', expect.any(Function), { passive: true });
		cleanup();
	});
});
