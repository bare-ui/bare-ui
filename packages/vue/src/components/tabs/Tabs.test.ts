import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Tabs } from '.';

function renderTabs(props: Record<string, unknown> = {}) {
	return render({
		setup() {
			return () =>
				h(Tabs.Root, { defaultValue: 'one', ...props }, () => [
					h(Tabs.List, null, () => [
						h(Tabs.Trigger, { value: 'one' }, () => 'One'),
						h(Tabs.Trigger, { value: 'two' }, () => 'Two'),
						h(Tabs.Trigger, { value: 'three', disabled: true }, () => 'Three'),
					]),
					h(Tabs.Content, { value: 'one' }, () => 'Panel One'),
					h(Tabs.Content, { value: 'two' }, () => 'Panel Two'),
					h(Tabs.Content, { value: 'three' }, () => 'Panel Three'),
				]);
		},
	});
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
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('tab', { name: 'One' })).toHaveFocus();
	});

	it('manual activation: keyboard moves focus but does not activate', async () => {
		render({
			setup() {
				return () =>
					h(Tabs.Root, { defaultValue: 'one', activationMode: 'manual' }, () => [
						h(Tabs.List, null, () => [
							h(Tabs.Trigger, { value: 'one' }, () => 'One'),
							h(Tabs.Trigger, { value: 'two' }, () => 'Two'),
						]),
						h(Tabs.Content, { value: 'one' }, () => 'Panel One'),
						h(Tabs.Content, { value: 'two' }, () => 'Panel Two'),
					]);
			},
		});
		screen.getByRole('tab', { name: 'One' }).focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
		expect(screen.getByText('Panel One')).toBeInTheDocument();
		await userEvent.keyboard('{Enter}');
		expect(screen.getByText('Panel Two')).toBeInTheDocument();
	});

	it('controlled mode reflects value prop and calls onChange', async () => {
		const onChange = vi.fn();
		render({
			setup() {
				return () =>
					h(Tabs.Root, { value: 'one', onChange }, () => [
						h(Tabs.List, null, () => [
							h(Tabs.Trigger, { value: 'one' }, () => 'One'),
							h(Tabs.Trigger, { value: 'two' }, () => 'Two'),
						]),
						h(Tabs.Content, { value: 'one' }, () => 'Panel One'),
						h(Tabs.Content, { value: 'two' }, () => 'Panel Two'),
					]);
			},
		});
		await userEvent.click(screen.getByRole('tab', { name: 'Two' }));
		expect(onChange).toHaveBeenCalledWith('two');
		expect(screen.getByText('Panel One')).toBeInTheDocument();
	});

	it('forceMount keeps inactive panels in DOM with hidden attribute', () => {
		render({
			setup() {
				return () =>
					h(Tabs.Root, { defaultValue: 'one' }, () => [
						h(Tabs.List, null, () => [
							h(Tabs.Trigger, { value: 'one' }, () => 'One'),
							h(Tabs.Trigger, { value: 'two' }, () => 'Two'),
						]),
						h(Tabs.Content, { value: 'one', forceMount: true }, () => 'Panel One'),
						h(Tabs.Content, { value: 'two', forceMount: true }, () => 'Panel Two'),
					]);
			},
		});
		const two = screen.getByText('Panel Two');
		expect(two).toBeInTheDocument();
		expect(two).toHaveAttribute('hidden');
		expect(two).toHaveAttribute('data-state', 'inactive');
	});

	it('forwards consumer onClick exactly once and class to the trigger', async () => {
		const onClick = vi.fn();
		render({
			setup() {
				return () =>
					h(Tabs.Root, { defaultValue: 'one' }, () => [
						h(Tabs.List, null, () => [
							h(Tabs.Trigger, { value: 'one', onClick, class: 'trg' }, () => 'One'),
							h(Tabs.Trigger, { value: 'two' }, () => 'Two'),
						]),
						h(Tabs.Content, { value: 'one' }, () => 'Panel One'),
					]);
			},
		});
		const one = screen.getByRole('tab', { name: 'One' });
		expect(one).toHaveClass('trg');
		await userEvent.click(one);
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});
