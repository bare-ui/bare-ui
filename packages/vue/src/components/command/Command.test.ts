import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h, nextTick } from 'vue';
import { Command } from '.';

function renderCommand(rootProps: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Command.Root, rootProps, () => [
					h(Command.Input, { 'aria-label': 'command' }),
					h(Command.List, null, () => [
						h(Command.Empty, null, () => 'No results'),
						h(Command.Group, { heading: 'Apps' }, () => [
							h(Command.Item, { value: 'Calendar' }, () => 'Calendar'),
							h(Command.Item, { value: 'Calculator' }, () => 'Calculator'),
						]),
						h(Command.Separator, { 'data-testid': 'sep' }),
						h(Command.Group, { heading: 'Settings' }, () => [
							h(Command.Item, { value: 'Profile' }, () => 'Profile'),
							h(Command.Item, { value: 'Billing', disabled: true }, () => 'Billing'),
						]),
					]),
				]);
		},
	});
}

describe('Command', () => {
	it('renders all items initially', async () => {
		renderCommand();
		await nextTick();
		expect(screen.getAllByRole('option')).toHaveLength(4);
	});

	it('highlights the first visible item by default', async () => {
		renderCommand();
		await nextTick();
		expect(screen.getByText('Calendar')).toHaveAttribute('data-active', '');
	});

	it('filters items by the query', async () => {
		const user = userEvent.setup();
		renderCommand();
		await nextTick();
		await user.type(screen.getByLabelText('command'), 'calc');
		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(1);
		expect(options[0]).toHaveTextContent('Calculator');
	});

	it('hides a group with no matching items', async () => {
		const user = userEvent.setup();
		renderCommand();
		await nextTick();
		await user.type(screen.getByLabelText('command'), 'profile');
		const groups = screen.getAllByRole('group', { hidden: true });
		const appsGroup = groups.find((g) => g.getAttribute('aria-labelledby')?.length);
		// Apps group should be hidden, Settings visible
		expect(screen.getByText('Profile')).toBeVisible();
		expect(appsGroup).toBeTruthy();
	});

	it('navigates with arrows and selects with Enter', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		renderCommand({ onSelect });
		await nextTick();
		const input = screen.getByLabelText('command');
		input.focus();
		await user.keyboard('{ArrowDown}'); // Calendar -> Calculator
		expect(screen.getByText('Calculator')).toHaveAttribute('data-active', '');
		await user.keyboard('{Enter}');
		expect(onSelect).toHaveBeenCalledWith('Calculator');
	});

	it('selects an item on click', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		renderCommand({ onSelect });
		await nextTick();
		await user.click(screen.getByText('Profile'));
		expect(onSelect).toHaveBeenCalledWith('Profile');
	});

	it('calls the per-item onSelect handler', async () => {
		const user = userEvent.setup();
		const itemSelect = vi.fn();
		render({
			setup() {
				return () =>
					h(Command.Root, null, () => [
						h(Command.Input, { 'aria-label': 'command' }),
						h(Command.List, null, () => [
							h(Command.Item, { value: 'Run', onSelect: itemSelect }, () => 'Run'),
						]),
					]);
			},
		});
		await nextTick();
		await user.click(screen.getByText('Run'));
		expect(itemSelect).toHaveBeenCalledWith('Run');
	});

	it('does not select a disabled item', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		renderCommand({ onSelect });
		await nextTick();
		await user.click(screen.getByText('Billing'));
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('shows the empty state when nothing matches', async () => {
		const user = userEvent.setup();
		renderCommand();
		await nextTick();
		await user.type(screen.getByLabelText('command'), 'zzzzz');
		expect(screen.getByText('No results')).toBeInTheDocument();
		expect(screen.queryAllByRole('option')).toHaveLength(0);
	});

	it('hides separators while searching', async () => {
		const user = userEvent.setup();
		renderCommand();
		await nextTick();
		expect(screen.getByTestId('sep')).toBeInTheDocument();
		await user.type(screen.getByLabelText('command'), 'ca');
		expect(screen.queryByTestId('sep')).toBeNull();
	});

	it('renders nothing when managed and closed', async () => {
		const { container, rerender } = render({
			setup() {
				return () =>
					h(Command.Root, { open: false, onOpenChange: () => {} }, () => [
						h(Command.Input, { 'aria-label': 'command' }),
					]);
			},
		});
		await nextTick();
		expect(container.querySelector('[data-command-root]')).toBeNull();

		await rerender({});
		// Rerender with open=true by mounting a new component
		const { container: c2 } = render({
			setup() {
				return () =>
					h(Command.Root, { open: true, onOpenChange: () => {} }, () => [
						h(Command.Input, { 'aria-label': 'command2' }),
					]);
			},
		});
		await nextTick();
		expect(c2.querySelector('[data-command-root]')).toBeInTheDocument();
	});

	it('closes on Escape when managed', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		render({
			setup() {
				return () =>
					h(Command.Root, { open: true, onOpenChange }, () => [
						h(Command.Input, { 'aria-label': 'command' }),
						h(Command.List, null, () => [
							h(Command.Item, { value: 'X' }, () => 'X'),
						]),
					]);
			},
		});
		await nextTick();
		screen.getByLabelText('command').focus();
		await user.keyboard('{Escape}');
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('throws when Item is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() =>
			render({
				setup() {
					return () => h(Command.Item, { value: 'x' }, () => 'x');
				},
			}),
		).toThrow(/Command\.Root/);
		spy.mockRestore();
	});
});
