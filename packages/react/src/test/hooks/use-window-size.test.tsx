import { act, renderHook } from '@testing-library/react';
import { useWindowSize } from '@/hooks/use-window-size';

function setWindowSize(width: number, height: number) {
	Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
	Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
}

const originalWidth = window.innerWidth;
const originalHeight = window.innerHeight;

afterEach(() => {
	setWindowSize(originalWidth, originalHeight);
});

describe('useWindowSize', () => {
	it('returns the current window dimensions on mount', () => {
		setWindowSize(1024, 768);
		const { result } = renderHook(() => useWindowSize());
		expect(result.current).toEqual({ width: 1024, height: 768 });
	});

	it('updates on window resize events', () => {
		setWindowSize(1024, 768);
		const { result } = renderHook(() => useWindowSize());

		act(() => {
			setWindowSize(800, 600);
			window.dispatchEvent(new Event('resize'));
		});
		expect(result.current).toEqual({ width: 800, height: 600 });
	});

	it('updates on orientationchange events', () => {
		setWindowSize(800, 600);
		const { result } = renderHook(() => useWindowSize());

		act(() => {
			setWindowSize(600, 800);
			window.dispatchEvent(new Event('orientationchange'));
		});
		expect(result.current).toEqual({ width: 600, height: 800 });
	});

	it('returns a stable reference when the size has not changed', () => {
		setWindowSize(1200, 900);
		const { result, rerender } = renderHook(() => useWindowSize());
		const first = result.current;
		rerender();
		expect(result.current).toBe(first);
	});

	it('removes listeners on unmount', () => {
		const removeSpy = vi.spyOn(window, 'removeEventListener');
		const { unmount } = renderHook(() => useWindowSize());
		unmount();
		const removed = removeSpy.mock.calls.map((c) => c[0]);
		expect(removed).toContain('resize');
		expect(removed).toContain('orientationchange');
		removeSpy.mockRestore();
	});

	it('subscribes to resize and orientationchange on mount', () => {
		const addSpy = vi.spyOn(window, 'addEventListener');
		renderHook(() => useWindowSize());
		const added = addSpy.mock.calls.map((c) => c[0]);
		expect(added).toContain('resize');
		expect(added).toContain('orientationchange');
		addSpy.mockRestore();
	});
});
