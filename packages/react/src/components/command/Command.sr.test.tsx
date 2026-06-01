import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Command } from './Command';

function renderCommand(props: Partial<React.ComponentProps<typeof Command.Root>> = {}) {
	return render(
		<Command.Root {...props}>
			<Command.Input aria-label='Command' />
			<Command.List>
				<Command.Empty>No results</Command.Empty>
				<Command.Group heading='Apps'>
					<Command.Item value='Calendar'>Calendar</Command.Item>
					<Command.Item value='Calculator'>Calculator</Command.Item>
				</Command.Group>
				<Command.Group heading='Settings'>
					<Command.Item value='Profile'>Profile</Command.Item>
					<Command.Item
						value='Billing'
						disabled>
						Billing
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Root>,
	);
}

describe('Command — screen reader semantics', () => {
	it('exposes the input as a named combobox controlling the listbox', () => {
		renderCommand();
		const input = expectExposedAs('combobox', 'Command');
		// The palette is always expanded while mounted.
		expect(input).toHaveAttribute('aria-expanded', 'true');
		const listbox = screen.getByRole('listbox');
		expect(input.getAttribute('aria-controls')).toBe(listbox.id);
	});

	it('exposes each entry as an option', () => {
		renderCommand();
		expectExposedAs('option', 'Calendar');
		expectExposedAs('option', 'Calculator');
		expectExposedAs('option', 'Profile');
	});

	it('exposes the active option via aria-activedescendant and tracks arrow keys', async () => {
		renderCommand();
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

	it('exposes a disabled entry as aria-disabled', () => {
		renderCommand();
		expect(expectExposedAs('option', 'Billing')).toHaveAttribute('aria-disabled', 'true');
	});

	it('names each group by its heading for grouped navigation', () => {
		renderCommand();
		expectExposedAs('group', 'Apps');
		expectExposedAs('group', 'Settings');
	});

	it('removes options from the accessibility tree when nothing matches the query', async () => {
		renderCommand();
		const input = expectExposedAs('combobox', 'Command');
		await userEvent.type(input, 'zzzzz');
		expect(screen.queryAllByRole('option')).toHaveLength(0);
		// Empty-state text is rendered so a sighted user sees it; with no live
		// region a SR learns of it via the now-empty listbox + active descendant
		// clearing (aria-activedescendant points at nothing).
		expect(input.getAttribute('aria-activedescendant')).toBeFalsy();
		expect(screen.getByText('No results')).toBeInTheDocument();
	});
});
