/**
 * Screen-reader semantics for Combobox. Verifies the ARIA combobox pattern a
 * screen reader navigates — role=combobox, aria-autocomplete, aria-expanded,
 * aria-controls, aria-activedescendant, option selection state, disabled state,
 * and filtering — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Combobox } from '.';

const {
	Root: ComboboxRoot,
	Input: ComboboxInput,
	Trigger: ComboboxTrigger,
	Content: ComboboxContent,
	Items: ComboboxItems,
	Empty: ComboboxEmpty,
} = Combobox;

const options = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'solid', label: 'Solid', disabled: true },
];

function renderCB(props: Record<string, unknown> = {}) {
	return render({
		template: `
			<ComboboxRoot :options="options" v-bind="rootProps">
				<ComboboxInput aria-label="Framework" />
				<ComboboxTrigger>▾</ComboboxTrigger>
				<ComboboxContent>
					<ComboboxItems v-slot="{ option }">
						<span>{{ option.label }}</span>
					</ComboboxItems>
					<ComboboxEmpty>No results</ComboboxEmpty>
				</ComboboxContent>
			</ComboboxRoot>
		`,
		components: {
			ComboboxRoot,
			ComboboxInput,
			ComboboxTrigger,
			ComboboxContent,
			ComboboxItems,
			ComboboxEmpty,
		},
		setup() {
			return { options, rootProps: props };
		},
	});
}

describe('Combobox — screen reader semantics', () => {
	it('exposes the input as a named combobox controlling its listbox', () => {
		renderCB();
		const input = expectExposedAs('combobox', 'Framework');
		expect(input).toHaveAttribute('aria-autocomplete', 'list');
		expect(input).toHaveAttribute('aria-controls');
	});

	it('exposes the open state on the combobox and transitions it on focus', async () => {
		renderCB();
		const input = expectExposedAs('combobox', 'Framework');
		expect(input).toHaveAttribute('aria-expanded', 'false');
		await userEvent.click(input);
		expect(input).toHaveAttribute('aria-expanded', 'true');
	});

	it('points aria-controls at the listbox that appears when open', async () => {
		renderCB();
		const input = expectExposedAs('combobox', 'Framework');
		await userEvent.click(input);
		const listbox = screen.getByRole('listbox');
		expect(input.getAttribute('aria-controls')).toBe(listbox.id);
	});

	it('moves aria-activedescendant onto the highlighted option as the user arrows down', async () => {
		renderCB();
		const input = expectExposedAs('combobox', 'Framework');
		await userEvent.click(input);
		await userEvent.keyboard('{ArrowDown}');
		const firstActive = input.getAttribute('aria-activedescendant');
		expect(firstActive).toBeTruthy();
		// The active descendant must be a real option element in the document.
		expect(document.getElementById(firstActive as string)).toHaveAttribute('role', 'option');
		await userEvent.keyboard('{ArrowDown}');
		expect(input.getAttribute('aria-activedescendant')).not.toBe(firstActive);
	});

	it('exposes the selected option as selected after a commit', async () => {
		renderCB();
		const input = expectExposedAs('combobox', 'Framework');
		await userEvent.click(input);
		await userEvent.click(expectExposedAs('option', 'Vue'));
		// Re-open with a cleared query so every option is exposed again.
		await userEvent.clear(input);
		await userEvent.click(input);
		expect(expectExposedAs('option', 'Vue')).toHaveAttribute('aria-selected', 'true');
		expect(expectExposedAs('option', 'React')).toHaveAttribute('aria-selected', 'false');
	});

	it('exposes a disabled option as aria-disabled so SRs announce it', async () => {
		renderCB();
		await userEvent.click(expectExposedAs('combobox', 'Framework'));
		expect(expectExposedAs('option', 'Solid')).toHaveAttribute('aria-disabled', 'true');
	});

	it('narrows the exposed option set as the query filters results', async () => {
		renderCB();
		const input = expectExposedAs('combobox', 'Framework');
		await userEvent.type(input, 'sve');
		const optionNames = screen.getAllByRole('option').map((o) => o.textContent);
		expect(optionNames).toEqual(['Svelte']);
	});
});
