import { renderHook } from '@solidjs/testing-library';
import { createOnlineStatus } from '@/primitives/create-online-status';

function setOnline(value: boolean) {
	Object.defineProperty(navigator, 'onLine', {
		configurable: true,
		get: () => value,
	});
}

describe('createOnlineStatus', () => {
	const original = Object.getOwnPropertyDescriptor(Navigator.prototype, 'onLine');

	afterEach(() => {
		if (original) Object.defineProperty(Navigator.prototype, 'onLine', original);
	});

	it('returns the initial navigator.onLine value', () => {
		setOnline(true);
		const { result, cleanup } = renderHook(() => createOnlineStatus());
		expect(result()).toBe(true);
		cleanup();
	});

	it('updates to false on offline event', () => {
		setOnline(true);
		const { result, cleanup } = renderHook(() => createOnlineStatus());
		setOnline(false);
		window.dispatchEvent(new Event('offline'));
		expect(result()).toBe(false);
		cleanup();
	});

	it('updates back to true on online event', () => {
		setOnline(false);
		const { result, cleanup } = renderHook(() => createOnlineStatus());
		setOnline(true);
		window.dispatchEvent(new Event('online'));
		expect(result()).toBe(true);
		cleanup();
	});

	it('removes listeners on cleanup', () => {
		setOnline(true);
		const { result, cleanup } = renderHook(() => createOnlineStatus());
		cleanup();
		setOnline(false);
		window.dispatchEvent(new Event('offline'));
		expect(result()).toBe(true);
	});
});
