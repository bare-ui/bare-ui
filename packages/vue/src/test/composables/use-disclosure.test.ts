import { render } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { useDisclosure, type UseDisclosureOptions, type UseDisclosureResult } from '@/composables/use-disclosure';

function mount(options: UseDisclosureOptions = {}): UseDisclosureResult {
	let captured!: UseDisclosureResult;
	const Harness = defineComponent({
		setup() {
			captured = useDisclosure(options);
			return () => h('div');
		},
	});
	render(Harness);
	return captured;
}

describe('useDisclosure', () => {
	it('defaults to closed', () => {
		const { isOpen } = mount();
		expect(isOpen.value).toBe(false);
	});

	it('respects defaultOpen', () => {
		const { isOpen } = mount({ defaultOpen: true });
		expect(isOpen.value).toBe(true);
	});

	it('open() sets isOpen to true', () => {
		const { isOpen, open } = mount();
		open();
		expect(isOpen.value).toBe(true);
	});

	it('close() sets isOpen to false', () => {
		const { isOpen, close } = mount({ defaultOpen: true });
		close();
		expect(isOpen.value).toBe(false);
	});

	it('toggle() flips the value', () => {
		const { isOpen, toggle } = mount();
		toggle();
		expect(isOpen.value).toBe(true);
		toggle();
		expect(isOpen.value).toBe(false);
	});

	it('setOpen(value) writes the given value', () => {
		const { isOpen, setOpen } = mount();
		setOpen(true);
		expect(isOpen.value).toBe(true);
		setOpen(false);
		expect(isOpen.value).toBe(false);
	});

	it('fires onOpenChange with the new value', () => {
		const onOpenChange = vi.fn();
		const { open, close, toggle } = mount({ onOpenChange });
		open();
		expect(onOpenChange).toHaveBeenLastCalledWith(true);
		close();
		expect(onOpenChange).toHaveBeenLastCalledWith(false);
		toggle();
		expect(onOpenChange).toHaveBeenLastCalledWith(true);
		expect(onOpenChange).toHaveBeenCalledTimes(3);
	});
});
