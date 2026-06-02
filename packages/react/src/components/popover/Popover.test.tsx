import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';

function renderPopover(props: Partial<React.ComponentProps<typeof Popover.Root>> = {}) {
	return render(
		<Popover.Root {...props}>
			<Popover.Trigger>Open</Popover.Trigger>
			<Popover.Content>
				<p>Popover body</p>
				<Popover.Close>Close</Popover.Close>
			</Popover.Content>
		</Popover.Root>,
	);
}

describe('Popover', () => {
	it('starts closed by default', () => {
		renderPopover();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Open' })).toHaveAttribute('aria-expanded', 'false');
	});

	it('opens on trigger click and shows content with role=dialog', async () => {
		renderPopover();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByText('Popover body')).toBeInTheDocument();
	});

	it('closes when Popover.Close is clicked', async () => {
		renderPopover();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('closes on Escape', async () => {
		renderPopover();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});

	it('moves focus into the popover content on open', async () => {
		renderPopover();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		// Focus lands inside the dialog (the first focusable, or the dialog container
		// itself — jsdom can't compute layout so it falls back to the container).
		expect(dialog === document.activeElement || dialog.contains(document.activeElement)).toBe(true);
	});

	it('returns focus to the trigger when closed via Escape', async () => {
		renderPopover();
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		await userEvent.keyboard('{Escape}');
		expect(trigger).toHaveFocus();
	});

	it('controlled mode reflects open prop and calls onOpenChange', async () => {
		const onOpenChange = vi.fn();
		render(
			<Popover.Root
				open={true}
				onOpenChange={onOpenChange}>
				<Popover.Trigger>Open</Popover.Trigger>
				<Popover.Content>Body</Popover.Content>
			</Popover.Root>,
		);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('Content gets data-side and data-align', async () => {
		render(
			<Popover.Root defaultOpen>
				<Popover.Trigger>Open</Popover.Trigger>
				<Popover.Content
					side='right'
					align='start'>
					Body
				</Popover.Content>
			</Popover.Root>,
		);
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('data-side', 'right');
		expect(dialog).toHaveAttribute('data-align', 'start');
	});
});
