import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { createSignal } from 'solid-js';
import { accessibleNameVia } from '@/test/sr';
import { Modal } from './Modal';

/**
 * Models the public usage shown in the stories: a trigger button toggles the
 * modal, and the consumer supplies the title/body. The component does not
 * auto-wire aria-labelledby/aria-describedby, so a real consumer names the
 * dialog with aria-labelledby (pointing at the title) and describes it with
 * aria-describedby (pointing at the body) — this is what a screen reader reads.
 */
function ModalHarness() {
	const [open, setOpen] = createSignal(false);
	return (
		<>
			<button onClick={() => setOpen(true)}>Open</button>
			<Modal.Root
				open={open()}
				onOpenChange={setOpen}>
				<Modal.Portal>
					<Modal.Overlay>
						<Modal.Content
							aria-labelledby='modal-title'
							aria-describedby='modal-body'>
							<h2 id='modal-title'>Notification</h2>
							<p id='modal-body'>Your changes have been saved.</p>
							<Modal.Close>Close</Modal.Close>
						</Modal.Content>
					</Modal.Overlay>
				</Modal.Portal>
			</Modal.Root>
		</>
	);
}

describe('Modal — screen reader semantics', () => {
	it('exposes the content as an aria-modal dialog', async () => {
		render(() => <ModalHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		expect(dialog).toHaveAttribute('aria-modal', 'true');
	});

	it('names the dialog by its title via aria-labelledby', async () => {
		render(() => <ModalHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		expect(accessibleNameVia(dialog)).toBe('Notification');
	});

	it('describes the dialog by its body via aria-describedby', async () => {
		render(() => <ModalHarness />);
		await userEvent.click(screen.getByRole('button', { name: 'Open' }));
		const dialog = screen.getByRole('dialog');
		const describedby = dialog.getAttribute('aria-describedby');
		expect(describedby).toBeTruthy();
		expect(document.getElementById(describedby!)?.textContent).toBe('Your changes have been saved.');
	});

	it('moves focus into the dialog on open', async () => {
		render(() => <ModalHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		const dialog = screen.getByRole('dialog');
		// Focus moves off the trigger and onto/into the dialog (focus trap activates).
		// jsdom reports no layout, so getFocusable() finds no visible children and the
		// trap focuses the dialog container itself; in a real browser focus lands on the
		// first focusable child. Either way, focus is no longer outside the dialog.
		expect(trigger).not.toHaveFocus();
		expect(dialog === document.activeElement || dialog.contains(document.activeElement)).toBe(true);
	});

	it('restores focus to the trigger on close', async () => {
		render(() => <ModalHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it('Escape closes the dialog and restores focus to the trigger', async () => {
		render(() => <ModalHarness />);
		const trigger = screen.getByRole('button', { name: 'Open' });
		await userEvent.click(trigger);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
		expect(trigger).toHaveFocus();
	});
});
