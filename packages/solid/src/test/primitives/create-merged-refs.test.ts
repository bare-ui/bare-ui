import { createMergedRefs } from '@/primitives/create-merged-refs';

describe('createMergedRefs', () => {
	it('calls every ref setter with the element', () => {
		const a = vi.fn();
		const b = vi.fn();
		const merged = createMergedRefs(a, b);
		const el = document.createElement('div');
		merged(el);
		expect(a).toHaveBeenCalledWith(el);
		expect(b).toHaveBeenCalledWith(el);
	});

	it('skips null and undefined refs', () => {
		const a = vi.fn();
		const merged = createMergedRefs(a, null, undefined);
		const el = document.createElement('div');
		expect(() => merged(el)).not.toThrow();
		expect(a).toHaveBeenCalledWith(el);
	});

	it('returns a single callback', () => {
		const merged = createMergedRefs(vi.fn());
		expect(typeof merged).toBe('function');
	});
});
