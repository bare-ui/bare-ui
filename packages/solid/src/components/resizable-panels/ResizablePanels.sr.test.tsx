import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import { expectExposedAs } from '@/test/sr';
import { ResizablePanels } from './ResizablePanels';

describe('ResizablePanels — screen reader semantics', () => {
	it('exposes a focusable window-splitter with name, orientation and value range', () => {
		render(() => (
			<ResizablePanels.Group orientation='horizontal'>
				<ResizablePanels.Panel
					defaultSize={40}
					minSize={20}
					maxSize={80}>
					left
				</ResizablePanels.Panel>
				<ResizablePanels.Handle aria-label='Resize sidebar' />
				<ResizablePanels.Panel defaultSize={60}>right</ResizablePanels.Panel>
			</ResizablePanels.Group>
		));
		// SR announces "Resize sidebar, splitter" with its current/min/max position.
		const handle = expectExposedAs('separator', 'Resize sidebar');
		// A horizontal group splits along a vertical line.
		expect(handle).toHaveAttribute('aria-orientation', 'vertical');
		expect(handle).toHaveAttribute('aria-valuenow', '40');
		expect(handle).toHaveAttribute('aria-valuemin', '20');
		expect(handle).toHaveAttribute('aria-valuemax', '80');
		// Keyboard users must be able to reach the splitter.
		expect(handle).toHaveAttribute('tabindex', '0');
	});

	it('falls back to a default accessible name when none is supplied', () => {
		render(() => (
			<ResizablePanels.Group orientation='vertical'>
				<ResizablePanels.Panel defaultSize={50}>top</ResizablePanels.Panel>
				<ResizablePanels.Handle />
				<ResizablePanels.Panel defaultSize={50}>bottom</ResizablePanels.Panel>
			</ResizablePanels.Group>
		));
		const handle = expectExposedAs('separator', 'Resize handle');
		// A vertical group splits along a horizontal line.
		expect(handle).toHaveAttribute('aria-orientation', 'horizontal');
	});

	it('removes the splitter from the tab order when disabled', () => {
		render(() => (
			<ResizablePanels.Group orientation='horizontal'>
				<ResizablePanels.Panel defaultSize={50}>a</ResizablePanels.Panel>
				<ResizablePanels.Handle disabled />
				<ResizablePanels.Panel defaultSize={50}>b</ResizablePanels.Panel>
			</ResizablePanels.Group>
		));
		expect(screen.getByRole('separator')).toHaveAttribute('tabindex', '-1');
	});
});
