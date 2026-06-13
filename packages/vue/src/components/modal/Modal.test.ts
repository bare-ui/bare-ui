import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, nextTick } from 'vue';
import { Modal } from '.';

// The portal teleports on the client only (hydration-safe), one tick after mount,
// so the helper awaits `nextTick()` before tests query the teleported content.
async function renderModal(rootProps: Record<string, unknown> = {}) {
	const result = render({
		setup() {
			return () =>
				h(Modal.Root, { ...rootProps }, () => [
					h(Modal.Portal, null, () =>
						h(Modal.Overlay, { 'data-testid': 'overlay' }, () =>
							h(Modal.Content, { 'data-testid': 'content' }, () => [
								h('p', null, 'Modal content'),
								h(Modal.Close, null, () => 'Close'),
							]),
						),
					),
				]);
		},
	});
	await nextTick();
	return result;
}

describe('Modal', () => {
	it('does not render content when closed by default', async () => {
		await renderModal();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders content when defaultOpen=true', async () => {
		await renderModal({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('dialog has aria-modal=true', async () => {
		await renderModal({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
	});

	it('content shows text when open', async () => {
		await renderModal({ defaultOpen: true });
		expect(screen.getByText('Modal content')).toBeInTheDocument();
	});

	it('Close button closes the modal', async () => {
		await renderModal({ defaultOpen: true });
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('clicking overlay closes the modal', async () => {
		await renderModal({ defaultOpen: true });
		await userEvent.click(screen.getByTestId('overlay'));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('Escape key closes the modal', async () => {
		await renderModal({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('controlled open=true shows modal', async () => {
		await renderModal({ open: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('controlled open=false hides modal', async () => {
		await renderModal({ open: false });
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('onOpenChange fires with false when closed', async () => {
		const handleOpenChange = vi.fn();
		await renderModal({ defaultOpen: true, onOpenChange: handleOpenChange });
		await userEvent.keyboard('{Escape}');
		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it('content data-state="open" when open', async () => {
		await renderModal({ defaultOpen: true });
		expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'open');
	});

	it('clicking inside content does not close modal', async () => {
		await renderModal({ defaultOpen: true });
		await userEvent.click(screen.getByText('Modal content'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});
});
