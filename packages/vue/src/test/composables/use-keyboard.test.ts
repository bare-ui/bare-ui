import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useKeyboard } from '@/composables/use-keyboard';

function fireKey(target: EventTarget, key: string, modifiers: Partial<KeyboardEventInit> = {}) {
	target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...modifiers }));
}

describe('useKeyboard', () => {
	it('fires the matching handler on keydown', () => {
		const onEscape = vi.fn();
		const Harness = defineComponent({
			setup() {
				useKeyboard({ Escape: onEscape });
				return () => h('div');
			},
		});
		render(Harness);
		fireKey(window, 'Escape');
		expect(onEscape).toHaveBeenCalledTimes(1);
	});

	it('matches keys case-insensitively', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useKeyboard({ a: handler });
				return () => h('div');
			},
		});
		render(Harness);
		fireKey(window, 'A');
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('does not fire for non-matching keys', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useKeyboard({ Enter: handler });
				return () => h('div');
			},
		});
		render(Harness);
		fireKey(window, 'Escape');
		expect(handler).not.toHaveBeenCalled();
	});

	it('respects modifier requirements', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useKeyboard({ s: [handler, { meta: true }] });
				return () => h('div');
			},
		});
		render(Harness);
		fireKey(window, 's');
		expect(handler).not.toHaveBeenCalled();
		fireKey(window, 's', { metaKey: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('calls preventDefault when configured', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useKeyboard({ s: [handler, { meta: true, preventDefault: true }] });
				return () => h('div');
			},
		});
		render(Harness);
		const event = new KeyboardEvent('keydown', { key: 's', metaKey: true, bubbles: true, cancelable: true });
		const spy = vi.spyOn(event, 'preventDefault');
		window.dispatchEvent(event);
		expect(spy).toHaveBeenCalled();
	});

	it('attaches to the given target element', () => {
		const handler = vi.fn();
		const target = document.createElement('div');
		document.body.appendChild(target);
		const Harness = defineComponent({
			setup() {
				useKeyboard({ Enter: handler }, { target });
				return () => h('div');
			},
		});
		render(Harness);
		fireKey(target, 'Enter');
		expect(handler).toHaveBeenCalled();
		document.body.removeChild(target);
	});

	it('removes the listener on unmount', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useKeyboard({ Escape: handler });
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		unmount();
		fireKey(window, 'Escape');
		expect(handler).not.toHaveBeenCalled();
	});

	it('toggles attachment via the enabled option', async () => {
		const handler = vi.fn();
		const enabled = ref(false);
		const Harness = defineComponent({
			setup() {
				useKeyboard({ Escape: handler }, { enabled });
				return () => h('div');
			},
		});
		render(Harness);
		fireKey(window, 'Escape');
		expect(handler).not.toHaveBeenCalled();
		enabled.value = true;
		await nextTick();
		fireKey(window, 'Escape');
		expect(handler).toHaveBeenCalledTimes(1);
		enabled.value = false;
		await nextTick();
		fireKey(window, 'Escape');
		expect(handler).toHaveBeenCalledTimes(1);
	});
});
