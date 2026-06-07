/**
 * Screen-reader semantics for Toast. Toasts appear without focus moving, so a
 * screen reader only learns about them through a live region. Verifies the
 * viewport is a named region and each toast announces politely via role=status.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { Toast, useToast } from './Toast';
import { expectExposedAs, expectAnnounced } from '@/test/sr';

function Harness() {
	const { toast } = useToast();
	return (
		<div>
			<button
				onClick={() =>
					toast({ id: 'saved', title: 'Saved', description: 'Your changes were saved', duration: 0 })
				}>
				show
			</button>
			<Toast.Viewport>
				{(t, dismiss) => (
					<Toast.Root>
						<Toast.Title>{t.title}</Toast.Title>
						<Toast.Description>{t.description}</Toast.Description>
						<Toast.Close onClick={dismiss}>×</Toast.Close>
					</Toast.Root>
				)}
			</Toast.Viewport>
		</div>
	);
}

function renderApp() {
	return render(() => (
		<Toast.Provider>
			<Harness />
		</Toast.Provider>
	));
}

describe('Toast — screen reader semantics', () => {
	it('exposes the viewport as a named region', () => {
		renderApp();
		expectExposedAs('region', 'Notifications');
	});

	it('announces a new toast politely through a live region', async () => {
		renderApp();
		await userEvent.click(screen.getByText('show'));
		// role=status implies aria-live=polite — the toast text reaches the SR.
		const status = screen.getByRole('status');
		expect(status).toHaveAttribute('aria-live', 'polite');
		expectAnnounced('Saved');
		expectAnnounced('Your changes were saved');
	});

	it('gives the dismiss control an accessible name', async () => {
		renderApp();
		await userEvent.click(screen.getByText('show'));
		expectExposedAs('button', 'Close notification');
	});
});
