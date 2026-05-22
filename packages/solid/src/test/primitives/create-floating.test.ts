import { renderHook } from '@solidjs/testing-library';
import { createFloating } from '@/primitives/create-floating';

describe('createFloating', () => {
	it('returns accessors for position, side, align, strategy and styles', () => {
		const ref = document.createElement('button');
		const float = document.createElement('div');
		const { result, cleanup } = renderHook(() => createFloating(() => ref, () => float));
		expect(typeof result.x()).toBe('number');
		expect(typeof result.y()).toBe('number');
		expect(['top', 'right', 'bottom', 'left']).toContain(result.side());
		expect(['start', 'center', 'end']).toContain(result.align());
		expect(result.strategy).toBe('absolute');
		expect(result.floatingStyles()).toMatchObject({
			position: 'absolute',
			top: '0',
			left: '0',
		});
		cleanup();
	});

	it('uses the configured strategy', () => {
		const ref = document.createElement('button');
		const float = document.createElement('div');
		const { result, cleanup } = renderHook(() => createFloating(() => ref, () => float, { strategy: 'fixed' }));
		expect(result.strategy).toBe('fixed');
		expect(result.floatingStyles().position).toBe('fixed');
		cleanup();
	});

	it('uses the configured side and align as defaults (flip disabled)', () => {
		const ref = document.createElement('button');
		const float = document.createElement('div');
		const { result, cleanup } = renderHook(() =>
			createFloating(() => ref, () => float, { side: 'top', align: 'end', flip: false }),
		);
		expect(result.side()).toBe('top');
		expect(result.align()).toBe('end');
		cleanup();
	});

	it('exposes a translate3d transform on floatingStyles', () => {
		const ref = document.createElement('button');
		const float = document.createElement('div');
		const { result, cleanup } = renderHook(() => createFloating(() => ref, () => float));
		expect(result.floatingStyles().transform).toMatch(/^translate3d\(/);
		cleanup();
	});

	it('attaches scroll/resize listeners on mount and removes them on cleanup', () => {
		const addSpy = vi.spyOn(window, 'addEventListener');
		const removeSpy = vi.spyOn(window, 'removeEventListener');
		const ref = document.createElement('button');
		const float = document.createElement('div');
		const { cleanup } = renderHook(() => createFloating(() => ref, () => float));
		expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
		expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
		cleanup();
		expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
		expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
		addSpy.mockRestore();
		removeSpy.mockRestore();
	});

	it('update() does not throw when both refs resolve', () => {
		const ref = document.createElement('button');
		const float = document.createElement('div');
		const { result, cleanup } = renderHook(() => createFloating(() => ref, () => float));
		expect(() => result.update()).not.toThrow();
		cleanup();
	});
});
