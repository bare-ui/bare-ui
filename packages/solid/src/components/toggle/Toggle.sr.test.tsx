import { describe, it, expect } from 'vitest';
import { render, screen } from '@solidjs/testing-library';
import userEvent from '@testing-library/user-event';
import { Toggle, ToggleGroup } from './Toggle';
import { expectExposedAs } from '@/test/sr';

describe('Toggle — screen reader semantics', () => {
	it('is exposed as a button with its accessible name and not-pressed state', () => {
		render(() => <Toggle>Bold</Toggle>);
		const btn = expectExposedAs('button', 'Bold');
		expect(btn).toHaveAttribute('aria-pressed', 'false');
	});

	it('announces the pressed state after toggling and back on a second toggle', async () => {
		render(() => <Toggle>Bold</Toggle>);
		const btn = screen.getByRole('button', { name: 'Bold' });
		await userEvent.click(btn);
		expect(btn).toHaveAttribute('aria-pressed', 'true');
		await userEvent.click(btn);
		expect(btn).toHaveAttribute('aria-pressed', 'false');
	});

	it('exposes the initial pressed state from defaultPressed', () => {
		render(() => <Toggle defaultPressed>Bold</Toggle>);
		expect(expectExposedAs('button', 'Bold', { pressed: true })).toBeInTheDocument();
	});

	it('exposes a disabled toggle as disabled to assistive tech', () => {
		render(() => <Toggle disabled>Bold</Toggle>);
		expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
	});

	it('exposes the group as a toolbar with its orientation', () => {
		render(() => (
			<ToggleGroup.Root
				type='single'
				aria-label='Text alignment'
				orientation='vertical'>
				<Toggle value='left'>Left</Toggle>
				<Toggle value='center'>Center</Toggle>
			</ToggleGroup.Root>
		));
		const toolbar = expectExposedAs('toolbar', 'Text alignment');
		expect(toolbar).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('exposes single-select pressed state, moving it to the newly pressed item', async () => {
		render(() => (
			<ToggleGroup.Root
				type='single'
				aria-label='Text alignment'>
				<Toggle value='left'>Left</Toggle>
				<Toggle value='center'>Center</Toggle>
			</ToggleGroup.Root>
		));
		await userEvent.click(screen.getByRole('button', { name: 'Left' }));
		expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'false');

		await userEvent.click(screen.getByRole('button', { name: 'Center' }));
		expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false');
		expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('exposes multiple-select pressed state on several items at once', async () => {
		render(() => (
			<ToggleGroup.Root
				type='multiple'
				aria-label='Formatting'>
				<Toggle value='bold'>Bold</Toggle>
				<Toggle value='italic'>Italic</Toggle>
			</ToggleGroup.Root>
		));
		await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
		await userEvent.click(screen.getByRole('button', { name: 'Italic' }));
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
	});
});
