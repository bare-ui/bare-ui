import { renderHook } from '@solidjs/testing-library';
import { createWindowSize } from '@/primitives/create-window-size';

function setWindowSize(width: number, height: number) {
	Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
	Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
}

describe('createWindowSize', () => {
	const originalWidth = window.innerWidth;
	const originalHeight = window.innerHeight;

	afterEach(() => setWindowSize(originalWidth, originalHeight));

	it('returns the initial window dimensions', () => {
		setWindowSize(1024, 768);
		const { result, cleanup } = renderHook(() => createWindowSize());
		expect(result()).toEqual({ width: 1024, height: 768 });
		cleanup();
	});

	it('updates on resize', () => {
		setWindowSize(1024, 768);
		const { result, cleanup } = renderHook(() => createWindowSize());
		setWindowSize(800, 600);
		window.dispatchEvent(new Event('resize'));
		expect(result()).toEqual({ width: 800, height: 600 });
		cleanup();
	});

	it('updates on orientationchange', () => {
		setWindowSize(1024, 768);
		const { result, cleanup } = renderHook(() => createWindowSize());
		setWindowSize(768, 1024);
		window.dispatchEvent(new Event('orientationchange'));
		expect(result()).toEqual({ width: 768, height: 1024 });
		cleanup();
	});

	it('removes listeners on cleanup', () => {
		setWindowSize(1024, 768);
		const { result, cleanup } = renderHook(() => createWindowSize());
		cleanup();
		setWindowSize(500, 500);
		window.dispatchEvent(new Event('resize'));
		expect(result()).toEqual({ width: 1024, height: 768 });
	});
});
