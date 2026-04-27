import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Modal } from './Modal';

function renderModal(rootProps: ComponentProps<typeof Modal.Root> = {}) {
	return render(() => (
		<Modal.Root {...rootProps}>
			<Modal.Portal>
				<Modal.Overlay data-testid='overlay'>
					<Modal.Content data-testid='content'>
						<p>Modal content</p>
						<Modal.Close>Close</Modal.Close>
					</Modal.Content>
				</Modal.Overlay>
			</Modal.Portal>
		</Modal.Root>
	));
}

describe('Modal', () => {
	it('does not render content when closed by default', () => {
		renderModal();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders content when defaultOpen=true', () => {
		renderModal({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('dialog has aria-modal=true', () => {
		renderModal({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
	});

	it('content shows text when open', () => {
		renderModal({ defaultOpen: true });
		expect(screen.getByText('Modal content')).toBeInTheDocument();
	});

	it('Close button closes the modal', async () => {
		renderModal({ defaultOpen: true });
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('clicking overlay closes the modal', async () => {
		renderModal({ defaultOpen: true });
		await userEvent.click(screen.getByTestId('overlay'));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('Escape key closes the modal', async () => {
		renderModal({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('controlled open=true shows modal', () => {
		renderModal({ open: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('controlled open=false hides modal', () => {
		renderModal({ open: false });
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('onOpenChange fires with false when closed', async () => {
		const handleOpenChange = vi.fn();
		renderModal({ defaultOpen: true, onOpenChange: handleOpenChange });
		await userEvent.keyboard('{Escape}');
		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it('content data-state="open" when open', () => {
		renderModal({ defaultOpen: true });
		expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'open');
	});

	it('clicking inside content does not close modal', async () => {
		renderModal({ defaultOpen: true });
		await userEvent.click(screen.getByText('Modal content'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
