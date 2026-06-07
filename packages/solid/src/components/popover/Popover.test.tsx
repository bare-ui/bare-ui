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

	it('moves focus into the content on open and restores it to the trigger on close', async () => {
		renderPopover();
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		// Non-modal trap: focus lands inside the content (container fallback in jsdom).
		expect(dialog.contains(document.activeElement)).toBe(true);
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		expect(document.activeElement).toBe(trigger);
	});

	it('does not trap Tab (focus can leave the content)', async () => {
		render(() => (
			<>
				<Popover.Root defaultOpen>
					<Popover.Trigger>Open</Popover.Trigger>
					<Popover.Content>
						<button type='button'>Inside</button>
					</Popover.Content>
				</Popover.Root>
				<button type='button'>Outside</button>
			</>
		));
		const inside = screen.getByRole('button', { name: 'Inside' });
		inside.focus();
		expect(document.activeElement).toBe(inside);
		// With trap: false, Tab is not cycled — pressing Tab from the last focusable
		// must NOT bounce back to the first focusable inside the content.
		await userEvent.tab();
		expect(document.activeElement).not.toBe(inside);
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
