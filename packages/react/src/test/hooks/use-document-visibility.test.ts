import { renderHook, act } from '@testing-library/react';
import { useDocumentVisibility } from '@/hooks/use-document-visibility';

function setVisibility(state: DocumentVisibilityState) {
	Object.defineProperty(document, 'visibilityState', {
		configurable: true,
		get: () => state,
	});
}

describe('useDocumentVisibility', () => {
	beforeEach(() => {
		setVisibility('visible');
	});

	afterEach(() => {
		setVisibility('visible');
	});

	it('returns current visibility state on mount', () => {
		setVisibility('visible');
		const { result } = renderHook(() => useDocumentVisibility());
		expect(result.current).toBe('visible');
	});

	it('reflects hidden state when document.visibilityState is "hidden"', () => {
		setVisibility('hidden');
		const { result } = renderHook(() => useDocumentVisibility());
		expect(result.current).toBe('hidden');
	});

	it('updates when visibilitychange event fires', () => {
		const { result } = renderHook(() => useDocumentVisibility());
		expect(result.current).toBe('visible');
		act(() => {
			setVisibility('hidden');
			document.dispatchEvent(new Event('visibilitychange'));
		});
		expect(result.current).toBe('hidden');
		act(() => {
			setVisibility('visible');
			document.dispatchEvent(new Event('visibilitychange'));
		});
		expect(result.current).toBe('visible');
	});

	it('removes listener on unmount', () => {
		const removeSpy = vi.spyOn(document, 'removeEventListener');
		const { unmount } = renderHook(() => useDocumentVisibility());
		unmount();
		expect(removeSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
	});

	it('supports multiple independent instances', () => {
		const { result: a } = renderHook(() => useDocumentVisibility());
		const { result: b } = renderHook(() => useDocumentVisibility());
		expect(a.current).toBe('visible');
		expect(b.current).toBe('visible');
		act(() => {
			setVisibility('hidden');
			document.dispatchEvent(new Event('visibilitychange'));
		});
		expect(a.current).toBe('hidden');
		expect(b.current).toBe('hidden');
	});
});
