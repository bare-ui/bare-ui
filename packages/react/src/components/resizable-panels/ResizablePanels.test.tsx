import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResizablePanels } from './ResizablePanels';

describe('ResizablePanels', () => {
	it('renders panels and a separator handle', () => {
		render(
			<ResizablePanels.Group orientation='horizontal' data-testid='group'>
				<ResizablePanels.Panel defaultSize={50} data-testid='left'>L</ResizablePanels.Panel>
				<ResizablePanels.Handle aria-label='resize' />
				<ResizablePanels.Panel defaultSize={50} data-testid='right'>R</ResizablePanels.Panel>
			</ResizablePanels.Group>,
		);
		expect(screen.getByTestId('group')).toHaveAttribute('data-orientation', 'horizontal');
		expect(screen.getByTestId('left')).toHaveAttribute('data-panel', '');
		expect(screen.getByTestId('right')).toHaveAttribute('data-panel', '');
		const sep = screen.getByRole('separator');
		expect(sep).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('vertical group has horizontal separator', () => {
		render(
			<ResizablePanels.Group orientation='vertical'>
				<ResizablePanels.Panel defaultSize={50}>top</ResizablePanels.Panel>
				<ResizablePanels.Handle />
				<ResizablePanels.Panel defaultSize={50}>bottom</ResizablePanels.Panel>
			</ResizablePanels.Group>,
		);
		expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
	});
});
