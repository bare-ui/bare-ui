import { renderHook } from '@solidjs/testing-library';
import { createMediaQuery } from '@/primitives/create-media-query';

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

describe('createMediaQuery', () => {
	const originalMatchMedia = window.matchMedia;

	beforeEach(() => lists.clear());
	afterEach(() => {
		window.matchMedia = originalMatchMedia;
	});

	it('returns false when match state is false', () => {
		window.matchMedia = makeMatchMedia({ '(max-width: 640px)': false });
		const { result, cleanup } = renderHook(() => createMediaQuery('(max-width: 640px)'));
		expect(result()).toBe(false);
		cleanup();
	});

	it('returns true when the query matches', () => {
		window.matchMedia = makeMatchMedia({ '(max-width: 640px)': true });
		const { result, cleanup } = renderHook(() => createMediaQuery('(max-width: 640px)'));
		expect(result()).toBe(true);
		cleanup();
	});

	it('updates when the listener fires with a new matches value', () => {
		window.matchMedia = makeMatchMedia({ '(max-width: 640px)': false });
		const { result, cleanup } = renderHook(() => createMediaQuery('(max-width: 640px)'));
		fire('(max-width: 640px)', true);
		expect(result()).toBe(true);
		cleanup();
	});

	it('removes the listener on cleanup', () => {
		window.matchMedia = makeMatchMedia({ '(max-width: 640px)': false });
		const { cleanup } = renderHook(() => createMediaQuery('(max-width: 640px)'));
		const entry = lists.get('(max-width: 640px)')!;
		expect(entry.listeners.size).toBe(1);
		cleanup();
		expect(entry.listeners.size).toBe(0);
	});
});
