import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref } from 'vue';
import { useHotkeys } from '@/composables/use-hotkeys';

function fire(key: string, init: Partial<KeyboardEventInit> = {}, target: EventTarget = window) {
	const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
	target.dispatchEvent(event);
	return event;
}

describe('useHotkeys', () => {
	it('fires a single-key handler', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useHotkeys({ escape: handler });
				return () => h('div');
			},
		});
		render(Harness);
		fire('Escape');
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('matches mod combos (ctrl on non-mac)', () => {
		Object.defineProperty(navigator, 'platform', { configurable: true, value: 'Linux x86_64' });
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useHotkeys({ 'mod+k': handler });
				return () => h('div');
			},
		});
		render(Harness);
		fire('k', { ctrlKey: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('matches shift combos', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useHotkeys({ 'shift+a': handler });
				return () => h('div');
			},
		});
		render(Harness);
		fire('a', { shiftKey: true });
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('disallows extra modifiers when none are requested', () => {
		Object.defineProperty(navigator, 'platform', { configurable: true, value: 'Linux x86_64' });
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useHotkeys({ k: handler });
				return () => h('div');
			},
		});
		render(Harness);
		fire('k', { ctrlKey: true });
		expect(handler).not.toHaveBeenCalled();
		fire('k');
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('does not fire for non-matching keys', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useHotkeys({ Enter: handler });
				return () => h('div');
			},
		});
		render(Harness);
		fire('Escape');
		expect(handler).not.toHaveBeenCalled();
	});

	it('calls preventDefault by default', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useHotkeys({ escape: handler });
				return () => h('div');
			},
		});
		render(Harness);
		const event = fire('Escape');
		expect(event.defaultPrevented).toBe(true);
	});

	it('does not call preventDefault when preventDefault is false', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useHotkeys({ escape: handler }, { preventDefault: false });
				return () => h('div');
			},
		});
		render(Harness);
		const event = fire('Escape');
		expect(event.defaultPrevented).toBe(false);
	});

	it('suppresses hotkeys when focus is inside an input', () => {
		const handler = vi.fn();
		const input = document.createElement('input');
		document.body.appendChild(input);
		const Harness = defineComponent({
			setup() {
				useHotkeys({ escape: handler });
				return () => h('div');
			},
		});
		render(Harness);
		input.focus();
		fire('Escape', {}, input);
		expect(handler).not.toHaveBeenCalled();
		document.body.removeChild(input);
	});

	it('fires in inputs when enableInInputs is true', () => {
		const handler = vi.fn();
		const input = document.createElement('input');
		document.body.appendChild(input);
		const Harness = defineComponent({
			setup() {
				useHotkeys({ escape: handler }, { enableInInputs: true });
				return () => h('div');
			},
		});
		render(Harness);
		fire('Escape', {}, input);
		expect(handler).toHaveBeenCalledTimes(1);
		document.body.removeChild(input);
	});

	it('respects activeScopes', async () => {
		const handler = vi.fn();
		const activeScopes = ref<string[]>(['*']);
		const Harness = defineComponent({
			setup() {
				useHotkeys({ escape: handler }, { scope: 'modal', activeScopes });
				return () => h('div');
			},
		});
		render(Harness);
		fire('Escape');
		expect(handler).not.toHaveBeenCalled();
		activeScopes.value = ['modal'];
		await nextTick();
		fire('Escape');
		expect(handler).toHaveBeenCalledTimes(1);
	});

	it('removes the listener on unmount', () => {
		const handler = vi.fn();
		const Harness = defineComponent({
			setup() {
				useHotkeys({ escape: handler });
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		unmount();
		fire('Escape');
		expect(handler).not.toHaveBeenCalled();
	});
});
