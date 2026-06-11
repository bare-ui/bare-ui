/**
 * Screen-reader semantics for Stepper. Verifies the ARIA pattern a screen
 * reader traverses — step triggers exposed as buttons, aria-current=step on
 * the active step, list/listitem structure for the step list, tabpanel for
 * the active content panel, disabled state on prev/next at the bounds, and
 * disabled state on unreachable steps in linear mode.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Stepper } from '.';

const {
	Root: StepperRoot,
	List: StepperList,
	Item: StepperItem,
	Trigger: StepperTrigger,
	Content: StepperContent,
	PrevTrigger: StepperPrevTrigger,
	NextTrigger: StepperNextTrigger,
} = Stepper;

function renderStepper(props: { defaultValue?: number; linear?: boolean } = {}) {
	const { defaultValue = 0, linear = false } = props;
	return render({
		template: `
			<StepperRoot :count="3" :defaultValue="defaultValue" :linear="linear">
				<StepperList>
					<StepperItem :index="0">
						<StepperTrigger>Step 1</StepperTrigger>
					</StepperItem>
					<StepperItem :index="1">
						<StepperTrigger>Step 2</StepperTrigger>
					</StepperItem>
					<StepperItem :index="2">
						<StepperTrigger>Step 3</StepperTrigger>
					</StepperItem>
				</StepperList>
				<StepperContent :index="0">Panel one</StepperContent>
				<StepperContent :index="1">Panel two</StepperContent>
				<StepperContent :index="2">Panel three</StepperContent>
				<StepperPrevTrigger>Back</StepperPrevTrigger>
				<StepperNextTrigger>Next</StepperNextTrigger>
			</StepperRoot>
		`,
		components: {
			StepperRoot,
			StepperList,
			StepperItem,
			StepperTrigger,
			StepperContent,
			StepperPrevTrigger,
			StepperNextTrigger,
		},
		setup() {
			return { defaultValue, linear };
		},
	});
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
