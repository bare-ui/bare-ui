import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Drawer } from './Drawer';

function renderDrawer(rootProps: ComponentProps<typeof Drawer.Root> = {}) {
	return render(() => (
		<Drawer.Root {...rootProps}>
			<Drawer.Portal>
				<Drawer.Overlay data-testid='overlay'>
					<Drawer.Content data-testid='content'>
						<Drawer.Header>Header</Drawer.Header>
						<p>Drawer body</p>
						<Drawer.Close>Close</Drawer.Close>
					</Drawer.Content>
				</Drawer.Overlay>
			</Drawer.Portal>
		</Drawer.Root>
	));
}

describe('Drawer', () => {
	it('does not render content when closed by default', () => {
		renderDrawer();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders content when defaultOpen=true', () => {
		renderDrawer({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('dialog has aria-modal=true', () => {
		renderDrawer({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
	});

	it('shows body text when open', () => {
		renderDrawer({ defaultOpen: true });
		expect(screen.getByText('Drawer body')).toBeInTheDocument();
	});

	it('Close button closes the drawer', async () => {
		renderDrawer({ defaultOpen: true });
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('clicking overlay closes the drawer', async () => {
		renderDrawer({ defaultOpen: true });
		await userEvent.click(screen.getByTestId('overlay'));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('Escape key closes the drawer', async () => {
		renderDrawer({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('controlled open=true shows drawer', () => {
		renderDrawer({ open: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('controlled open=false hides drawer', () => {
		renderDrawer({ open: false });
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('onOpenChange fires when closed via Escape', async () => {
		const handleOpenChange = vi.fn();
		renderDrawer({ defaultOpen: true, onOpenChange: handleOpenChange });
		await userEvent.keyboard('{Escape}');
		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it('clicking inside content does not close the drawer', async () => {
		renderDrawer({ defaultOpen: true });
		await userEvent.click(screen.getByText('Drawer body'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('content data-state="open" when open', () => {
		renderDrawer({ defaultOpen: true });
		expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'open');
	});
});
