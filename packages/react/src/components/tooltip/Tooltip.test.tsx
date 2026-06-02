import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tooltip } from './Tooltip';

function renderTooltip(
	rootProps: React.ComponentProps<typeof Tooltip.Root> = {},
	side: React.ComponentProps<typeof Tooltip.Content>['side'] = 'top',
) {
	return render(
		<Tooltip.Root
			delayDuration={0}
			{...rootProps}>
			<Tooltip.Trigger>
				<button>Hover me</button>
			</Tooltip.Trigger>
			<Tooltip.Content
				side={side}
				data-testid='tooltip-content'>
				Tooltip text
			</Tooltip.Content>
		</Tooltip.Root>,
	);
}

describe('Tooltip', () => {
	it('renders trigger', () => {
		renderTooltip();
		expect(screen.getByText('Hover me')).toBeInTheDocument();
	});

	it('content is present in DOM but data-state=closed by default', () => {
		renderTooltip();
		const content = screen.getByTestId('tooltip-content');
		expect(content).toHaveAttribute('data-state', 'closed');
	});

	it('hovering trigger sets data-state=open on content', async () => {
		renderTooltip();
		await userEvent.hover(screen.getByText('Hover me'));
		const content = screen.getByTestId('tooltip-content');
		expect(content).toHaveAttribute('data-state', 'open');
	});

	it('unhovering sets data-state=closed', async () => {
		renderTooltip();
		await userEvent.hover(screen.getByText('Hover me'));
		await userEvent.unhover(screen.getByText('Hover me'));
		expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-state', 'closed');
	});

	it('content has role="tooltip"', () => {
		renderTooltip();
		expect(screen.getByRole('tooltip')).toBeInTheDocument();
	});

	it('content gets data-side attribute', () => {
		renderTooltip({}, 'bottom');
		expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-side', 'bottom');
	});

	it('focusing trigger opens tooltip', async () => {
		renderTooltip();
		const trigger = screen.getByText('Hover me').closest('span')!;
		await userEvent.tab();
		// focus on the span trigger
		trigger.focus();
		// trigger the focus event on the span
		await userEvent.tab({ shift: true });
		await userEvent.tab();
	});

	it('Escape dismisses the tooltip while the trigger is focused', async () => {
		const onOpenChange = vi.fn();
		renderTooltip({ open: true, onOpenChange });
		screen.getByRole('button', { name: 'Hover me' }).focus();
		await userEvent.keyboard('{Escape}');
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('controlled open=true shows tooltip', () => {
		renderTooltip({ open: true });
		expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-state', 'open');
	});

	it('controlled open=false hides tooltip', () => {
		renderTooltip({ open: false });
		expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-state', 'closed');
	});

	it('onOpenChange fires when hovering', async () => {
		const handleOpenChange = vi.fn();
		renderTooltip({ onOpenChange: handleOpenChange });
		await userEvent.hover(screen.getByText('Hover me'));
		expect(handleOpenChange).toHaveBeenCalledWith(true);
	});

	it('onOpenChange fires with false on unhover', async () => {
		const handleOpenChange = vi.fn();
		renderTooltip({ onOpenChange: handleOpenChange });
		await userEvent.hover(screen.getByText('Hover me'));
		await userEvent.unhover(screen.getByText('Hover me'));
		expect(handleOpenChange).toHaveBeenLastCalledWith(false);
	});
});
