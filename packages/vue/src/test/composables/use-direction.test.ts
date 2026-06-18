import { render } from '@testing-library/vue';
import { defineComponent, h, nextTick, ref, type Ref } from 'vue';
import { getDirection, useDirection, type Direction } from '@/composables/use-direction';

describe('getDirection', () => {
	it('returns "ltr" by default when no dir is present', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		expect(getDirection(el)).toBe('ltr');
		el.remove();
	});

	it('reads the nearest ancestor dir attribute', () => {
		const wrapper = document.createElement('div');
		wrapper.setAttribute('dir', 'rtl');
		const child = document.createElement('span');
		wrapper.appendChild(child);
		document.body.appendChild(wrapper);
		expect(getDirection(child)).toBe('rtl');
		wrapper.remove();
	});

	it('honors an explicit dir on the element itself', () => {
		const el = document.createElement('div');
		el.setAttribute('dir', 'ltr');
		const rtlParent = document.createElement('div');
		rtlParent.setAttribute('dir', 'rtl');
		rtlParent.appendChild(el);
		document.body.appendChild(rtlParent);
		// The closest dir host is the element itself (ltr), which wins over the rtl parent.
		expect(getDirection(el)).toBe('ltr');
		rtlParent.remove();
	});

	it('returns "ltr" for null/undefined elements', () => {
		expect(getDirection(null)).toBe('ltr');
		expect(getDirection(undefined)).toBe('ltr');
	});
});

/**
 * `useDirection` reads on mount and observes `dir` mutations, so it must run
 * inside component setup. This harness renders an element carrying an optional
 * static `dir`, binds the composable to it, and exposes the reactive result
 * (same idiom as the other composable tests).
 */
function mountProbe(dirAttr?: Direction) {
	let dir!: Ref<Direction>;
	const Harness = defineComponent({
		setup() {
			const elRef = ref<Element | null>(null);
			dir = useDirection(elRef);
			return () => h('div', { ref: elRef, dir: dirAttr });
		},
	});
	render(Harness);
	return () => dir.value;
}

describe('useDirection', () => {
	it('resolves the direction of the referenced element after mount', () => {
		const read = mountProbe('rtl');
		expect(read()).toBe('rtl');
	});

	it('defaults to "ltr" when the element carries no direction', () => {
		const read = mountProbe();
		expect(read()).toBe('ltr');
	});

	it('reacts to a later dir flip on the host', async () => {
		const read = mountProbe();
		expect(read()).toBe('ltr');
		// With no dir on the element, the observed host is documentElement.
		// MutationObserver callbacks fire as a microtask, so flush before asserting.
		document.documentElement.setAttribute('dir', 'rtl');
		await Promise.resolve();
		await nextTick();
		expect(read()).toBe('rtl');
		document.documentElement.removeAttribute('dir');
	});
});
