import { renderHook, waitFor } from '@testing-library/react';
import { useRef } from 'react';
import { useMutationObserver } from '@/hooks/use-mutation-observer';

describe('useMutationObserver', () => {
	it('does not invoke the callback before any mutation', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const cb = vi.fn();
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			useMutationObserver(ref, cb);
		});
		expect(cb).not.toHaveBeenCalled();
		document.body.removeChild(el);
	});

	it('invokes the callback when an observed attribute changes', async () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const cb = vi.fn();
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			useMutationObserver(ref, cb, { attributes: true });
		});

		el.setAttribute('data-x', '1');
		await waitFor(() => expect(cb).toHaveBeenCalled());
		const records = cb.mock.calls[0]![0] as MutationRecord[];
		expect(records[0]!.type).toBe('attributes');
		document.body.removeChild(el);
	});

	it('invokes the callback when a child node is added with childList: true', async () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const cb = vi.fn();
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			useMutationObserver(ref, cb, { childList: true });
		});

		el.appendChild(document.createElement('span'));
		await waitFor(() => expect(cb).toHaveBeenCalled());
		const records = cb.mock.calls[0]![0] as MutationRecord[];
		expect(records[0]!.type).toBe('childList');
		document.body.removeChild(el);
	});

	it('skips observation when enabled is false', async () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const cb = vi.fn();
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			useMutationObserver(ref, cb, { enabled: false, attributes: true });
		});

		el.setAttribute('data-x', '1');
		// Give microtasks a chance to flush.
		await new Promise((r) => setTimeout(r, 10));
		expect(cb).not.toHaveBeenCalled();
		document.body.removeChild(el);
	});

	it('does not observe when ref.current is null', async () => {
		const cb = vi.fn();
		renderHook(() => {
			const ref = useRef<HTMLDivElement>(null);
			useMutationObserver(ref, cb, { attributes: true });
		});
		await new Promise((r) => setTimeout(r, 10));
		expect(cb).not.toHaveBeenCalled();
	});

	it('stops observing after unmount', async () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const cb = vi.fn();
		const { unmount } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(el);
			useMutationObserver(ref, cb, { attributes: true });
		});

		unmount();
		el.setAttribute('data-x', '1');
		await new Promise((r) => setTimeout(r, 10));
		expect(cb).not.toHaveBeenCalled();
		document.body.removeChild(el);
	});

	it('always calls the latest callback reference', async () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const first = vi.fn();
		const second = vi.fn();
		const { rerender } = renderHook(
			({ cb }: { cb: MutationCallback }) => {
				const ref = useRef<HTMLDivElement>(el);
				useMutationObserver(ref, cb, { attributes: true });
			},
			{ initialProps: { cb: first as unknown as MutationCallback } },
		);

		rerender({ cb: second as unknown as MutationCallback });
		el.setAttribute('data-x', '1');
		await waitFor(() => expect(second).toHaveBeenCalled());
		expect(first).not.toHaveBeenCalled();
		document.body.removeChild(el);
	});
});
