import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, nextTick } from 'vue';
import { Drawer } from '.';

// The portal teleports on the client only (hydration-safe), one tick after mount,
// so the helper awaits `nextTick()` before tests query the teleported content.
async function renderDrawer(rootProps: Record<string, unknown> = {}) {
	const result = render({
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
	await nextTick();
	return result;
}

describe('Drawer', () => {
	it('does not render content when closed by default', async () => {
		await renderDrawer();
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('renders content when defaultOpen=true', async () => {
		await renderDrawer({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('dialog has aria-modal=true', async () => {
		await renderDrawer({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
	});

	it('content shows text when open', async () => {
		await renderDrawer({ defaultOpen: true });
		expect(screen.getByText('Drawer content')).toBeInTheDocument();
	});

	it('Close button closes the drawer', async () => {
		await renderDrawer({ defaultOpen: true });
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('clicking overlay closes the drawer', async () => {
		await renderDrawer({ defaultOpen: true });
		await userEvent.click(screen.getByTestId('overlay'));
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('Escape key closes the drawer', async () => {
		await renderDrawer({ defaultOpen: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		await userEvent.keyboard('{Escape}');
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('controlled open=true shows drawer', async () => {
		await renderDrawer({ open: true });
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('controlled open=false hides drawer', async () => {
		await renderDrawer({ open: false });
		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('onOpenChange fires with false when closed', async () => {
		const handleOpenChange = vi.fn();
		await renderDrawer({ defaultOpen: true, onOpenChange: handleOpenChange });
		await userEvent.keyboard('{Escape}');
		expect(handleOpenChange).toHaveBeenCalledWith(false);
	});

	it('content data-state="open" when open', async () => {
		await renderDrawer({ defaultOpen: true });
		expect(screen.getByTestId('content')).toHaveAttribute('data-state', 'open');
	});

	it('clicking inside content does not close drawer', async () => {
		await renderDrawer({ defaultOpen: true });
		await userEvent.click(screen.getByText('Drawer content'));
		expect(screen.getByRole('dialog')).toBeInTheDocument();
	});

	it('renders header content', async () => {
		await renderDrawer({ defaultOpen: true });
		expect(screen.getByText('Drawer title')).toBeInTheDocument();
	});
});
