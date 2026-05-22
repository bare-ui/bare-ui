import { createRoot, createSignal } from 'solid-js';
import { createControllableState } from '@/primitives/create-controllable-state';

describe('createControllableState', () => {
	it('returns defaultValue when uncontrolled', () => {
		createRoot((dispose) => {
			const [value] = createControllableState({ defaultValue: 'a' });
			expect(value()).toBe('a');
			dispose();
		});
	});

	it('uncontrolled write updates state and fires onChange', () => {
		const onChange = vi.fn();
		createRoot((dispose) => {
			const [value, setValue] = createControllableState({ defaultValue: 'a', onChange });
			setValue('b');
			expect(value()).toBe('b');
			expect(onChange).toHaveBeenCalledWith('b');
			dispose();
		});
	});

	it('returns the controlled value when value is provided', () => {
		createRoot((dispose) => {
			const [value] = createControllableState({ value: 'controlled' });
			expect(value()).toBe('controlled');
			dispose();
		});
	});

	it('controlled write only fires onChange and does not update internal state', () => {
		const onChange = vi.fn();
		createRoot((dispose) => {
			const [value, setValue] = createControllableState({ value: 'controlled', onChange });
			setValue('next');
			expect(value()).toBe('controlled');
			expect(onChange).toHaveBeenCalledWith('next');
			dispose();
		});
	});

	it('tracks a reactive value via getter', () => {
		createRoot((dispose) => {
			const [source, setSource] = createSignal('a');
			const [value] = createControllableState({
				get value() {
					return source();
				},
			});
			expect(value()).toBe('a');
			setSource('b');
			expect(value()).toBe('b');
			dispose();
		});
	});

	it('does not fire onChange when set to undefined', () => {
		const onChange = vi.fn();
		createRoot((dispose) => {
			const [, setValue] = createControllableState<string | undefined>({ defaultValue: 'a', onChange });
			setValue(undefined);
			expect(onChange).not.toHaveBeenCalled();
			dispose();
		});
	});

	it('accepts an updater function', () => {
		createRoot((dispose) => {
			const [value, setValue] = createControllableState({ defaultValue: 1 });
			setValue((prev) => (prev ?? 0) + 1);
			expect(value()).toBe(2);
			dispose();
		});
	});
});
