/**
 * Screen-reader semantics for Select. Verifies the ARIA listbox pattern a
 * screen reader navigates — role=button with aria-haspopup=listbox,
 * aria-expanded state transitions, role=listbox visibility, option selection
 * state (aria-selected), and defaultValue pre-selection.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Select } from '.';

const {
	Root: SelectRoot,
	Trigger: SelectTrigger,
	Value: SelectValue,
	Content: SelectContent,
	Item: SelectItem,
} = Select;

interface SelectOption {
	value: string;
	label: string;
	disabled?: boolean;
}

function renderSelect(
	options: SelectOption[] = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'cherry', label: 'Cherry' },
	],
	rootProps: Record<string, unknown> = {},
	placeholder = 'Pick a fruit',
) {
	return render({
		template: `
			<SelectRoot v-bind="rootProps">
				<SelectTrigger aria-label="Fruit">
					<SelectValue :placeholder="placeholder" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem
						v-for="opt in options"
						:key="opt.value"
						:value="opt.value"
						:textValue="opt.label"
						:disabled="opt.disabled"
					>{{ opt.label }}</SelectItem>
				</SelectContent>
			</SelectRoot>
		`,
		components: { SelectRoot, SelectTrigger, SelectValue, SelectContent, SelectItem },
		setup() {
			return { options, rootProps, placeholder };
		},
	});
}

describe('Select — screen reader semantics', () => {
	it('exposes the trigger as a button that pops up a listbox', () => {
		renderSelect();
		const trigger = expectExposedAs('button', 'Fruit');
		expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
	});

	it('falls back to the displayed value text for the accessible name when no aria-label is given', () => {
		render({
			template: `
				<SelectRoot>
					<SelectTrigger>
						<SelectValue placeholder="Pick a fruit" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="apple" textValue="Apple">Apple</SelectItem>
					</SelectContent>
				</SelectRoot>
			`,
			components: { SelectRoot, SelectTrigger, SelectValue, SelectContent, SelectItem },
		});
		// With no aria-label the SR reads the trigger's text content (the placeholder).
		expectExposedAs('button', 'Pick a fruit');
	});

	it('exposes the open state on the trigger and transitions it on click', async () => {
		renderSelect();
		const trigger = expectExposedAs('button', 'Fruit');
		expect(trigger).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(trigger);
		expect(trigger).toHaveAttribute('aria-expanded', 'true');
	});

	it('exposes the dropdown as a listbox only once opened', async () => {
		renderSelect();
		expect(screen.queryByRole('listbox')).toBeNull();
		await userEvent.click(expectExposedAs('button', 'Fruit'));
		expect(screen.getByRole('listbox')).toBeInTheDocument();
	});

	it('exposes each item as an option with the unselected state by default', async () => {
		renderSelect();
		await userEvent.click(expectExposedAs('button', 'Fruit'));
		const banana = expectExposedAs('option', 'Banana');
		expect(banana).toHaveAttribute('aria-selected', 'false');
	});

	it('marks the chosen option as selected and reflects its label on the trigger', async () => {
		renderSelect();
		await userEvent.click(expectExposedAs('button', 'Fruit'));
		await userEvent.click(expectExposedAs('option', 'Banana'));
		// Trigger now reads the chosen label, not the placeholder.
		const trigger = expectExposedAs('button', 'Fruit');
		expect(trigger).toHaveTextContent('Banana');
		// Re-open and confirm the selected option carries aria-selected=true.
		await userEvent.click(trigger);
		expect(expectExposedAs('option', 'Banana')).toHaveAttribute('aria-selected', 'true');
	});

	it('pre-selects the option matching defaultValue and exposes it as selected', async () => {
		renderSelect(undefined, { defaultValue: 'cherry' });
		await userEvent.click(expectExposedAs('button', 'Fruit'));
		expect(expectExposedAs('option', 'Cherry')).toHaveAttribute('aria-selected', 'true');
		expect(expectExposedAs('option', 'Apple')).toHaveAttribute('aria-selected', 'false');
	});
});
