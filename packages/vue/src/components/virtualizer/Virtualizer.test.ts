import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/vue';
import { h } from 'vue';
import { Virtualizer } from '.';

describe('Virtualizer', () => {
	it('renders only a window of items, not the full count', () => {
		const { container } = render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 2000, estimateSize: 40 },
					{
						default: ({ index }: { index: number }) => h('div', null, `row ${index}`),
					},
				),
		});
		const items = container.querySelectorAll('[data-virtual-item]');
		expect(items.length).toBeGreaterThan(0);
		expect(items.length).toBeLessThan(50);
		expect(items[0]).toHaveTextContent('row 0');
	});

	it('sizes the inner element to the full estimated extent (vertical)', () => {
		const { container } = render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 100, estimateSize: 40 },
					{
						default: ({ index }: { index: number }) => h('div', null, String(index)),
					},
				),
		});
		const sizer = container.querySelector('[data-virtualizer-sizer]') as HTMLElement;
		expect(sizer.style.height).toBe('4000px');
		expect(sizer.style.width).toBe('100%');
	});

	it('uses the width axis when horizontal', () => {
		const { container } = render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 100, estimateSize: 40, orientation: 'horizontal' },
					{
						default: ({ index }: { index: number }) => h('div', null, String(index)),
					},
				),
		});
		const root = container.firstElementChild as HTMLElement;
		expect(root).toHaveAttribute('data-orientation', 'horizontal');
		const sizer = container.querySelector('[data-virtualizer-sizer]') as HTMLElement;
		expect(sizer.style.width).toBe('4000px');
	});

	it('positions items along the scroll axis using start offset', () => {
		const { container } = render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 100, estimateSize: 40 },
					{
						default: ({ index }: { index: number }) => h('div', null, String(index)),
					},
				),
		});
		const items = container.querySelectorAll<HTMLElement>('[data-virtual-item]');
		expect(items[0].style.top).toBe('0px');
		expect(items[1].style.top).toBe('40px');
	});

	it('exposes start and size to the scoped slot', () => {
		const seen: number[] = [];
		render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 10, estimateSize: 25 },
					{
						default: ({ index, start, size }: { index: number; start: number; size: number }) => {
							if (index === 2) {
								seen.push(start, size);
							}
							return h('div', null, String(index));
						},
					},
				),
		});
		expect(seen).toEqual([50, 25]);
	});

	it('renders nothing for an empty list', () => {
		const { container } = render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 0 },
					{
						default: ({ index }: { index: number }) => h('div', null, String(index)),
					},
				),
		});
		expect(container.querySelectorAll('[data-virtual-item]')).toHaveLength(0);
	});

	it('honors a custom item key via getItemKey', () => {
		const keys: string[] = [];
		render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{
						count: 3,
						getItemKey: (i: number) => {
							keys.push(`k-${i}`);
							return `k-${i}`;
						},
					},
					{
						default: ({ index }: { index: number }) => h('div', null, String(index)),
					},
				),
		});
		expect(keys).toContain('k-0');
	});

	it('sets data-orientation attribute', () => {
		const { container } = render({
			setup: () => () =>
				h(
					Virtualizer.Root,
					{ count: 5, estimateSize: 20 },
					{
						default: ({ index }: { index: number }) => h('div', null, String(index)),
					},
				),
		});
		const root = container.firstElementChild as HTMLElement;
		expect(root).toHaveAttribute('data-orientation', 'vertical');
	});
});
