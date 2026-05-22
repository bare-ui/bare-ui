import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, onMounted, ref, type Ref } from 'vue';
import { useFocusTrap } from '@/composables/use-focus-trap';

function stubOffsetParent(el: HTMLElement) {
	Object.defineProperty(el, 'offsetParent', { configurable: true, get: () => document.body });
}

function fireTab(shift = false) {
	const event = new KeyboardEvent('keydown', {
		key: 'Tab',
		bubbles: true,
		cancelable: true,
		shiftKey: shift,
	});
	document.dispatchEvent(event);
	return event;
}

function makeTrap(active: Ref<boolean>, options: { returnFocus?: boolean } = {}) {
	return defineComponent({
		setup() {
			const trap = ref<HTMLDivElement | null>(null);
			useFocusTrap(trap, { active, returnFocus: options.returnFocus });
			onMounted(() => {
				if (trap.value) {
					stubOffsetParent(trap.value);
					trap.value.querySelectorAll('button').forEach((b) => stubOffsetParent(b));
				}
			});
			return () =>
				h('div', { ref: trap }, [
					h('button', { 'data-testid': 'first' }, 'first'),
					h('button', { 'data-testid': 'last' }, 'last'),
				]);
		},
	});
}

describe('useFocusTrap', () => {
	afterEach(() => {
		document.body.innerHTML = '';
	});

	it('focuses the first focusable element on activation', async () => {
		const active = ref(false);
		const { getByTestId } = render(makeTrap(active));
		await nextTick();
		active.value = true;
		await nextTick();
		await nextTick();
		expect(document.activeElement).toBe(getByTestId('first'));
	});

	it('Tab from last focusable wraps to first', async () => {
		const active = ref(false);
		const { getByTestId } = render(makeTrap(active));
		await nextTick();
		active.value = true;
		await nextTick();
		await nextTick();
		const last = getByTestId('last');
		last.focus();
		fireTab(false);
		expect(document.activeElement).toBe(getByTestId('first'));
	});

	it('Shift+Tab from first focusable wraps to last', async () => {
		const active = ref(false);
		const { getByTestId } = render(makeTrap(active));
		await nextTick();
		active.value = true;
		await nextTick();
		await nextTick();
		const first = getByTestId('first');
		first.focus();
		fireTab(true);
		expect(document.activeElement).toBe(getByTestId('last'));
	});

	it('restores focus to the previously-focused element when deactivated', async () => {
		const previous = document.createElement('button');
		previous.textContent = 'outside';
		document.body.appendChild(previous);
		stubOffsetParent(previous);
		previous.focus();

		const active = ref(false);
		render(makeTrap(active));
		await nextTick();
		active.value = true;
		await nextTick();
		await nextTick();
		active.value = false;
		await nextTick();
		expect(document.activeElement).toBe(previous);
	});

	it('does not restore focus when returnFocus is false', async () => {
		const previous = document.createElement('button');
		document.body.appendChild(previous);
		stubOffsetParent(previous);
		previous.focus();

		const active = ref(false);
		render(makeTrap(active, { returnFocus: false }));
		await nextTick();
		active.value = true;
		await nextTick();
		await nextTick();
		expect(document.activeElement).not.toBe(previous);
		active.value = false;
		await nextTick();
		expect(document.activeElement).not.toBe(previous);
	});

	it('does not intercept Tab when inactive', async () => {
		const active = ref(false);
		const { getByTestId } = render(makeTrap(active));
		await nextTick();
		getByTestId('last').focus();
		fireTab(false);
		expect(document.activeElement).toBe(getByTestId('last'));
	});
});
