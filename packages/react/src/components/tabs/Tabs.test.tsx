import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from './Tabs';

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs.Root>> = {}) {
	return render(
		<Tabs.Root
			defaultValue='one'
			{...props}>
			<Tabs.List>
				<Tabs.Trigger value='one'>One</Tabs.Trigger>
				<Tabs.Trigger value='two'>Two</Tabs.Trigger>
				<Tabs.Trigger
					value='three'
					disabled>
					Three
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value='one'>Panel One</Tabs.Content>
			<Tabs.Content value='two'>Panel Two</Tabs.Content>
			<Tabs.Content value='three'>Panel Three</Tabs.Content>
		</Tabs.Root>,
	);
}

describe('Tabs', () => {
	it('renders a tablist with three tabs', () => {
		renderTabs();
		expect(screen.getByRole('tablist')).toBeInTheDocument();
		expect(screen.getAllByRole('tab')).toHaveLength(3);
	});

	it('shows only the active tabpanel by default', () => {
		renderTabs();
		expect(screen.getByText('Panel One')).toBeInTheDocument();
		expect(screen.queryByText('Panel Two')).not.toBeInTheDocument();
	});

	it('switches active panel on click', async () => {
		renderTabs();
		await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
		expect(screen.getByText('Panel Two')).toBeInTheDocument();
		expect(screen.queryByText('Panel One')).not.toBeInTheDocument();
	});

	it('skips disabled triggers via arrow keys', async () => {
		renderTabs();
		const one = screen.getByRole('tab', { name: 'One' });
		one.focus();
		// One -> ArrowRight should move to Two (Three is disabled)
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
		// Wrap around: from Two ArrowRight should go past Three to One
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
	});

	it('manual activation: keyboard moves focus but does not activate', async () => {
		render(
			<Tabs.Root
				defaultValue='one'
				activationMode='manual'>
				<Tabs.List>
					<Tabs.Trigger value='one'>One</Tabs.Trigger>
					<Tabs.Trigger value='two'>Two</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value='one'>Panel One</Tabs.Content>
				<Tabs.Content value='two'>Panel Two</Tabs.Content>
			</Tabs.Root>,
		);
		screen.getByRole('tab', { name: 'One' }).focus();
		await userEvent.keyboard('{ArrowRight}');
		// Focus moved but panel is still One
		expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
		expect(screen.getByText('Panel One')).toBeInTheDocument();
		await userEvent.keyboard('{Enter}');
		expect(screen.getByText('Panel Two')).toBeInTheDocument();
	});

	it('controlled mode reflects value prop and calls onChange', async () => {
		const onChange = vi.fn();
		render(
			<Tabs.Root
				value='one'
				onChange={onChange}>
				<Tabs.List>
					<Tabs.Trigger value='one'>One</Tabs.Trigger>
					<Tabs.Trigger value='two'>Two</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value='one'>Panel One</Tabs.Content>
				<Tabs.Content value='two'>Panel Two</Tabs.Content>
			</Tabs.Root>,
		);
		await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
		expect(onChange).toHaveBeenCalledWith('two');
		// Stays on one because controlled and parent didn't update
		expect(screen.getByText('Panel One')).toBeInTheDocument();
	});

	it('forceMount keeps inactive panels in DOM with hidden attribute', () => {
		render(
			<Tabs.Root defaultValue='one'>
				<Tabs.List>
					<Tabs.Trigger value='one'>One</Tabs.Trigger>
					<Tabs.Trigger value='two'>Two</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content
					value='one'
					forceMount>
					Panel One
				</Tabs.Content>
				<Tabs.Content
					value='two'
					forceMount>
					Panel Two
				</Tabs.Content>
			</Tabs.Root>,
		);
		const two = screen.getByText('Panel Two');
		expect(two).toBeInTheDocument();
		expect(two).toHaveAttribute('hidden');
		expect(two).toHaveAttribute('data-state', 'inactive');
	});
});
