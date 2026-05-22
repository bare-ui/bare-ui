import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref, type Ref, type WritableComputedRef } from 'vue';
import { useControllableState } from '@/composables/use-controllable-state';

function mount<T>(
	build: () => { state: WritableComputedRef<T | undefined>; source?: Ref<T | undefined> },
): { state: WritableComputedRef<T | undefined>; source?: Ref<T | undefined> } {
	let captured!: { state: WritableComputedRef<T | undefined>; source?: Ref<T | undefined> };
	const Harness = defineComponent({
		setup() {
			captured = build();
			return () => h('div');
		},
	});
	render(Harness);
	return captured;
}

describe('useControllableState', () => {
	it('returns the defaultValue when uncontrolled', () => {
		const { state } = mount(() => ({
			state: useControllableState({ defaultValue: 'a' }),
		}));
		expect(state.value).toBe('a');
	});

	it('writes update internal state when uncontrolled and fire onChange', () => {
		const onChange = vi.fn();
		const { state } = mount(() => ({
			state: useControllableState({ defaultValue: 'a', onChange }),
		}));
		state.value = 'b';
		expect(state.value).toBe('b');
		expect(onChange).toHaveBeenCalledWith('b');
	});

	it('returns the controlled value when value is provided', () => {
		const source = ref('controlled');
		const { state } = mount(() => ({
			state: useControllableState({ value: source }),
			source,
		}));
		expect(state.value).toBe('controlled');
	});

	it('writes do not mutate the source when controlled but still fire onChange', () => {
		const source = ref('controlled');
		const onChange = vi.fn();
		const { state } = mount(() => ({
			state: useControllableState({ value: source, onChange }),
			source,
		}));
		state.value = 'next';
		expect(source.value).toBe('controlled');
		expect(state.value).toBe('controlled');
		expect(onChange).toHaveBeenCalledWith('next');
	});

	it('reflects updates to the controlled source through the computed', async () => {
		const source = ref('a');
		const { state } = mount(() => ({
			state: useControllableState({ value: source }),
			source,
		}));
		source.value = 'b';
		await nextTick();
		expect(state.value).toBe('b');
	});

	it('does not fire onChange when value is set to undefined', () => {
		const onChange = vi.fn();
		const { state } = mount(() => ({
			state: useControllableState<string | undefined>({ defaultValue: 'a', onChange }),
		}));
		state.value = undefined;
		expect(onChange).not.toHaveBeenCalled();
	});

	it('defaults to undefined when no defaultValue and no controlled value', () => {
		const { state } = mount(() => ({
			state: useControllableState<string>({}),
		}));
		expect(state.value).toBeUndefined();
	});

	it('accepts a getter function for value', () => {
		const source = ref('from-getter');
		const { state } = mount(() => ({
			state: useControllableState({ value: () => source.value }),
		}));
		expect(state.value).toBe('from-getter');
	});
});
