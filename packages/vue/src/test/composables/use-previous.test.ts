import { render } from '@testing-library/vue';
import { defineComponent, h, ref, type Ref } from 'vue';
import { usePrevious } from '@/composables/use-previous';

describe('usePrevious', () => {
	it('returns undefined before any change', () => {
		let prev!: Ref<number | undefined>;
		const Harness = defineComponent({
			setup() {
				const count = ref(0);
				prev = usePrevious(count);
				return () => h('div');
			},
		});
		render(Harness);
		expect(prev.value).toBeUndefined();
	});

	it('returns the previous value after a change', () => {
		let prev!: Ref<number | undefined>;
		let count!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				count = ref(0);
				prev = usePrevious(count);
				return () => h('div');
			},
		});
		render(Harness);
		count.value = 1;
		expect(prev.value).toBe(0);
	});

	it('tracks multiple sequential changes', () => {
		let prev!: Ref<number | undefined>;
		let count!: Ref<number>;
		const Harness = defineComponent({
			setup() {
				count = ref(0);
				prev = usePrevious(count);
				return () => h('div');
			},
		});
		render(Harness);
		count.value = 1;
		expect(prev.value).toBe(0);
		count.value = 2;
		expect(prev.value).toBe(1);
		count.value = 5;
		expect(prev.value).toBe(2);
	});

	it('works with a getter source', () => {
		let prev!: Ref<string | undefined>;
		let name!: Ref<string>;
		const Harness = defineComponent({
			setup() {
				name = ref('a');
				prev = usePrevious(() => name.value);
				return () => h('div');
			},
		});
		render(Harness);
		name.value = 'b';
		expect(prev.value).toBe('a');
	});
});
