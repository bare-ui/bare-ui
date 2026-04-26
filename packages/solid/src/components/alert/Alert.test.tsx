import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'solid-js';
import { Alert } from './Alert';

function renderAlert(rootProps: ComponentProps<typeof Alert.Root> = {}) {
	return render(() => (
		<Alert.Root {...rootProps}>
			<Alert.Title>Alert Title</Alert.Title>
			<Alert.Description>Alert Description</Alert.Description>
			<Alert.Dismiss aria-label='Close alert' />
		</Alert.Root>
	));
}

describe('Alert', () => {
	it('renders title and description', () => {
		renderAlert();
		expect(screen.getByText('Alert Title')).toBeInTheDocument();
		expect(screen.getByText('Alert Description')).toBeInTheDocument();
	});

	it('root has role="alert"', () => {
		renderAlert();
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('data-status attribute is set from status prop', () => {
		renderAlert({ status: 'success' });
		expect(screen.getByRole('alert')).toHaveAttribute('data-status', 'success');
	});

	it('Title has data-part="title"', () => {
		renderAlert();
		expect(screen.getByText('Alert Title')).toHaveAttribute('data-part', 'title');
	});

	it('Description has data-part="description"', () => {
		renderAlert();
		expect(screen.getByText('Alert Description')).toHaveAttribute('data-part', 'description');
	});

	it('clicking Dismiss removes the alert', async () => {
		renderAlert();
		expect(screen.getByRole('alert')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Close alert' }));
		expect(screen.queryByRole('alert')).toBeNull();
	});

	it('onDismiss fires when dismissed', async () => {
		const handleDismiss = vi.fn();
		renderAlert({ onDismiss: handleDismiss });
		await userEvent.click(screen.getByRole('button', { name: 'Close alert' }));
		expect(handleDismiss).toHaveBeenCalledTimes(1);
	});

	it('isAutoDismissable: alert dismisses after dismissCountdown', () => {
		vi.useFakeTimers();
		renderAlert({ isAutoDismissable: true, dismissCountdown: 1000 });
		expect(screen.getByRole('alert')).toBeInTheDocument();
		vi.advanceTimersByTime(1100);
		expect(screen.queryByRole('alert')).toBeNull();
		vi.useRealTimers();
	});

	it('isAutoDismissable: alert still present before countdown', () => {
		vi.useFakeTimers();
		renderAlert({ isAutoDismissable: true, dismissCountdown: 2000 });
		vi.advanceTimersByTime(500);
		expect(screen.getByRole('alert')).toBeInTheDocument();
		vi.useRealTimers();
	});

	it('Dismiss button fires custom onClick alongside dismiss', async () => {
		const handleClick = vi.fn();
		render(() => (
			<Alert.Root>
				<Alert.Dismiss onClick={handleClick}>X</Alert.Dismiss>
			</Alert.Root>
		));
		await userEvent.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
		expect(screen.queryByRole('alert')).toBeNull();
	});
});
