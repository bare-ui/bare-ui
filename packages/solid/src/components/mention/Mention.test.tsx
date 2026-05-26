import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
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
			<Mention.Input aria-label='message' />
			<Mention.Content>
				<Mention.Items>{({ option }) => <span>{option.label}</span>}</Mention.Items>
				<Mention.Empty>No matches</Mention.Empty>
			</Mention.Content>
		</Mention.Root>
	));
	return screen.getByLabelText('message') as HTMLTextAreaElement;
}

describe('Mention', () => {
	it('opens the menu when the trigger is typed', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, 'hey @');
		expect(screen.getByRole('listbox')).toBeInTheDocument();
		expect(screen.getAllByRole('option')).toHaveLength(3);
	});

	it('filters options by the query after the trigger', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@j');
		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(2);
		expect(options.map((o) => o.textContent)).toEqual(['John', 'Jane']);
	});

	it('does not trigger when not at a word boundary (e.g. emails)', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, 'a@');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('inserts the active option on Enter and closes', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@j');
		await user.keyboard('{Enter}');
		expect(textarea.value).toBe('@John ');
		expect(screen.queryByRole('listbox')).toBeNull();
	});

	it('navigates options with the arrow keys', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@j');
		await user.keyboard('{ArrowDown}{Enter}');
		expect(textarea.value).toBe('@Jane ');
	});

	it('closes on Escape without inserting', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@jo');
		await user.keyboard('{Escape}');
		expect(screen.queryByRole('listbox')).toBeNull();
		expect(textarea.value).toBe('@jo');
	});

	it('selects an option on click', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@b');
		await user.click(screen.getByRole('option', { name: 'Bob' }));
		expect(textarea.value).toBe('@Bob ');
	});

	it('keeps preceding text intact when inserting a mention', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, 'hey there @jo');
		await user.keyboard('{Enter}');
		expect(textarea.value).toBe('hey there @John ');
	});

	it('inserts a custom value when provided', async () => {
		const user = userEvent.setup();
		const textarea = renderMention({ options: [{ id: 1, label: 'John Doe', value: 'jdoe' }] });
		await user.type(textarea, '@jo');
		await user.keyboard('{Enter}');
		expect(textarea.value).toBe('@jdoe ');
	});

	it('reports selection through onSelect', async () => {
		const onSelect = vi.fn();
		const user = userEvent.setup();
		const textarea = renderMention({ onSelect });
		await user.type(textarea, '@ja');
		await user.keyboard('{Enter}');
		expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ label: 'Jane' }));
	});

	it('shows the empty state when nothing matches', async () => {
		const user = userEvent.setup();
		const textarea = renderMention();
		await user.type(textarea, '@zzz');
		expect(screen.getByText('No matches')).toBeInTheDocument();
		expect(screen.queryAllByRole('option')).toHaveLength(0);
	});

	it('throws when Input is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(() => <Mention.Input />)).toThrow(/Mention.Root/);
		spy.mockRestore();
	});
});
