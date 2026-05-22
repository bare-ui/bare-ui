import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useEventListener } from '@/hooks/use-event-listener';

describe('useEventListener', () => {
	it('subscribes to window events by default', () => {
		const handler = vi.fn();
		renderHook(() => useEventListener('resize', handler));
		window.dispatchEvent(new Event('resize'));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('subscribes to document events when target is document', () => {
		const handler = vi.fn();
		renderHook(() => useEventListener('click', handler, document));
		document.dispatchEvent(new MouseEvent('click'));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('subscribes to a specific HTMLElement', () => {
		const el = document.createElement('button');
		document.body.appendChild(el);
		const handler = vi.fn();
		renderHook(() => useEventListener('click', handler, el));
		el.dispatchEvent(new MouseEvent('click'));
		expect(handler).toHaveBeenCalledTimes(1);
		document.body.removeChild(el);
	});

	it('subscribes via a ref', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const handler = vi.fn();
		renderHook(() => {
			const ref = useRef<HTMLDivElement | null>(el);
			useEventListener('click', handler, ref);
		});
		el.dispatchEvent(new MouseEvent('click'));
		expect(handler).toHaveBeenCalledTimes(1);
		document.body.removeChild(el);
	});

	it('does nothing when ref.current is null', () => {
		const handler = vi.fn();
		renderHook(() => {
			const ref = useRef<HTMLDivElement | null>(null);
			useEventListener('click', handler, ref);
		});
		document.body.dispatchEvent(new MouseEvent('click'));
		expect(handler).not.toHaveBeenCalled();
	});

	it('removes the listener on unmount', () => {
		const handler = vi.fn();
		const { unmount } = renderHook(() => useEventListener('resize', handler));
		unmount();
		window.dispatchEvent(new Event('resize'));
		expect(handler).not.toHaveBeenCalled();
	});

	it('always calls the latest handler without resubscribing', () => {
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = renderHook(({ h }: { h: () => void }) => useEventListener('resize', h), {
			initialProps: { h: first },
		});
		window.dispatchEvent(new Event('resize'));
		expect(first).toHaveBeenCalledTimes(1);

		rerender({ h: second });
		window.dispatchEvent(new Event('resize'));
		expect(second).toHaveBeenCalledTimes(1);
		expect(first).toHaveBeenCalledTimes(1);
	});

	it('passes the event object to the handler', () => {
		const handler = vi.fn();
		renderHook(() => useEventListener('keydown', handler, document));
		const evt = new KeyboardEvent('keydown', { key: 'a' });
		document.dispatchEvent(evt);
		expect(handler).toHaveBeenCalledWith(evt);
	});
});
