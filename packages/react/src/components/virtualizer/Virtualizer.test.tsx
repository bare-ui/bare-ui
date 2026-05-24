import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Virtualizer } from './Virtualizer';

describe('Virtualizer', () => {
	it('renders only a window of items, not the full count', () => {
		const { container } = render(
			<Virtualizer.Root
				count={2000}
				estimateSize={40}>
				{({ index }) => <div>{`row ${index}`}</div>}
			</Virtualizer.Root>,
		);
		const items = container.querySelectorAll('[data-virtual-item]');
		expect(items.length).toBeGreaterThan(0);
		expect(items.length).toBeLessThan(50);
		expect(items[0]).toHaveTextContent('row 0');
	});

	it('sizes the inner element to the full estimated extent (vertical)', () => {
		const { container } = render(
			<Virtualizer.Root
				count={100}
				estimateSize={40}>
				{({ index }) => <div>{index}</div>}
			</Virtualizer.Root>,
		);
		const sizer = container.querySelector('[data-virtualizer-sizer]') as HTMLElement;
		expect(sizer.style.height).toBe('4000px');
		expect(sizer.style.width).toBe('100%');
	});

	it('uses the width axis when horizontal', () => {
		const { container } = render(
			<Virtualizer.Root
				count={100}
				estimateSize={40}
				orientation='horizontal'>
				{({ index }) => <div>{index}</div>}
			</Virtualizer.Root>,
		);
		const root = container.firstElementChild as HTMLElement;
		expect(root).toHaveAttribute('data-orientation', 'horizontal');
		const sizer = container.querySelector('[data-virtualizer-sizer]') as HTMLElement;
		expect(sizer.style.width).toBe('4000px');
	});

	it('positions items along the scroll axis using start offset', () => {
		const { container } = render(
			<Virtualizer.Root
				count={100}
				estimateSize={40}>
				{({ index }) => <div>{index}</div>}
			</Virtualizer.Root>,
		);
		const items = container.querySelectorAll<HTMLElement>('[data-virtual-item]');
		expect(items[0].style.top).toBe('0px');
		expect(items[1].style.top).toBe('40px');
	});

	it('exposes start and size to the render function', () => {
		const seen: number[] = [];
		render(
			<Virtualizer.Root
				count={10}
				estimateSize={25}>
				{({ index, start, size }) => {
					if (index === 2) {
						seen.push(start, size);
					}
					return <div>{index}</div>;
				}}
			</Virtualizer.Root>,
		);
		expect(seen).toEqual([50, 25]);
	});

	it('renders nothing for an empty list', () => {
		const { container } = render(
			<Virtualizer.Root count={0}>{({ index }) => <div>{index}</div>}</Virtualizer.Root>,
		);
		expect(container.querySelectorAll('[data-virtual-item]')).toHaveLength(0);
	});

	it('honors a custom item key', () => {
		const keys: string[] = [];
		render(
			<Virtualizer.Root
				count={3}
				getItemKey={(i) => {
					keys.push(`k-${i}`);
					return `k-${i}`;
				}}>
				{({ index }) => <div>{index}</div>}
			</Virtualizer.Root>,
		);
		expect(keys).toContain('k-0');
	});
});
