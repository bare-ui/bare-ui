import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useFloating, type UseFloatingResult } from '@/composables/use-floating';

function mount(setupFn: () => { reference: ReturnType<typeof ref>; floating: ReturnType<typeof ref>; result: UseFloatingResult }) {
	let captured!: ReturnType<typeof setupFn>;
	const Harness = defineComponent({
		setup() {
			captured = setupFn();
			const { reference, floating } = captured;
			return () =>
				h('div', [
					h('button', { ref: reference, 'data-testid': 'reference' }, 'ref'),
					h('div', { ref: floating, 'data-testid': 'floating' }, 'floating'),
				]);
		},
	});
	const utils = render(Harness);
	return { ...captured, ...utils };
}

describe('useFloating', () => {
	const originalAddEventListener = window.addEventListener;
	const originalRemoveEventListener = window.removeEventListener;

	it('returns refs for position, side, align, strategy and styles', () => {
		const { result } = mount(() => {
			const reference = ref<HTMLButtonElement | null>(null);
			const floating = ref<HTMLDivElement | null>(null);
			const result = useFloating(reference, floating);
			return { reference, floating, result };
		});
		expect(typeof result.x.value).toBe('number');
		expect(typeof result.y.value).toBe('number');
		expect(['top', 'right', 'bottom', 'left']).toContain(result.side.value);
		expect(['start', 'center', 'end']).toContain(result.align.value);
		expect(result.strategy.value).toBe('absolute');
		expect(result.floatingStyles.value).toMatchObject({
			position: 'absolute',
			top: '0',
			left: '0',
		});
	});

	it('uses the configured strategy', () => {
		const { result } = mount(() => {
			const reference = ref<HTMLButtonElement | null>(null);
			const floating = ref<HTMLDivElement | null>(null);
			const r = useFloating(reference, floating, { strategy: 'fixed' });
			return { reference, floating, result: r };
		});
		expect(result.strategy.value).toBe('fixed');
		expect(result.floatingStyles.value.position).toBe('fixed');
	});

	it('uses the configured side and align as defaults', () => {
		const { result } = mount(() => {
			const reference = ref<HTMLButtonElement | null>(null);
			const floating = ref<HTMLDivElement | null>(null);
			const r = useFloating(reference, floating, { side: 'top', align: 'end', flip: false });
			return { reference, floating, result: r };
		});
		expect(result.side.value).toBe('top');
		expect(result.align.value).toBe('end');
	});

	it('exposes a translate3d transform on floatingStyles', () => {
		const { result } = mount(() => {
			const reference = ref<HTMLButtonElement | null>(null);
			const floating = ref<HTMLDivElement | null>(null);
			const r = useFloating(reference, floating);
			return { reference, floating, result: r };
		});
		expect(result.floatingStyles.value.transform).toMatch(/^translate3d\(/);
	});

	it('attaches scroll/resize listeners on mount and removes them on unmount', () => {
		const addSpy = vi.spyOn(window, 'addEventListener');
		const removeSpy = vi.spyOn(window, 'removeEventListener');
		const { unmount } = mount(() => {
			const reference = ref<HTMLButtonElement | null>(null);
			const floating = ref<HTMLDivElement | null>(null);
			const r = useFloating(reference, floating);
			return { reference, floating, result: r };
		});
		expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
		expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
		unmount();
		expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
		expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
		addSpy.mockRestore();
		removeSpy.mockRestore();
		window.addEventListener = originalAddEventListener;
		window.removeEventListener = originalRemoveEventListener;
	});

	it('update() does not throw when both refs resolve', async () => {
		const { result } = mount(() => {
			const reference = ref<HTMLButtonElement | null>(null);
			const floating = ref<HTMLDivElement | null>(null);
			const r = useFloating(reference, floating);
			return { reference, floating, result: r };
		});
		await nextTick();
		expect(() => result.update()).not.toThrow();
	});
});
