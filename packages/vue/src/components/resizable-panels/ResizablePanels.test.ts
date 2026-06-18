import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/vue';
import { ResizablePanels } from '.';

const { Group: PanelGroup, Panel, Handle: PanelHandle } = ResizablePanels;

// Stub the container rect so deltaPct math has a real divisor (jsdom returns 0).
function stubGroupRect(group: HTMLElement) {
	group.getBoundingClientRect = () =>
		({
			width: 1000,
			height: 100,
			top: 0,
			left: 0,
			right: 1000,
			bottom: 100,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		}) as DOMRect;
}

describe('ResizablePanels', () => {
	it('renders panels and a separator handle', () => {
		render({
			components: { PanelGroup, Panel, PanelHandle },
			template: `
				<PanelGroup orientation="horizontal" data-testid="group">
					<Panel :default-size="50" data-testid="left">L</Panel>
					<PanelHandle aria-label="resize" />
					<Panel :default-size="50" data-testid="right">R</Panel>
				</PanelGroup>
			`,
		});
		expect(screen.getByTestId('group')).toHaveAttribute('data-orientation', 'horizontal');
		expect(screen.getByTestId('left')).toHaveAttribute('data-panel', '');
		expect(screen.getByTestId('right')).toHaveAttribute('data-panel', '');
		// The aria-label is forwarded to the separator as its accessible name.
		const sep = screen.getByRole('separator', { name: 'resize' });
		expect(sep).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('vertical group has horizontal separator', () => {
		render({
			components: { PanelGroup, Panel, PanelHandle },
			template: `
				<PanelGroup orientation="vertical">
					<Panel :default-size="50">top</Panel>
					<PanelHandle />
					<Panel :default-size="50">bottom</Panel>
				</PanelGroup>
			`,
		});
		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('dragging the handle updates panel sizes (fires onSizesChange)', async () => {
		const onSizesChange = vi.fn();
		const { container } = render({
			components: { PanelGroup, Panel, PanelHandle },
			setup() {
				return { onSizesChange };
			},
			template: `
				<PanelGroup orientation="horizontal" :on-sizes-change="onSizesChange">
					<Panel :default-size="50" data-testid="left">L</Panel>
					<PanelHandle aria-label="resize" />
					<Panel :default-size="50" data-testid="right">R</Panel>
				</PanelGroup>
			`,
		});

		stubGroupRect(container.firstElementChild as HTMLElement);

		const handle = screen.getByRole('separator');
		// pointerdown on the handle to start the drag.
		await fireEvent.pointerDown(handle, { clientX: 500, clientY: 50, pointerId: 1 });
		// pointermove on window to drag right by 100px (10% of 1000).
		await fireEvent.pointerMove(window, { clientX: 600, clientY: 50, pointerId: 1 });
		// release.
		await fireEvent.pointerUp(window, { clientX: 600, clientY: 50, pointerId: 1 });

		expect(onSizesChange).toHaveBeenCalled();
		const last = onSizesChange.mock.calls[onSizesChange.mock.calls.length - 1][0] as number[];
		expect(last).toHaveLength(2);
		// Left should grow, right should shrink, sum stays ~100.
		expect(last[0]).toBeGreaterThan(50);
		expect(last[1]).toBeLessThan(50);
		expect(last[0] + last[1]).toBeCloseTo(100, 5);
	});

	it('Panel flex-basis style reflects the new size after dragging (uncontrolled)', async () => {
		const { container } = render({
			components: { PanelGroup, Panel, PanelHandle },
			template: `
				<PanelGroup orientation="horizontal">
					<Panel :default-size="50" data-testid="left">L</Panel>
					<PanelHandle />
					<Panel :default-size="50" data-testid="right">R</Panel>
				</PanelGroup>
			`,
		});

		stubGroupRect(container.firstElementChild as HTMLElement);

		const left = screen.getByTestId('left');
		const right = screen.getByTestId('right');
		expect(left.style.flexBasis).toBe('50%');
		expect(right.style.flexBasis).toBe('50%');

		const handle = screen.getByRole('separator');
		await fireEvent.pointerDown(handle, { clientX: 500, clientY: 50, pointerId: 1 });
		await fireEvent.pointerMove(window, { clientX: 600, clientY: 50, pointerId: 1 });
		await fireEvent.pointerUp(window, { clientX: 600, clientY: 50, pointerId: 1 });

		// After dragging 10% right, left should be ~60%, right ~40%.
		const leftBasis = parseFloat(left.style.flexBasis);
		const rightBasis = parseFloat(right.style.flexBasis);
		expect(leftBasis).toBeGreaterThan(55);
		expect(rightBasis).toBeLessThan(45);
	});
});
