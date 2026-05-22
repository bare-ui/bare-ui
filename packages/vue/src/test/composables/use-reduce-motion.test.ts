import { render } from '@testing-library/vue';
import { defineComponent, h, type Ref } from 'vue';
import { useReduceMotion } from '@/composables/use-reduce-motion';

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

describe('useReduceMotion', () => {
	const originalMatchMedia = window.matchMedia;
	const QUERY = '(prefers-reduced-motion: reduce)';

	beforeEach(() => {
		lists.clear();
	});

	afterEach(() => {
		window.matchMedia = originalMatchMedia;
	});

	it('returns false when motion is not reduced', () => {
		window.matchMedia = makeMatchMedia({ [QUERY]: false });
		let result!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				result = useReduceMotion();
				return () => h('div');
			},
		});
		render(Harness);
		expect(result.value).toBe(false);
	});

	it('returns true when reduce motion is preferred', () => {
		window.matchMedia = makeMatchMedia({ [QUERY]: true });
		let result!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				result = useReduceMotion();
				return () => h('div');
			},
		});
		render(Harness);
		expect(result.value).toBe(true);
	});

	it('updates when the media query changes', () => {
		window.matchMedia = makeMatchMedia({ [QUERY]: false });
		let result!: Ref<boolean>;
		const Harness = defineComponent({
			setup() {
				result = useReduceMotion();
				return () => h('div');
			},
		});
		render(Harness);
		fire(QUERY, true);
		expect(result.value).toBe(true);
	});
});
