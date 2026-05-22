import { render } from '@testing-library/vue';
import { defineComponent, h, type Ref } from 'vue';
import { useDocumentVisibility } from '@/composables/use-document-visibility';

function mockVisibility(value: DocumentVisibilityState) {
	Object.defineProperty(document, 'visibilityState', {
		configurable: true,
		get: () => value,
	});
}

describe('useDocumentVisibility', () => {
	const original = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');

	afterEach(() => {
		if (original) Object.defineProperty(document, 'visibilityState', original);
	});

	it('returns the initial visibility state', () => {
		mockVisibility('visible');
		let visibility!: Ref<DocumentVisibilityState>;
		const Harness = defineComponent({
			setup() {
				visibility = useDocumentVisibility();
				return () => h('div');
			},
		});
		render(Harness);
		expect(visibility.value).toBe('visible');
	});

	it('updates when visibilitychange fires', () => {
		mockVisibility('visible');
		let visibility!: Ref<DocumentVisibilityState>;
		const Harness = defineComponent({
			setup() {
				visibility = useDocumentVisibility();
				return () => h('div');
			},
		});
		render(Harness);

		mockVisibility('hidden');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(visibility.value).toBe('hidden');

		mockVisibility('visible');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(visibility.value).toBe('visible');
	});

	it('removes the listener on unmount', () => {
		mockVisibility('visible');
		let visibility!: Ref<DocumentVisibilityState>;
		const Harness = defineComponent({
			setup() {
				visibility = useDocumentVisibility();
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		unmount();
		mockVisibility('hidden');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(visibility.value).toBe('visible');
	});
});
