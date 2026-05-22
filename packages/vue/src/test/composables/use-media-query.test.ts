import { render } from '@testing-library/vue';
import { defineComponent, h, type Ref } from 'vue';
import { useMediaQuery } from '@/composables/use-media-query';

interface FakeMQL {
	media: string;
	matches: boolean;
	listeners: Set<(e: MediaQueryListEvent) => void>;
	addEventListener: (type: 'change', cb: (e: MediaQueryListEvent) => void) => void;
	removeEventListener: (type: 'change', cb: (e: MediaQueryListEvent) => void) => void;
}

const lists = new Map<string, FakeMQL>();

function makeMatchMedia(initial: Record<string, boolean>) {
	return (query: string): MediaQueryList => {
		let entry = lists.get(query);
		if (!entry) {
			entry = {
				media: query,
				matches: initial[query] ?? false,
				listeners: new Set(),
				addEventListener(_type, cb) {
					this.listeners.add(cb);
				},
				removeEventListener(_type, cb) {
					this.listeners.delete(cb);
				},
			};
			lists.set(query, entry);
		}
		return entry as unknown as MediaQueryList;
	};
}

function fire(query: string, matches: boolean) {
	const entry = lists.get(query);
	if (!entry) return;
	entry.matches = matches;
	entry.listeners.forEach((l) => l({ matches } as MediaQueryListEvent));
}

describe('useMediaQuery', () => {
	const originalMatchMedia = window.matchMedia;

	beforeEach(() => {
		lists.clear();
	});

	afterEach(() => {
		window.matchMedia = originalMatchMedia;
	});

	it('returns false when match state is false', () => {
		window.matchMedia = makeMatchMedia({ '(max-width: 640px)': false });
		let result!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				result = useMediaQuery('(max-width: 640px)');
				return () => h('div');
			},
		});
		render(Harness);
		expect(result.value).toBe(false);
	});

	it('returns true when the query matches', () => {
		window.matchMedia = makeMatchMedia({ '(max-width: 640px)': true });
		let result!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				result = useMediaQuery('(max-width: 640px)');
				return () => h('div');
			},
		});
		render(Harness);
		expect(result.value).toBe(true);
	});

	it('updates when the listener fires with a new matches value', () => {
		window.matchMedia = makeMatchMedia({ '(max-width: 640px)': false });
		let result!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				result = useMediaQuery('(max-width: 640px)');
				return () => h('div');
			},
		});
		render(Harness);
		fire('(max-width: 640px)', true);
		expect(result.value).toBe(true);
	});

	it('removes the listener on unmount', () => {
		window.matchMedia = makeMatchMedia({ '(max-width: 640px)': false });
		const Harness = defineComponent({
			setup() {
				useMediaQuery('(max-width: 640px)');
				return () => h('div');
			},
		});
		const { unmount } = render(Harness);
		const entry = lists.get('(max-width: 640px)')!;
		expect(entry.listeners.size).toBe(1);
		unmount();
		expect(entry.listeners.size).toBe(0);
	});
});
