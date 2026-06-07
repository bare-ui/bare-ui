/**
 * Screen-reader semantics for Mention. Implements the ARIA 1.2 combobox pattern:
 * a role="combobox" wrapper owns the listbox (aria-expanded/aria-controls/
 * aria-haspopup) and shares the textbox accessible name, the textarea stays a
 * textbox carrying aria-activedescendant, and each suggestion is a named option
 * whose selected state tracks the active descendant.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Mention } from './Mention';
import type { MentionOption } from './Mention.types';

const people: MentionOption[] = [
	{ id: 1, label: 'John' },
	{ id: 2, label: 'Jane' },
	{ id: 3, label: 'Bob' },
];

function renderMention(props: Partial<Parameters<typeof Mention.Root>[0]> = {}) {
	render(() => (
		<Mention.Root
			options={people}
			{...props}>
			<Mention.Input aria-label='Message' />
			<Mention.Content>
				<Mention.Items>{({ option }) => <span>{option.label}</span>}</Mention.Items>
				<Mention.Empty>No matches</Mention.Empty>
			</Mention.Content>
		</Mention.Root>
	));
	// The textarea is the focusable `textbox` nested in the `role="combobox"` wrapper.
	return screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement;
}

describe('Mention — screen reader semantics', () => {
	it('exposes a combobox wrapper that shares the textbox accessible name', () => {
		renderMention();
		const combobox = expectExposedAs('combobox', 'Message');
		expect(combobox).toHaveAttribute('aria-haspopup', 'listbox');
		expect(combobox).toHaveAttribute('aria-controls');
		// The inner textarea is also named, so SRs announce the field consistently.
		expectExposedAs('textbox', 'Message');
	});

	it('exposes the open state on the combobox wrapper and transitions it on trigger', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		const combobox = expectExposedAs('combobox', 'Message');
		expect(combobox).toHaveAttribute('aria-expanded', 'false');
		await user.type(textarea, 'hey @');
		expect(expectExposedAs('combobox', 'Message')).toHaveAttribute('aria-expanded', 'true');
	});

	it('points aria-controls at the listbox that appears once triggered', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@');
		const listbox = screen.getByRole('listbox');
		expect(expectExposedAs('combobox', 'Message').getAttribute('aria-controls')).toBe(listbox.id);
	});

	it('exposes each suggestion as a named option', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@');
		expectExposedAs('option', 'John');
		expectExposedAs('option', 'Jane');
		expectExposedAs('option', 'Bob');
	});

	it('moves aria-activedescendant onto the active option as the user arrows', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@');
		// First option active by default.
		const first = textarea.getAttribute('aria-activedescendant');
		expect(document.getElementById(first as string)).toHaveTextContent('John');
		expect(expectExposedAs('option', 'John')).toHaveAttribute('aria-selected', 'true');

		await user.keyboard('{ArrowDown}');
		const next = textarea.getAttribute('aria-activedescendant');
		expect(next).not.toBe(first);
		expect(document.getElementById(next as string)).toHaveTextContent('Jane');
		expect(expectExposedAs('option', 'Jane')).toHaveAttribute('aria-selected', 'true');
		expect(expectExposedAs('option', 'John')).toHaveAttribute('aria-selected', 'false');
	});

	it('collapses the combobox and clears the listbox after a selection', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@b');
		await user.click(expectExposedAs('option', 'Bob'));
		expect(textarea.value).toBe('@Bob ');
		expect(screen.queryByRole('listbox')).toBeNull();
		expect(expectExposedAs('combobox', 'Message')).toHaveAttribute('aria-expanded', 'false');
	});
});
