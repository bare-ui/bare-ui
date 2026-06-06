import { useRef } from 'react';
import { act, render, renderHook } from '@testing-library/react';
import { getDirection, isRtl, useDirection } from '@/hooks/use-direction';

describe('getDirection', () => {
	it('returns "ltr" by default when no dir is present', () => {
		const el = document.createElement('div');
		document.body.appendChild(el);
		expect(getDirection(el)).toBe('ltr');
		el.remove();
	});

	it('reads the nearest ancestor dir attribute', () => {
		const wrapper = document.createElement('div');
		wrapper.setAttribute('dir', 'rtl');
		const child = document.createElement('span');
		wrapper.appendChild(child);
		document.body.appendChild(wrapper);
		expect(getDirection(child)).toBe('rtl');
		expect(isRtl(child)).toBe(true);
		wrapper.remove();
	});

	it('honors an explicit dir on the element itself', () => {
		const el = document.createElement('div');
		el.setAttribute('dir', 'ltr');
		const rtlParent = document.createElement('div');
		rtlParent.setAttribute('dir', 'rtl');
		rtlParent.appendChild(el);
		document.body.appendChild(rtlParent);
		// The closest dir host is the element itself (ltr), which wins over the rtl parent.
		expect(getDirection(el)).toBe('ltr');
		rtlParent.remove();
	});

	it('returns "ltr" for null/undefined elements', () => {
		expect(getDirection(null)).toBe('ltr');
		expect(getDirection(undefined)).toBe('ltr');
		expect(isRtl(null)).toBe(false);
	});
});

describe('useDirection', () => {
	it('resolves the direction of the referenced element after mount', () => {
		function Probe({ onDir }: { onDir: (d: string) => void }) {
			const ref = useRef<HTMLDivElement>(null);
			const dir = useDirection(ref);
			onDir(dir);
			return <div ref={ref} dir='rtl' />;
		}
		let last = '';
		render(<Probe onDir={(d) => (last = d)} />);
		expect(last).toBe('rtl');
	});

	it('defaults to "ltr" when the element carries no direction', () => {
		const { result } = renderHook(() => {
			const ref = useRef<HTMLDivElement>(null);
			return { ref, dir: useDirection(ref) };
		});
		expect(result.current.dir).toBe('ltr');
	});

	it('reacts to a later dir flip on the host', async () => {
		function Probe({ onDir }: { onDir: (d: string) => void }) {
			const ref = useRef<HTMLDivElement>(null);
			const dir = useDirection(ref);
			onDir(dir);
			return <div ref={ref} />;
		}
		const seen: string[] = [];
		render(<Probe onDir={(d) => seen.push(d)} />);
		expect(seen.at(-1)).toBe('ltr');
		// MutationObserver callbacks fire as a microtask, so flush before asserting.
		await act(async () => {
			document.documentElement.setAttribute('dir', 'rtl');
			await Promise.resolve();
		});
		expect(seen.at(-1)).toBe('rtl');
		document.documentElement.removeAttribute('dir');
	});
});
