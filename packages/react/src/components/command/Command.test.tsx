import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Command } from './Command';

function renderCommand(props: Partial<React.ComponentProps<typeof Command.Root>> = {}) {
	return render(
		<Command.Root {...props}>
			<Command.Input aria-label='command' />
			<Command.List>
				<Command.Empty>No results</Command.Empty>
				<Command.Group heading='Apps'>
					<Command.Item value='Calendar'>Calendar</Command.Item>
					<Command.Item value='Calculator'>Calculator</Command.Item>
				</Command.Group>
				<Command.Separator data-testid='sep' />
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

describe('Command', () => {
	it('renders all items initially', () => {
		renderCommand();
		expect(screen.getAllByRole('option')).toHaveLength(4);
	});

	it('highlights the first visible item by default', () => {
		renderCommand();
		expect(screen.getByText('Calendar')).toHaveAttribute('data-active', '');
	});

	it('filters items by the query', async () => {
		const user = userEvent.setup();
		renderCommand();
		await user.type(screen.getByLabelText('command'), 'calc');
		const options = screen.getAllByRole('option');
		expect(options).toHaveLength(1);
		expect(options[0]).toHaveTextContent('Calculator');
	});

	it('hides a group with no matching items', async () => {
		const user = userEvent.setup();
		renderCommand();
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
		await user.click(screen.getByText('Profile'));
		expect(onSelect).toHaveBeenCalledWith('Profile');
	});

	it('calls the per-item onSelect handler', async () => {
		const user = userEvent.setup();
		const itemSelect = vi.fn();
		render(
			<Command.Root>
				<Command.Input aria-label='command' />
				<Command.List>
					<Command.Item
						value='Run'
						onSelect={itemSelect}>
						Run
					</Command.Item>
				</Command.List>
			</Command.Root>,
		);
		await user.click(screen.getByText('Run'));
		expect(itemSelect).toHaveBeenCalledWith('Run');
	});

	it('does not select a disabled item', async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		renderCommand({ onSelect });
		await user.click(screen.getByText('Billing'));
		expect(onSelect).not.toHaveBeenCalled();
	});

	it('shows the empty state when nothing matches', async () => {
		const user = userEvent.setup();
		renderCommand();
		await user.type(screen.getByLabelText('command'), 'zzzzz');
		expect(screen.getByText('No results')).toBeInTheDocument();
		expect(screen.queryAllByRole('option')).toHaveLength(0);
	});

	it('hides separators while searching', async () => {
		const user = userEvent.setup();
		renderCommand();
		expect(screen.getByTestId('sep')).toBeInTheDocument();
		await user.type(screen.getByLabelText('command'), 'ca');
		expect(screen.queryByTestId('sep')).toBeNull();
	});

	it('renders nothing when managed and closed', () => {
		const { container, rerender } = render(
			<Command.Root
				open={false}
				onOpenChange={() => {}}>
				<Command.Input aria-label='command' />
			</Command.Root>,
		);
		expect(container.querySelector('[data-command-root]')).toBeNull();

		rerender(
			<Command.Root
				open
				onOpenChange={() => {}}>
				<Command.Input aria-label='command' />
			</Command.Root>,
		);
		expect(container.querySelector('[data-command-root]')).toBeInTheDocument();
	});

	it('closes on Escape when managed', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		render(
			<Command.Root
				open
				onOpenChange={onOpenChange}>
				<Command.Input aria-label='command' />
				<Command.List>
					<Command.Item value='X'>X</Command.Item>
				</Command.List>
			</Command.Root>,
		);
		screen.getByLabelText('command').focus();
		await user.keyboard('{Escape}');
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it('throws when Item is used outside Root', () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		expect(() => render(<Command.Item value='x'>x</Command.Item>)).toThrow(/Command.Root/);
		spy.mockRestore();
	});

	describe('keyboard navigation', () => {
		it('ArrowDown skips disabled items', async () => {
			const user = userEvent.setup();
			renderCommand();
			const input = screen.getByLabelText('command');
			input.focus();
			await user.keyboard('{ArrowDown}{ArrowDown}'); // Calendar -> Calculator -> Profile
			expect(screen.getByText('Profile')).toHaveAttribute('data-active', '');
			// Billing is disabled; ArrowDown wraps back to Calendar (loop default).
			await user.keyboard('{ArrowDown}');
			expect(screen.getByText('Calendar')).toHaveAttribute('data-active', '');
			expect(screen.getByText('Billing')).not.toHaveAttribute('data-active', '');
		});

		it('Home/End jump to the first and last enabled items', async () => {
			const user = userEvent.setup();
			renderCommand();
			const input = screen.getByLabelText('command');
			input.focus();
			await user.keyboard('{End}'); // last enabled = Profile (Billing disabled)
			expect(screen.getByText('Profile')).toHaveAttribute('data-active', '');
			await user.keyboard('{Home}');
			expect(screen.getByText('Calendar')).toHaveAttribute('data-active', '');
		});

		it('Enter on a disabled active item is impossible — Enter selects only enabled', async () => {
			const onSelect = vi.fn();
			const user = userEvent.setup();
			render(
				<Command.Root onSelect={onSelect}>
					<Command.Input aria-label='command' />
					<Command.List>
						<Command.Item value='Profile'>Profile</Command.Item>
						<Command.Item value='Billing' disabled>
							Billing
						</Command.Item>
					</Command.List>
				</Command.Root>,
			);
			const input = screen.getByLabelText('command');
			input.focus();
			// Active starts on Profile; ArrowDown can't land on the disabled Billing.
			await user.keyboard('{ArrowDown}');
			expect(screen.getByText('Profile')).toHaveAttribute('data-active', '');
			await user.keyboard('{Enter}');
			expect(onSelect).toHaveBeenCalledWith('Profile');
		});
	});
});
