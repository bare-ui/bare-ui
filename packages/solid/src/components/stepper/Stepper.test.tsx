import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { For } from 'solid-js';
import { Stepper } from './Stepper';

function renderStepper(props: Record<string, unknown> = {}) {
	return render(() => (
		<Stepper.Root
			count={3}
			{...props}>
			<Stepper.List>
				<For each={[0, 1, 2]}>
					{(i) => (
						<Stepper.Item index={i}>
							<Stepper.Trigger>{`Step ${i + 1}`}</Stepper.Trigger>
						</Stepper.Item>
					)}
				</For>
			</Stepper.List>
			<Stepper.Content index={0}>Panel one</Stepper.Content>
			<Stepper.Content index={1}>Panel two</Stepper.Content>
			<Stepper.Content index={2}>Panel three</Stepper.Content>
			<Stepper.PrevTrigger>Back</Stepper.PrevTrigger>
			<Stepper.NextTrigger>Next</Stepper.NextTrigger>
		</Stepper.Root>
	));
}

describe('Stepper', () => {
	it('shows only the active step content', () => {
		renderStepper({ defaultValue: 0 });
		expect(screen.getByText('Panel one')).toBeInTheDocument();
		expect(screen.queryByText('Panel two')).toBeNull();
	});

	it('marks step state as active/completed/inactive', () => {
		renderStepper({ defaultValue: 1 });
		const items = screen.getAllByRole('listitem');
		expect(items[0]).toHaveAttribute('data-state', 'completed');
		expect(items[1]).toHaveAttribute('data-state', 'active');
		expect(items[2]).toHaveAttribute('data-state', 'inactive');
	});

	it('advances and retreats via Next/Back', async () => {
		const user = userEvent.setup();
		renderStepper({ defaultValue: 0 });
		await user.click(screen.getByText('Next'));
		expect(screen.getByText('Panel two')).toBeInTheDocument();
		await user.click(screen.getByText('Back'));
		expect(screen.getByText('Panel one')).toBeInTheDocument();
	});

	it('disables Back on the first step and Next on the last', () => {
		renderStepper({ defaultValue: 0 });
		expect(screen.getByText('Back')).toBeDisabled();
		expect(screen.getByText('Next')).toBeEnabled();
	});

	it('jumps to a step when its trigger is clicked', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderStepper({ defaultValue: 0, onChange });
		await user.click(screen.getByText('Step 3'));
		expect(onChange).toHaveBeenCalledWith(2);
		expect(screen.getByText('Panel three')).toBeInTheDocument();
	});

	it('sets aria-current on the active trigger', () => {
		renderStepper({ defaultValue: 1 });
		expect(screen.getByText('Step 2')).toHaveAttribute('aria-current', 'step');
		expect(screen.getByText('Step 1')).not.toHaveAttribute('aria-current');
	});

	it('linear mode disables steps ahead but allows going back', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderStepper({ defaultValue: 1, linear: true, onChange });
		// step ahead of current is disabled
		expect(screen.getByText('Step 3')).toBeDisabled();
		// a completed step is still reachable
		await user.click(screen.getByText('Step 1'));
		expect(onChange).toHaveBeenCalledWith(0);
	});

	it('clamps next at the last step', async () => {
		const user = userEvent.setup();
		renderStepper({ defaultValue: 2 });
		await user.click(screen.getByText('Next'));
		expect(screen.getByText('Panel three')).toBeInTheDocument();
	});

	it('throws when Trigger is used outside Item', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render(() => (
				<Stepper.Root count={1}>
					<Stepper.Trigger>x</Stepper.Trigger>
				</Stepper.Root>
			)),
		).toThrow(/Stepper.Item/);
		spy.mockRestore();
	});
});
