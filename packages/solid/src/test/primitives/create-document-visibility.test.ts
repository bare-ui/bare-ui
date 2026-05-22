import { renderHook } from '@solidjs/testing-library';
import { createDocumentVisibility } from '@/primitives/create-document-visibility';

function mockVisibility(value: DocumentVisibilityState) {
	Object.defineProperty(document, 'visibilityState', {
		configurable: true,
		get: () => value,
	});
}

describe('createDocumentVisibility', () => {
	const original = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');

	afterEach(() => {
		if (original) Object.defineProperty(document, 'visibilityState', original);
	});

	it('returns the initial visibility state', () => {
		mockVisibility('visible');
		const { result, cleanup } = renderHook(() => createDocumentVisibility());
		expect(result()).toBe('visible');
		cleanup();
	});

	it('updates when visibilitychange fires', () => {
		mockVisibility('visible');
		const { result, cleanup } = renderHook(() => createDocumentVisibility());
		mockVisibility('hidden');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(result()).toBe('hidden');
		mockVisibility('visible');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(result()).toBe('visible');
		cleanup();
	});

	it('removes the listener on cleanup', () => {
		mockVisibility('visible');
		const { result, cleanup } = renderHook(() => createDocumentVisibility());
		cleanup();
		mockVisibility('hidden');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(result()).toBe('visible');
	});
});
