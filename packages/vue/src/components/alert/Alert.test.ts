import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Alert } from '.';

describe('Alert', () => {
	it('renders title and description', () => {
		render({
			setup: () => () =>
				h(Alert.Root, null, () => [
					h(Alert.Title, null, () => 'Heads up'),
					h(Alert.Description, null, () => 'Something happened.'),
				]),
		});
		expect(screen.getByText('Heads up')).toBeInTheDocument();
		expect(screen.getByText('Something happened.')).toBeInTheDocument();
	});

	it('has role="alert"', () => {
		render({
			setup: () => () => h(Alert.Root, null, () => h(Alert.Title, null, () => 'Title')),
		});
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('sets data-status from status prop', () => {
		render({
			setup: () => () => h(Alert.Root, { status: 'success' }, () => h(Alert.Title, null, () => 'OK')),
		});
		expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'success');
	});

	it('title has data-part="title"', () => {
		render({
			setup: () => () => h(Alert.Root, null, () => h(Alert.Title, null, () => 'Title')),
		});
		expect(screen.getByText('Title')).toHaveAttribute('data-part', 'title');
	});

	it('description has data-part="description"', () => {
		render({
			setup: () => () => h(Alert.Root, null, () => h(Alert.Description, null, () => 'Desc')),
		});
		expect(screen.getByText('Desc')).toHaveAttribute('data-part', 'description');
	});

	it('dismiss removes the alert', async () => {
		render({
			setup: () => () =>
				h(Alert.Root, null, () => [
					h(Alert.Title, null, () => 'Title'),
					h(Alert.Dismiss, null, () => 'Close'),
				]),
		});
		await userEvent.click(screen.getByText('Close'));
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('onDismiss fires when dismissed', async () => {
		const handleDismiss = vi.fn();
		render({
			setup: () => () =>
				h(Alert.Root, { onDismiss: handleDismiss }, () => h(Alert.Dismiss, null, () => 'Close')),
		});
		await userEvent.click(screen.getByText('Close'));
		expect(handleDismiss).toHaveBeenCalledTimes(1);
	});

	it('auto-dismiss removes after countdown', async () => {
		vi.useFakeTimers();
		render({
			setup: () => () =>
				h(Alert.Root, { isAutoDismissable: true, dismissCountdown: 1000 }, () =>
					h(Alert.Title, null, () => 'Auto'),
				),
		});
		expect(screen.getByRole('alert')).toBeInTheDocument();
		vi.advanceTimersByTime(1000);
		await vi.waitFor(() => {
			expect(screen.queryByRole('alert')).toBeNull();
		});
		vi.useRealTimers();
	});
});
