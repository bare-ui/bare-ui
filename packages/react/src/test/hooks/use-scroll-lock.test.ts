import { renderHook } from '@testing-library/react';
import { useScrollLock } from '@/hooks/use-scroll-lock';

describe('useScrollLock', () => {
	beforeEach(() => {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
	});

	afterEach(() => {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
	});

	it('does nothing when active is false', () => {
		renderHook(() => useScrollLock(false));
		expect(document.body.style.overflow).toBe('');
	});

	it('sets body overflow to hidden when active', () => {
		renderHook(() => useScrollLock(true));
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body overflow on unmount', () => {
		document.body.style.overflow = 'auto';
		const { unmount } = renderHook(() => useScrollLock(true));
		expect(document.body.style.overflow).toBe('hidden');
		unmount();
		expect(document.body.style.overflow).toBe('auto');
	});

	it('toggles lock when active prop changes', () => {
		const { rerender } = renderHook(({ active }: { active: boolean }) => useScrollLock(active), {
			initialProps: { active: false },
		});
		expect(document.body.style.overflow).toBe('');
		rerender({ active: true });
		expect(document.body.style.overflow).toBe('hidden');
		rerender({ active: false });
		expect(document.body.style.overflow).toBe('');
	});

	it('keeps lock active while any consumer holds it (refcount)', () => {
		const a = renderHook(() => useScrollLock(true));
		const b = renderHook(() => useScrollLock(true));
		expect(document.body.style.overflow).toBe('hidden');
		a.unmount();
		// Still locked while b remains mounted
		expect(document.body.style.overflow).toBe('hidden');
		b.unmount();
		expect(document.body.style.overflow).toBe('');
	});

	it('compensates for scrollbar width with body paddingRight', () => {
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
		Object.defineProperty(document.documentElement, 'clientWidth', {
			configurable: true,
			value: 1009,
		});
		const { unmount } = renderHook(() => useScrollLock(true));
		expect(document.body.style.paddingRight).toBe('15px');
		unmount();
		expect(document.body.style.paddingRight).toBe('');
	});

	it('does not add paddingRight when there is no scrollbar', () => {
		Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
		Object.defineProperty(document.documentElement, 'clientWidth', {
			configurable: true,
			value: 1024,
		});
		renderHook(() => useScrollLock(true));
		expect(document.body.style.paddingRight).toBe('');
	});
});
