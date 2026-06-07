import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { Toggle, ToggleGroup } from './Toggle';

describe('Toggle (standalone)', () => {
	it('renders as an unpressed button', () => {
		render(() => <Toggle>Bold</Toggle>);
		const btn = screen.getByRole('button', { name: 'Bold', pressed: false });
		expect(btn).toHaveAttribute('aria-pressed', 'false');
		expect(btn).toHaveAttribute('data-state', 'off');
	});

	it('toggles pressed state on click', async () => {
		const user = userEvent.setup();
		const onPressedChange = vi.fn();
		render(() => <Toggle onPressedChange={onPressedChange}>Bold</Toggle>);
		const btn = screen.getByRole('button');
		await user.click(btn);
		expect(onPressedChange).toHaveBeenCalledWith(true);
		expect(btn).toHaveAttribute('aria-pressed', 'true');
		expect(btn).toHaveAttribute('data-state', 'on');
	});

	it('honors defaultPressed', () => {
		render(() => <Toggle defaultPressed>Bold</Toggle>);
		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
	});

	it('respects controlled pressed', async () => {
		const user = userEvent.setup();
		const onPressedChange = vi.fn();
		render(() => (
			<Toggle
				pressed={false}
				onPressedChange={onPressedChange}>
				Bold
			</Toggle>
		));
		await user.click(screen.getByRole('button'));
		expect(onPressedChange).toHaveBeenCalledWith(true);
		// stays false because controlled value did not change
		expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
	});

	it('does not toggle when disabled', async () => {
		const user = userEvent.setup();
		const onPressedChange = vi.fn();
		render(() => (
			<Toggle
				disabled
				onPressedChange={onPressedChange}>
				Bold
			</Toggle>
		));
		await user.click(screen.getByRole('button'));
		expect(onPressedChange).not.toHaveBeenCalled();
	});
});

describe('ToggleGroup (single)', () => {
	function renderSingle(props: Record<string, unknown> = {}) {
		return render(() => (
			<ToggleGroup.Root
				type='single'
				{...props}>
				<Toggle value='left'>Left</Toggle>
				<Toggle value='center'>Center</Toggle>
				<Toggle value='right'>Right</Toggle>
			</ToggleGroup.Root>
		));
	}

	it('presses only one item at a time', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderSingle({ onChange });
		await user.click(screen.getByText('Left'));
		expect(screen.getByText('Left')).toHaveAttribute('aria-pressed', 'true');
		await user.click(screen.getByText('Center'));
		expect(screen.getByText('Left')).toHaveAttribute('aria-pressed', 'false');
		expect(screen.getByText('Center')).toHaveAttribute('aria-pressed', 'true');
		expect(onChange).toHaveBeenLastCalledWith('center');
	});

	it('deselects when the active item is clicked again', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderSingle({ defaultValue: 'left', onChange });
		await user.click(screen.getByText('Left'));
		expect(screen.getByText('Left')).toHaveAttribute('aria-pressed', 'false');
		expect(onChange).toHaveBeenLastCalledWith(null);
	});

	it('reflects defaultValue', () => {
		renderSingle({ defaultValue: 'right' });
		expect(screen.getByText('Right')).toHaveAttribute('aria-pressed', 'true');
	});
});

describe('ToggleGroup (multiple)', () => {
	function renderMultiple(props: Record<string, unknown> = {}) {
		return render(() => (
			<ToggleGroup.Root
				type='multiple'
				{...props}>
				<Toggle value='bold'>B</Toggle>
				<Toggle value='italic'>I</Toggle>
				<Toggle value='underline'>U</Toggle>
			</ToggleGroup.Root>
		));
	}

	it('allows several items pressed at once', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderMultiple({ onChange });
		await user.click(screen.getByText('B'));
		await user.click(screen.getByText('I'));
		expect(screen.getByText('B')).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByText('I')).toHaveAttribute('aria-pressed', 'true');
		expect(onChange).toHaveBeenLastCalledWith(['bold', 'italic']);
	});

	it('unpresses an item when clicked again', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderMultiple({ defaultValue: ['bold'], onChange });
		await user.click(screen.getByText('B'));
		expect(screen.getByText('B')).toHaveAttribute('aria-pressed', 'false');
		expect(onChange).toHaveBeenLastCalledWith([]);
	});

	it('disables every item when the group is disabled', async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		renderMultiple({ disabled: true, onChange });
		const btn = screen.getByText('B');
		expect(btn).toBeDisabled();
		await user.click(btn);
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('ToggleGroup (roving focus)', () => {
	it('exposes a single tab stop and moves focus with arrows', async () => {
		const user = userEvent.setup();
		render(() => (
			<ToggleGroup.Root type='multiple'>
				<Toggle value='a'>A</Toggle>
				<Toggle value='b'>B</Toggle>
				<Toggle value='c'>C</Toggle>
			</ToggleGroup.Root>
		));
		expect(screen.getByText('A')).toHaveAttribute('tabindex', '0');
		expect(screen.getByText('B')).toHaveAttribute('tabindex', '-1');

		screen.getByText('A').focus();
		await user.keyboard('{ArrowRight}');
		expect(screen.getByText('B')).toHaveFocus();
		expect(screen.getByText('B')).toHaveAttribute('tabindex', '0');
	});

	it('marks the group orientation', () => {
		render(() => (
			<ToggleGroup.Root
				type='single'
				orientation='vertical'>
				<Toggle value='a'>A</Toggle>
			</ToggleGroup.Root>
		));
		expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
	});
});
