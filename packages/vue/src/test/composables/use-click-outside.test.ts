import { render } from '@testing-library/vue';
import { defineComponent, h, ref } from 'vue';
import { useClickOutside } from '@/composables/use-click-outside';

function makeHarness(cb: (e: MouseEvent | TouchEvent) => void, includeInside = true) {
	return defineComponent({
		setup() {
			const inner = ref<HTMLDivElement | null>(null);
			useClickOutside(inner, cb);
			return () =>
				h('div', [
					h('div', { ref: inner, 'data-testid': 'inside-container' }, [
						includeInside ? h('span', { 'data-testid': 'inside-child' }, 'inside') : null,
					]),
					h('button', { 'data-testid': 'outside' }, 'outside'),
				]);
		},
	});
}

describe('useClickOutside', () => {
	it('calls callback when clicking outside the element', () => {
		const cb = vi.fn();
		const { getByTestId } = render(makeHarness(cb));
		getByTestId('outside').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('does not call callback when clicking inside the element', () => {
		const cb = vi.fn();
		const { getByTestId } = render(makeHarness(cb));
		getByTestId('inside-container').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('does not fire for clicks on descendants of the target', () => {
		const cb = vi.fn();
		const { getByTestId } = render(makeHarness(cb));
		getByTestId('inside-child').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('fires on touchstart events from outside the element', () => {
		const cb = vi.fn();
		const { getByTestId } = render(makeHarness(cb));
		getByTestId('outside').dispatchEvent(new Event('touchstart', { bubbles: true }));
		expect(cb).toHaveBeenCalledTimes(1);
	});

	it('does not fire on touchstart events inside the element', () => {
		const cb = vi.fn();
		const { getByTestId } = render(makeHarness(cb));
		getByTestId('inside-child').dispatchEvent(new Event('touchstart', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('passes the event to the callback', () => {
		const cb = vi.fn();
		const { getByTestId } = render(makeHarness(cb));
		const evt = new MouseEvent('click', { bubbles: true });
		getByTestId('outside').dispatchEvent(evt);
		expect(cb).toHaveBeenCalledWith(evt);
	});

	it('does not fire when ref is null', () => {
		const cb = vi.fn();
		const NullRef = defineComponent({
			setup() {
				const r = ref<HTMLDivElement | null>(null);
				useClickOutside(r, cb);
				return () => h('button', { 'data-testid': 'outside' }, 'x');
			},
		});
		const { getByTestId } = render(NullRef);
		getByTestId('outside').dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});

	it('removes the listener on unmount', () => {
		const cb = vi.fn();
		const { unmount } = render(makeHarness(cb));
		unmount();
		document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
		expect(cb).not.toHaveBeenCalled();
	});
});
