import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createDirection, getDirection, isRtl } from '@/primitives/create-direction';

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
		expect(isRtl(child)).toBe(true);
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
		expect(isRtl(null)).toBe(false);
	});
});

describe('createDirection', () => {
	it('resolves the direction of the referenced element after mount', () => {
		const el = document.createElement('div');
		el.setAttribute('dir', 'rtl');
		document.body.appendChild(el);
		const { result, cleanup } = renderHook(() => createDirection(() => el));
		expect(result()).toBe('rtl');
		cleanup();
		el.remove();
	});

	it('defaults to "ltr" when the element carries no direction', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result, cleanup } = renderHook(() => createDirection(() => el));
		expect(result()).toBe('ltr');
		cleanup();
		el.remove();
	});

	it('defaults to "ltr" when the accessor resolves nothing', () => {
		const { result, cleanup } = renderHook(() => createDirection(() => undefined));
		expect(result()).toBe('ltr');
		cleanup();
	});

	it('reacts to a later dir flip on the host', async () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		const { result, cleanup } = renderHook(() => createDirection(() => el));
		expect(result()).toBe('ltr');
		// MutationObserver callbacks fire as a microtask, so flush before asserting.
		document.documentElement.setAttribute('dir', 'rtl');
		await Promise.resolve();
		expect(result()).toBe('rtl');
		document.documentElement.removeAttribute('dir');
		cleanup();
		el.remove();
	});

	it('re-reads when the accessed element changes', () => {
		const ltr = document.createElement('div');
		const rtl = document.createElement('div');
		rtl.setAttribute('dir', 'rtl');
		document.body.append(ltr, rtl);
		const [el, setEl] = createSignal<HTMLElement>(ltr);
		const { result, cleanup } = renderHook(() => createDirection(() => el()));
		expect(result()).toBe('ltr');
		setEl(rtl);
		expect(result()).toBe('rtl');
		cleanup();
		ltr.remove();
		rtl.remove();
	});
});
