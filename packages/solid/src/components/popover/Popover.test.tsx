import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { Popover } from './Popover';
import type { PopoverRootProps } from './Popover.types';

function renderPopover(props: Partial<PopoverRootProps> = {}) {
	return render(() => (
		<Popover.Root {...props}>
			<Popover.Trigger>Open</Popover.Trigger>
			<Popover.Content>
				<p>Popover body</p>
				<Popover.Close>Close</Popover.Close>
			</Popover.Content>
		</Popover.Root>
	));
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

	it('controlled mode reflects open prop and calls onOpenChange', async () => {
		const onOpenChange = vi.fn();
		render(() => (
			<Popover.Root
				open={true}
				onOpenChange={onOpenChange}>
				<Popover.Trigger>Open</Popover.Trigger>
				<Popover.Content>Body</Popover.Content>
			</Popover.Root>
		));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('Content gets data-side and data-align', () => {
		render(() => (
			<Popover.Root defaultOpen>
				<Popover.Trigger>Open</Popover.Trigger>
				<Popover.Content
					side='right'
					align='start'>
					Body
				</Popover.Content>
			</Popover.Root>
		));
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('data-side', 'right');
		expect(dialog).toHaveAttribute('data-align', 'start');
	});
});
