import { renderHook, act } from '@testing-library/react';
import { useOnlineStatus } from '@/hooks/use-online-status';

function setOnline(value: boolean) {
	Object.defineProperty(navigator, 'onLine', {
		configurable: true,
		get: () => value,
	});
}

describe('useOnlineStatus', () => {
	beforeEach(() => {
		setOnline(true);
	});

	afterEach(() => {
		setOnline(true);
	});

	it('returns true when navigator.onLine is true', () => {
		setOnline(true);
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current).toBe(true);
	});

	it('returns false when navigator.onLine is false', () => {
		setOnline(false);
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current).toBe(false);
	});

	it('updates when offline event fires', () => {
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current).toBe(true);
		act(() => {
			setOnline(false);
			window.dispatchEvent(new Event('offline'));
		});
		expect(result.current).toBe(false);
	});

	it('updates when online event fires', () => {
		setOnline(false);
		const { result } = renderHook(() => useOnlineStatus());
		expect(result.current).toBe(false);
		act(() => {
			setOnline(true);
			window.dispatchEvent(new Event('online'));
		});
		expect(result.current).toBe(true);
	});

	it('removes online/offline listeners on unmount', () => {
		const removeSpy = vi.spyOn(window, 'removeEventListener');
		const { unmount } = renderHook(() => useOnlineStatus());
		unmount();
		expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
	});

	it('supports multiple instances staying in sync', () => {
		const { result: a } = renderHook(() => useOnlineStatus());
		const { result: b } = renderHook(() => useOnlineStatus());
		act(() => {
			setOnline(false);
			window.dispatchEvent(new Event('offline'));
		});
		expect(a.current).toBe(false);
		expect(b.current).toBe(false);
	});
});
