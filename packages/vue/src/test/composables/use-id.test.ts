import { render } from '@testing-library/vue';
import { defineComponent, h } from 'vue';
import { useId } from '@/composables/use-id';

function mount(build: () => string): string {
	let captured!: string;
	const Harness = defineComponent({
		setup() {
			captured = build();
			return () => h('div');
		},
	});
	render(Harness);
	return captured;
}

describe('useId', () => {
	it('generates an id with a wire- prefix by default', () => {
		const id = mount(() => useId());
		expect(id).toMatch(/^wire-/);
	});

	it('uses the provided prefix when given', () => {
		const id = mount(() => useId('label'));
		expect(id.startsWith('label-')).toBe(true);
	});

	it('returns staticId when provided, ignoring prefix', () => {
		const id = mount(() => useId('label', 'custom-id'));
		expect(id).toBe('custom-id');
	});

	it('strips colons from the underlying id', () => {
		const id = mount(() => useId());
		expect(id).not.toContain(':');
	});

	it('produces different ids when called multiple times in one component', () => {
		let pair!: [string, string];
		const Harness = defineComponent({
			setup() {
				pair = [useId(), useId()];
				return () => h('div');
			},
		});
		render(Harness);
		expect(pair[0]).not.toBe(pair[1]);
	});
});
