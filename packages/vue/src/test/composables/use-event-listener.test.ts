import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useEventListener } from '@/composables/use-event-listener';

describe('useEventListener', () => {
	it('attaches a listener to an element ref', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLButtonElement | null>(null);
				useEventListener('click', handler, el);
				return () => h('button', { ref: el, 'data-testid': 'btn' }, 'x');
			},
		});
		const { getByTestId } = render(Harness);
		getByTestId('btn').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('passes the event to the handler', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				const el = ref<HTMLButtonElement | null>(null);
				useEventListener('click', handler, el);
				return () => h('button', { ref: el, 'data-testid': 'btn' }, 'x');
			},
		});
		const { getByTestId } = render(Harness);
		const evt = new MouseEvent('click', { bubbles: true });
		getByTestId('btn').dispatchEvent(evt);
		expect(handler).toHaveBeenCalledWith(evt);
	});

	it('defaults to window when no target is given', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useEventListener('resize', handler);
				return () => h('div');
			},
		});
		render(Harness);
		window.dispatchEvent(new Event('resize'));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('attaches to document when document is the target', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useEventListener('click', handler, document);
				return () => h('div');
			},
		});
		render(Harness);
		document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(handler).toHaveBeenCalled();
	});

	it('removes the listener on unmount', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useEventListener('resize', handler);
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		unmount();
		window.dispatchEvent(new Event('resize'));
		expect(handler).not.toHaveBeenCalled();
	});

	it('re-attaches when the target ref changes from null to an element', async () => {
		const handler = vi.fn();
		let elRef!: ReturnType<typeof ref<HTMLButtonElement | null>>;
		const Harness = defineComponent({
			setup() {
				elRef = ref<HTMLButtonElement | null>(null);
				useEventListener('click', handler, elRef);
				return () => h('div');
			},
		});
		render(Harness);
		const btn = document.createElement('button');
		elRef.value = btn;
		await nextTick();
		btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('passes options through to addEventListener', () => {
		const target = document.createElement('div');
		const spy = vi.spyOn(target, 'addEventListener');
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useEventListener('click', handler, target, { passive: true });
				return () => h('div');
			},
		});
		render(Harness);
		expect(spy).toHaveBeenCalledWith('click', handler, { passive: true });
	});
});
