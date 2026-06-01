import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { accessibleNameVia } from '@/test/sr';
import { Drawer } from './Drawer';

/**
 * Models the public usage from the stories: a trigger button toggles the drawer
 * and the consumer supplies the header/body. The component does not auto-wire
 * aria-labelledby/aria-describedby, so a real consumer names the dialog with
 * aria-labelledby (the header) and describes it with aria-describedby (the body).
 */
function DrawerHarness() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button onClick={() => setOpen(true)}>Open</button>
			<Drawer.Root
				open={open}
				onOpenChange={setOpen}>
				<Drawer.Portal>
					<Drawer.Overlay>
						<Drawer.Content
							aria-labelledby='drawer-title'
							aria-describedby='drawer-body'>
							<Drawer.Header id='drawer-title'>Navigation</Drawer.Header>
							<p id='drawer-body'>Choose a destination.</p>
							<Drawer.Close>Close</Drawer.Close>
						</Drawer.Content>
					</Drawer.Overlay>
				</Drawer.Portal>
			</Drawer.Root>
		</>
	);
}

describe('Drawer — screen reader semantics', () => {
	it('exposes the content as an aria-modal dialog', async () => {
		render(<DrawerHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
	});

	it('names the dialog by its header via aria-labelledby', async () => {
		render(<DrawerHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		expect(accessibleNameVia(dialog)).toBe('Navigation');
	});

	it('describes the dialog by its body via aria-describedby', async () => {
		render(<DrawerHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		const describedby = dialog.getAttribute('aria-describedby');
		expect(describedby).toBeTruthy();
		expect(document.getElementById(describedby!)?.textContent).toBe('Choose a destination.');
	});

	it('moves focus into the dialog on open', async () => {
		render(<DrawerHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		// jsdom has no layout, so the focus trap focuses the dialog container itself;
		// in a real browser it lands on the first focusable child. Either way focus
		// has left the trigger and is on/inside the dialog.
		expect(trigger).not.toHaveFocus();
		expect(dialog === document.activeElement || dialog.contains(document.activeElement)).toBe(true);
	});

	it('restores focus to the trigger on close', async () => {
		render(<DrawerHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('Escape closes the dialog and restores focus to the trigger', async () => {
		render(<DrawerHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});
});
