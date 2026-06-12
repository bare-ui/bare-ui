import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Tooltip } from '.';

function renderTooltip(
	rootProps: Record<string, unknown> = {},
	side: 'top' | 'bottom' | 'left' | 'right' = 'top',
) {
	return render({
		setup() {
			return () =>
				h(Tooltip.Root, { delayDuration: 0, ...rootProps }, () => [
					h(Tooltip.Trigger, null, () => h('button', null, 'Hover me')),
					h(Tooltip.Content, { side, 'data-testid': 'tooltip-content' }, () => 'Tooltip text'),
				]);
		},
	});
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

	it('controlled open state works', () => {
		// Focus-based opening is hard to test in jsdom since focus doesn't bubble.
		// Hover tests above already cover the setOpen mechanism.
		// Here we verify controlled open works as expected.
		renderTooltip({ open: true, delayDuration: 300 });
		expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-state', 'open');
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

	it('Escape dismisses the tooltip while the trigger is focused', async () => {
		renderTooltip();
		const button = screen.getByText('Hover me');
		// Open tooltip via hover (uncontrolled), then press Escape while focused.
		await userEvent.hover(button);
		expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-state', 'open');
		button.focus();
		await userEvent.keyboard('{Escape}');
		expect(screen.getByTestId('tooltip-content')).toHaveAttribute('data-state', 'closed');
	});
});
