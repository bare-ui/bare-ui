import { render } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { useWindowSize, type WindowSize } from '@/composables/use-window-size';

function setWindowSize(width: number, height: number) {
	Object.defineProperty(window, 'innerWidth', { configurable: true, value: width });
	Object.defineProperty(window, 'innerHeight', { configurable: true, value: height });
}

describe('useWindowSize', () => {
	const originalWidth = window.innerWidth;
	const originalHeight = window.innerHeight;

	afterEach(() => {
		setWindowSize(originalWidth, originalHeight);
	});

	it('returns the initial window dimensions', () => {
		setWindowSize(1024, 768);
		let size!: WindowSize;
		const Harness = defineComponent({
			setup() {
				size = useWindowSize();
				return () => h('div');
			},
		});
		render(Harness);
		expect(size.width).toBe(1024);
		expect(size.height).toBe(768);
	});

	it('updates on the resize event', () => {
		setWindowSize(1024, 768);
		let size!: WindowSize;
		const Harness = defineComponent({
			setup() {
				size = useWindowSize();
				return () => h('div');
			},
		});
		render(Harness);
		setWindowSize(800, 600);
		window.dispatchEvent(new Event('resize'));
		expect(size.width).toBe(800);
		expect(size.height).toBe(600);
	});

	it('updates on the orientationchange event', () => {
		setWindowSize(1024, 768);
		let size!: WindowSize;
		const Harness = defineComponent({
			setup() {
				size = useWindowSize();
				return () => h('div');
			},
		});
		render(Harness);
		setWindowSize(768, 1024);
		window.dispatchEvent(new Event('orientationchange'));
		expect(size.width).toBe(768);
		expect(size.height).toBe(1024);
	});

	it('removes listeners on unmount', () => {
		setWindowSize(1024, 768);
		let size!: WindowSize;
		const Harness = defineComponent({
			setup() {
				size = useWindowSize();
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		unmount();
		setWindowSize(500, 500);
		window.dispatchEvent(new Event('resize'));
		expect(size.width).toBe(1024);
		expect(size.height).toBe(768);
	});
});
