import { onMounted, onUnmounted, reactive } from 'vue';

export interface WindowSize {
	width: number;
	height: number;
}

/**
 * Returns a reactive `{ width, height }` reflecting `window.innerWidth` / `innerHeight`.
 *
 * Updates on `resize` and `orientationchange`. SSR-safe — returns `{0, 0}` until
 * mounted on the client.
 *
 * @example
 * const size = useWindowSize()
 * const isMobile = computed(() => size.width < 640)
 */
export function useWindowSize(): WindowSize {
	const size = reactive<WindowSize>({
		width: typeof window === 'undefined' ? 0 : window.innerWidth,
		height: typeof window === 'undefined' ? 0 : window.innerHeight,
	});

	function update() {
		size.width = window.innerWidth;
		size.height = window.innerHeight;
	}

	onMounted(() => {
		update();
		window.addEventListener('resize', update);
		window.addEventListener('orientationchange', update);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', update);
		window.removeEventListener('orientationchange', update);
	});

	return size;
}
