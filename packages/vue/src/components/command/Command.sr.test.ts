/**
 * Screen-reader semantics for Command. Verifies the ARIA combobox+listbox
 * pattern a screen reader navigates — role=combobox, aria-expanded,
 * aria-controls, aria-activedescendant, option selection state, disabled state,
 * group labelling, and filtering — beyond axe's static check.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { nextTick } from 'vue';
import { expectExposedAs } from '@/test/sr';
import { Command } from '.';

const {
	Root: CommandRoot,
	Input: CommandInput,
	List: CommandList,
	Group: CommandGroup,
	Item: CommandItem,
	Empty: CommandEmpty,
} = Command;

function renderCommand(rootProps: Record<string, unknown> = {}) {
	return render({
		template: `
			<CommandRoot v-bind="rootProps">
				<CommandInput aria-label="Command" />
				<CommandList>
					<CommandEmpty>No results</CommandEmpty>
					<CommandGroup heading="Apps">
						<CommandItem value="Calendar">Calendar</CommandItem>
						<CommandItem value="Calculator">Calculator</CommandItem>
					</CommandGroup>
					<CommandGroup heading="Settings">
						<CommandItem value="Profile">Profile</CommandItem>
						<CommandItem value="Billing" :disabled="true">Billing</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandRoot>
		`,
		components: {
			CommandRoot,
			CommandInput,
			CommandList,
			CommandGroup,
			CommandItem,
			CommandEmpty,
		},
		setup() {
			return { rootProps };
		},
	});
}

describe('Command — screen reader semantics', () => {
	it('exposes the input as a named combobox controlling the listbox', async () => {
		renderCommand();
		await nextTick();
		const input = expectExposedAs('combobox', 'Command');
		// The palette is always expanded while mounted.
		expect(input).toHaveAttribute('aria-expanded', 'true');
		const listbox = screen.getByRole('listbox');
		expect(input.getAttribute('aria-controls')).toBe(listbox.id);
	});

	it('exposes each entry as an option', async () => {
		renderCommand();
		await nextTick();
		expectExposedAs('option', 'Calendar');
		expectExposedAs('option', 'Calculator');
		expectExposedAs('option', 'Profile');
	});

	it('exposes the active option via aria-activedescendant and tracks arrow keys', async () => {
		renderCommand();
		await nextTick();
		const input = expectExposedAs('combobox', 'Command');
		// First visible item is active by default.
		const first = input.getAttribute('aria-activedescendant');
		expect(document.getElementById(first as string)).toHaveTextContent('Calendar');
		expect(expectExposedAs('option', 'Calendar')).toHaveAttribute('aria-selected', 'true');

		input.focus();
		await userEvent.keyboard('{ArrowDown}');
		const next = input.getAttribute('aria-activedescendant');
		expect(next).not.toBe(first);
		expect(document.getElementById(next as string)).toHaveTextContent('Calculator');
		expect(expectExposedAs('option', 'Calculator')).toHaveAttribute('aria-selected', 'true');
		expect(expectExposedAs('option', 'Calendar')).toHaveAttribute('aria-selected', 'false');
	});

	it('exposes a disabled entry as aria-disabled', async () => {
		renderCommand();
		await nextTick();
		expect(expectExposedAs('option', 'Billing')).toHaveAttribute('aria-disabled', 'true');
	});

	it('names each group by its heading for grouped navigation', async () => {
		renderCommand();
		await nextTick();
		expectExposedAs('group', 'Apps');
		expectExposedAs('group', 'Settings');
	});

	it('removes options from the accessibility tree when nothing matches the query', async () => {
		renderCommand();
		await nextTick();
		const input = expectExposedAs('combobox', 'Command');
		await userEvent.type(input, 'zzzzz');
		await nextTick();
		expect(screen.queryAllByRole('option')).toHaveLength(0);
		// Empty-state text is rendered so a sighted user sees it; with no live
		// region a SR learns of it via the now-empty listbox + active descendant
		// clearing (aria-activedescendant points at nothing).
		expect(input.getAttribute('aria-activedescendant')).toBeFalsy();
		expect(screen.getByText('No results')).toBeInTheDocument();
	});
});