import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useScrollLock } from '@/composables/use-scroll-lock';

describe('useScrollLock', () => {
	beforeEach(() => {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
	});

	it('does not lock when active is false', async () => {
		const Harness = defineComponent({
			setup() {
				useScrollLock(false);
				return () => h('div');
			},
		});
		render(Harness);
		await nextTick();
		expect(document.body.style.overflow).toBe('');
	});

	it('locks body overflow when active is true', async () => {
		const Harness = defineComponent({
			setup() {
				useScrollLock(true);
				return () => h('div');
			},
		});
		render(Harness);
		await nextTick();
		expect(document.body.style.overflow).toBe('hidden');
	});

	it('restores body overflow when active toggles back to false', async () => {
		document.body.style.overflow = 'auto';
		const active = ref(true);
		const Harness = defineComponent({
			setup() {
				useScrollLock(active);
				return () => h('div');
			},
		});
		render(Harness);
		await nextTick();
		expect(document.body.style.overflow).toBe('hidden');
		active.value = false;
		await nextTick();
		expect(document.body.style.overflow).toBe('auto');
	});

	it('releases the lock on unmount', async () => {
		document.body.style.overflow = 'auto';
		const Harness = defineComponent({
			setup() {
				useScrollLock(true);
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		await nextTick();
		expect(document.body.style.overflow).toBe('hidden');
		unmount();
		expect(document.body.style.overflow).toBe('auto');
	});

	it('stacks multiple consumers — only restores when the last one releases', async () => {
		document.body.style.overflow = 'auto';
		const a = ref(true);
		const b = ref(true);
		const Harness = defineComponent({
			setup() {
				useScrollLock(a);
				useScrollLock(b);
				return () => h('div');
			},
		});
		render(Harness);
		await nextTick();
		expect(document.body.style.overflow).toBe('hidden');
		a.value = false;
		await nextTick();
		expect(document.body.style.overflow).toBe('hidden');
		b.value = false;
		await nextTick();
		expect(document.body.style.overflow).toBe('auto');
	});
});
