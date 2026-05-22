import { render } from '@testing-library/vue';
import { defineComponent, h, type Ref } from 'vue';
import { useOnlineStatus } from '@/composables/use-online-status';

function setOnline(value: boolean) {
	Object.defineProperty(navigator, 'onLine', {
		configurable: true,
		get: () => value,
	});
}

describe('useOnlineStatus', () => {
	const original = Object.getOwnPropertyDescriptor(Navigator.prototype, 'onLine');

	afterEach(() => {
		if (original) Object.defineProperty(Navigator.prototype, 'onLine', original);
	});

	it('returns the initial navigator.onLine value', () => {
		setOnline(true);
		let online!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				online = useOnlineStatus();
				return () => h('div');
			},
		});
		render(Harness);
		expect(online.value).toBe(true);
	});

	it('updates to false on offline event', () => {
		setOnline(true);
		let online!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				online = useOnlineStatus();
				return () => h('div');
			},
		});
		render(Harness);
		setOnline(false);
		window.dispatchEvent(new Event('offline'));
		expect(online.value).toBe(false);
	});

	it('updates back to true on online event', () => {
		setOnline(false);
		let online!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				online = useOnlineStatus();
				return () => h('div');
			},
		});
		render(Harness);
		setOnline(true);
		window.dispatchEvent(new Event('online'));
		expect(online.value).toBe(true);
	});

	it('removes listeners on unmount', () => {
		setOnline(true);
		let online!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				online = useOnlineStatus();
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		unmount();
		setOnline(false);
		window.dispatchEvent(new Event('offline'));
		expect(online.value).toBe(true);
	});
});
