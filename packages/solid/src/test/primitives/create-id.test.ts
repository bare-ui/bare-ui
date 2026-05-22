import { createRoot } from 'solid-js';
import { createId } from '@/primitives/create-id';

describe('createId', () => {
	it('generates an id with a wire- prefix by default', () => {
		createRoot((dispose) => {
			const id = createId();
			expect(id).toMatch(/^wire-/);
			dispose();
		});
	});

	it('uses the provided prefix when given', () => {
		createRoot((dispose) => {
			const id = createId('label');
			expect(id.startsWith('label-')).toBe(true);
			dispose();
		});
	});

	it('returns staticId when provided, ignoring prefix', () => {
		createRoot((dispose) => {
			const id = createId('label', 'custom-id');
			expect(id).toBe('custom-id');
			dispose();
		});
	});

	it('produces different ids when called multiple times in one root', () => {
		createRoot((dispose) => {
			const a = createId();
			const b = createId();
			expect(a).not.toBe(b);
			dispose();
		});
	});
});
