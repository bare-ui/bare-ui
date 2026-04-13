import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Drawer } from '.';

function renderDrawer(rootProps: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Drawer.Root, { ...rootProps }, () => [
					h(Drawer.Portal, null, () =>
						h(Drawer.Overlay, { 'data-testid': 'overlay' }, () =>
							h(Drawer.Content, { 'data-testid': 'content' }, () => [
								h(Drawer.Header, null, () => h('h2', null, 'Drawer title')),
								h('p', null, 'Drawer content'),
								h(Drawer.Close, null, () => 'Close'),
							]),
						),
					),
				]);
		},
	});
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

	it('content shows text when open', () => {
		renderDrawer({ defaultOpen: true });
		expect(screen.getByText('Drawer content')).toBeInTheDocument();
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

	it('onOpenChange fires with false when closed', async () => {
		const handleOpenChange = vi.fn();
		renderDrawer({ defaultOpen: true, onOpenChange: handleOpenChange });
		await userEvent.keyboard('{Escape}');
		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it('content data-state="open" when open', () => {
		renderDrawer({ defaultOpen: true });
		expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'open');
	});

	it('clicking inside content does not close drawer', async () => {
		renderDrawer({ defaultOpen: true });
		await userEvent.click(screen.getByText('Drawer content'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('renders header content', () => {
		renderDrawer({ defaultOpen: true });
		expect(screen.getByText('Drawer title')).toBeInTheDocument();
	});
});
