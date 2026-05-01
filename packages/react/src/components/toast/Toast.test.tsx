import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast, useToast } from './Toast';

function Harness({ duration }: { duration?: number } = {}) {
	const { toast } = useToast();
	return (
		<div>
			<button onClick={() => toast({ id: 'hello', title: 'Hello', description: 'World', duration })}>
				show
			</button>
			<button onClick={() => toast({ title: 'Persistent', duration: 0 })}>persistent</button>
			<Toast.Viewport>
				{(t, dismiss) => (
					<Toast.Root key={t.id}>
						<Toast.Title>{t.title}</Toast.Title>
						<Toast.Description>{t.description}</Toast.Description>
						<Toast.Close onClick={dismiss}>×</Toast.Close>
					</Toast.Root>
				)}
			</Toast.Viewport>
		</div>
	);
}

function renderApp(props: { duration?: number; defaultDuration?: number } = {}) {
	return render(
		<Toast.Provider defaultDuration={props.defaultDuration ?? 100}>
			<Harness duration={props.duration} />
		</Toast.Provider>,
	);
}

describe('Toast', () => {
	it('shows a toast when triggered', async () => {
		renderApp({ duration: 0 }); // persistent — keep it visible during the test
		await userEvent.click(screen.getByText('show'));
		expect(screen.getByText('Hello')).toBeInTheDocument();
		expect(screen.getByText('World')).toBeInTheDocument();
	});

	it('auto-dismisses after the specified duration', async () => {
		renderApp({ defaultDuration: 50 });
		await userEvent.click(screen.getByText('show'));
		expect(screen.getByText('Hello')).toBeInTheDocument();
		await waitFor(() => expect(screen.queryByText('Hello')).not.toBeInTheDocument(), { timeout: 1000 });
	});

	it('duration=0 stays mounted', async () => {
		renderApp({ defaultDuration: 50 });
		await userEvent.click(screen.getByText('persistent'));
		// Wait long enough that a non-persistent toast would have dismissed.
		await new Promise((r) => setTimeout(r, 200));
		expect(screen.getByText('Persistent')).toBeInTheDocument();
	});

	it('Close dismisses the toast', async () => {
		renderApp({ duration: 0 });
		await userEvent.click(screen.getByText('show'));
		expect(screen.getByText('Hello')).toBeInTheDocument();
		await userEvent.click(screen.getByRole('button', { name: 'Close notification' }));
		expect(screen.queryByText('Hello')).not.toBeInTheDocument();
	});

	it('throws when useToast is called outside Provider', () => {
		const Bad = () => {
			useToast();
			return null;
		};
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<Bad />)).toThrow();
		spy.mockRestore();
	});
});
