import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from '@/hooks/use-disclosure';

describe('useDisclosure', () => {
	it('defaults isOpen to false', () => {
		const { result } = renderHook(() => useDisclosure());
		expect(result.current.isOpen).toBe(false);
	});

	it('honors defaultOpen=true', () => {
		const { result } = renderHook(() => useDisclosure({ defaultOpen: true }));
		expect(result.current.isOpen).toBe(true);
	});

	it('opens via open()', () => {
		const { result } = renderHook(() => useDisclosure());
		act(() => result.current.open());
		expect(result.current.isOpen).toBe(true);
	});

	it('closes via close()', () => {
		const { result } = renderHook(() => useDisclosure({ defaultOpen: true }));
		act(() => result.current.close());
		expect(result.current.isOpen).toBe(false);
	});

	it('toggles between states', () => {
		const { result } = renderHook(() => useDisclosure());
		act(() => result.current.toggle());
		expect(result.current.isOpen).toBe(true);
		act(() => result.current.toggle());
		expect(result.current.isOpen).toBe(false);
	});

	it('setOpen sets explicit value', () => {
		const { result } = renderHook(() => useDisclosure());
		act(() => result.current.setOpen(true));
		expect(result.current.isOpen).toBe(true);
		act(() => result.current.setOpen(false));
		expect(result.current.isOpen).toBe(false);
	});

	it('calls onOpenChange with each new value', () => {
		const onOpenChange = vi.fn();
		const { result } = renderHook(() => useDisclosure({ onOpenChange }));
		act(() => result.current.open());
		act(() => result.current.close());
		act(() => result.current.toggle());
		expect(onOpenChange).toHaveBeenNthCalledWith(1, true);
		expect(onOpenChange).toHaveBeenNthCalledWith(2, false);
		expect(onOpenChange).toHaveBeenNthCalledWith(3, true);
	});

	it('open/close handler identities are stable across renders', () => {
		const { result, rerender } = renderHook(() => useDisclosure());
		const firstOpen = result.current.open;
		const firstClose = result.current.close;
		rerender();
		expect(result.current.open).toBe(firstOpen);
		expect(result.current.close).toBe(firstClose);
	});
});
