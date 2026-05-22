import { createRoot } from 'solid-js';
import { createDisclosure } from '@/primitives/create-disclosure';

describe('createDisclosure', () => {
	it('defaults to closed', () => {
		createRoot((dispose) => {
			const { isOpen } = createDisclosure();
			expect(isOpen()).toBe(false);
			dispose();
		});
	});

	it('respects defaultOpen', () => {
		createRoot((dispose) => {
			const { isOpen } = createDisclosure({ defaultOpen: true });
			expect(isOpen()).toBe(true);
			dispose();
		});
	});

	it('open() / close() / toggle() update isOpen', () => {
		createRoot((dispose) => {
			const { isOpen, open, close, toggle } = createDisclosure();
			open();
			expect(isOpen()).toBe(true);
			close();
			expect(isOpen()).toBe(false);
			toggle();
			expect(isOpen()).toBe(true);
			toggle();
			expect(isOpen()).toBe(false);
			dispose();
		});
	});

	it('setOpen writes the given value', () => {
		createRoot((dispose) => {
			const { isOpen, setOpen } = createDisclosure();
			setOpen(true);
			expect(isOpen()).toBe(true);
			setOpen(false);
			expect(isOpen()).toBe(false);
			dispose();
		});
	});

	it('fires onOpenChange with the new value', () => {
		const onOpenChange = vi.fn();
		createRoot((dispose) => {
			const { open, close, toggle } = createDisclosure({ onOpenChange });
			open();
			expect(onOpenChange).toHaveBeenLastCalledWith(true);
			close();
			expect(onOpenChange).toHaveBeenLastCalledWith(false);
			toggle();
			expect(onOpenChange).toHaveBeenLastCalledWith(true);
			expect(onOpenChange).toHaveBeenCalledTimes(3);
			dispose();
		});
	});
});
