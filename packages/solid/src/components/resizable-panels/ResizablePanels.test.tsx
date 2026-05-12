import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { ResizablePanels } from './ResizablePanels';

describe('ResizablePanels', () => {
	it('renders panels and a separator handle', () => {
		render(() => (
			<ResizablePanels.Group
				orientation='horizontal'
				data-testid='group'>
				<ResizablePanels.Panel
					defaultSize={50}
					data-testid='left'>
					L
				</ResizablePanels.Panel>
				<ResizablePanels.Handle aria-label='resize' />
				<ResizablePanels.Panel
					defaultSize={50}
					data-testid='right'>
					R
				</ResizablePanels.Panel>
			</ResizablePanels.Group>
		));
		expect(screen.getByTestId('group')).toHaveAttribute('data-orientation', 'horizontal');
		expect(screen.getByTestId('left')).toHaveAttribute('data-panel', '');
		expect(screen.getByTestId('right')).toHaveAttribute('data-panel', '');
		const sep = screen.getByRole('separator');
		expect(sep).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('vertical group has horizontal separator', () => {
		render(() => (
			<ResizablePanels.Group orientation='vertical'>
				<ResizablePanels.Panel defaultSize={50}>top</ResizablePanels.Panel>
				<ResizablePanels.Handle />
				<ResizablePanels.Panel defaultSize={50}>bottom</ResizablePanels.Panel>
			</ResizablePanels.Group>
		));
		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('dragging the handle updates panel sizes (fires onSizesChange)', () => {
		const onSizesChange = vi.fn();
		const { container } = render(() => (
			<ResizablePanels.Group
				orientation='horizontal'
				onSizesChange={onSizesChange}>
				<ResizablePanels.Panel
					defaultSize={50}
					data-testid='left'>
					L
				</ResizablePanels.Panel>
				<ResizablePanels.Handle aria-label='resize' />
				<ResizablePanels.Panel
					defaultSize={50}
					data-testid='right'>
					R
				</ResizablePanels.Panel>
			</ResizablePanels.Group>
		));

		// Stub the container rect so deltaPct math has a real divisor (jsdom returns 0).
		const group = container.firstChild as HTMLElement;
		group.getBoundingClientRect = () =>
			({ width: 1000, height: 100, top: 0, left: 0, right: 1000, bottom: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

		const handle = screen.getByRole('separator');
		// pointerdown on the handle to start drag
		fireEvent.pointerDown(handle, { clientX: 500, clientY: 50, pointerId: 1 });
		// pointermove on window to drag right by 100px (10% of 1000)
		fireEvent.pointerMove(window, { clientX: 600, clientY: 50, pointerId: 1 });
		// release
		fireEvent.pointerUp(window, { clientX: 600, clientY: 50, pointerId: 1 });

		expect(onSizesChange).toHaveBeenCalled();
		const last = onSizesChange.mock.calls[onSizesChange.mock.calls.length - 1][0] as number[];
		expect(last).toHaveLength(2);
		// Left should grow, right should shrink, sum stays ~100
		expect(last[0]).toBeGreaterThan(50);
		expect(last[1]).toBeLessThan(50);
		expect(last[0] + last[1]).toBeCloseTo(100, 5);
	});

	it('Panel flex-basis style reflects the new size after dragging (uncontrolled)', () => {
		const { container } = render(() => (
			<ResizablePanels.Group orientation='horizontal'>
				<ResizablePanels.Panel
					defaultSize={50}
					data-testid='left'>
					L
				</ResizablePanels.Panel>
				<ResizablePanels.Handle />
				<ResizablePanels.Panel
					defaultSize={50}
					data-testid='right'>
					R
				</ResizablePanels.Panel>
			</ResizablePanels.Group>
		));

		const group = container.firstChild as HTMLElement;
		group.getBoundingClientRect = () =>
			({ width: 1000, height: 100, top: 0, left: 0, right: 1000, bottom: 100, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

		const left = screen.getByTestId('left');
		const right = screen.getByTestId('right');
		expect(left.style.flexBasis).toBe('50%');
		expect(right.style.flexBasis).toBe('50%');

		const handle = screen.getByRole('separator');
		fireEvent.pointerDown(handle, { clientX: 500, clientY: 50, pointerId: 1 });
		fireEvent.pointerMove(window, { clientX: 600, clientY: 50, pointerId: 1 });
		fireEvent.pointerUp(window, { clientX: 600, clientY: 50, pointerId: 1 });

		// After dragging 10% right, left should be ~60%, right ~40%
		const leftBasis = parseFloat(left.style.flexBasis);
		const rightBasis = parseFloat(right.style.flexBasis);
		expect(leftBasis).toBeGreaterThan(55);
		expect(rightBasis).toBeLessThan(45);
	});
});
