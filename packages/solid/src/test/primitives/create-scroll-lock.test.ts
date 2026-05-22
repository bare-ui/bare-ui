import { renderHook } from '@solidjs/testing-library';
import { createSignal } from 'solid-js';
import { createScrollLock } from '@/primitives/create-scroll-lock';

describe('createScrollLock', () => {
	beforeEach(() => {
		document.body.style.overflow = '';
		document.body.style.paddingRight = '';
	});

	it('does not lock when active is false', () => {
		const { cleanup } = renderHook(() => createScrollLock(false));
		expect(document.body.style.overflow).toBe('');
		cleanup();
	});

	it('locks body overflow when active is true', () => {
		const { cleanup } = renderHook(() => createScrollLock(true));
		expect(document.body.style.overflow).toBe('hidden');
		cleanup();
	});

	it('restores body overflow when active toggles back to false', () => {
		document.body.style.overflow = 'auto';
		const [active, setActive] = createSignal(true);
		const { cleanup } = renderHook(() => createScrollLock(() => active()));
		expect(document.body.style.overflow).toBe('hidden');
		setActive(false);
		expect(document.body.style.overflow).toBe('auto');
		cleanup();
	});

	it('releases the lock on cleanup', () => {
		document.body.style.overflow = 'auto';
		const { cleanup } = renderHook(() => createScrollLock(true));
		expect(document.body.style.overflow).toBe('hidden');
		cleanup();
		expect(document.body.style.overflow).toBe('auto');
	});

	it('stacks multiple consumers — only restores when the last one releases', () => {
		document.body.style.overflow = 'auto';
		const [a, setA] = createSignal(true);
		const [b, setB] = createSignal(true);
		const { cleanup: ca } = renderHook(() => createScrollLock(() => a()));
		const { cleanup: cb } = renderHook(() => createScrollLock(() => b()));
		expect(document.body.style.overflow).toBe('hidden');
		setA(false);
		expect(document.body.style.overflow).toBe('hidden');
		setB(false);
		expect(document.body.style.overflow).toBe('auto');
		ca();
		cb();
	});
});
