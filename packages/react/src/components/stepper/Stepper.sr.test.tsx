import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Stepper } from './Stepper';

function renderStepper(props: Partial<React.ComponentProps<typeof Stepper.Root>> = {}) {
	return render(
		<Stepper.Root
			count={3}
			{...props}>
			<Stepper.List>
				{[0, 1, 2].map((i) => (
					<Stepper.Item
						key={i}
						index={i}>
						<Stepper.Trigger>{`Step ${i + 1}`}</Stepper.Trigger>
					</Stepper.Item>
				))}
			</Stepper.List>
			<Stepper.Content index={0}>Panel one</Stepper.Content>
			<Stepper.Content index={1}>Panel two</Stepper.Content>
			<Stepper.Content index={2}>Panel three</Stepper.Content>
			<Stepper.PrevTrigger>Back</Stepper.PrevTrigger>
			<Stepper.NextTrigger>Next</Stepper.NextTrigger>
		</Stepper.Root>,
	);
}

describe('Stepper — screen reader semantics', () => {
	it('exposes each step trigger as a button named by its label', () => {
		renderStepper({ defaultValue: 0 });
		expectExposedAs('button', 'Step 1');
		expectExposedAs('button', 'Step 2');
		expectExposedAs('button', 'Step 3');
	});

	it('marks the active step with aria-current=step and only that step', () => {
		renderStepper({ defaultValue: 1 });
		expect(expectExposedAs('button', 'Step 2')).toHaveAttribute('aria-current', 'step');
		expect(expectExposedAs('button', 'Step 1')).not.toHaveAttribute('aria-current');
		expect(expectExposedAs('button', 'Step 3')).not.toHaveAttribute('aria-current');
	});

	it('moves aria-current to the new step as the user advances', async () => {
		renderStepper({ defaultValue: 0 });
		expect(expectExposedAs('button', 'Step 1')).toHaveAttribute('aria-current', 'step');
		await userEvent.click(screen.getByText('Next'));
		expect(expectExposedAs('button', 'Step 2')).toHaveAttribute('aria-current', 'step');
		expect(expectExposedAs('button', 'Step 1')).not.toHaveAttribute('aria-current');
	});

	it('exposes the steps as a list of listitems', () => {
		renderStepper({ defaultValue: 0 });
		expect(screen.getByRole('list')).toBeInTheDocument();
		expect(screen.getAllByRole('listitem')).toHaveLength(3);
	});

	it('exposes the active step panel and hides the others', () => {
		renderStepper({ defaultValue: 1 });
		// Only the active step's content is exposed as a tabpanel; inactive panels
		// are unmounted so SR never reaches them.
		const panels = screen.getAllByRole('tabpanel');
		expect(panels).toHaveLength(1);
		expect(panels[0]).toHaveTextContent('Panel two');
	});

	it('disables navigation controls at the bounds', () => {
		renderStepper({ defaultValue: 0 });
		expect(screen.getByText('Back')).toBeDisabled();
		expect(screen.getByText('Next')).toBeEnabled();
	});

	it('disables steps ahead of the current one in linear mode', () => {
		renderStepper({ defaultValue: 1, linear: true });
		// A step the user cannot yet reach is exposed as disabled, not just styled.
		expect(expectExposedAs('button', 'Step 3')).toBeDisabled();
		expect(expectExposedAs('button', 'Step 1')).toBeEnabled();
	});
});
