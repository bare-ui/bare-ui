import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectExposedAs } from '@/test/sr';
import { Toggle, ToggleGroup } from '.';

const ToggleGroupRoot = ToggleGroup.Root;

describe('Toggle — screen reader semantics', () => {
	it('is exposed as a button with its accessible name and not-pressed state', () => {
		render({
			template: `<Toggle>Bold</Toggle>`,
			components: { Toggle },
		});
		const btn = expectExposedAs('button', 'Bold');
		expect(btn).toHaveAttribute('aria-pressed', 'false');
	});

	it('announces the pressed state after toggling and back on a second toggle', async () => {
		const user = userEvent.setup();
		render({
			template: `<Toggle>Bold</Toggle>`,
			components: { Toggle },
		});
		const btn = screen.getByRole('button', { name: 'Bold' });
		await user.click(btn);
		expect(btn).toHaveAttribute('aria-pressed', 'true');
		await user.click(btn);
		expect(btn).toHaveAttribute('aria-pressed', 'false');
	});

	it('exposes the initial pressed state from defaultPressed', () => {
		render({
			template: `<Toggle :defaultPressed="true">Bold</Toggle>`,
			components: { Toggle },
		});
		const btn = expectExposedAs('button', 'Bold', { pressed: true });
		expect(btn).toBeInTheDocument();
	});

	it('exposes a disabled toggle as disabled to assistive tech', () => {
		render({
			template: `<Toggle :disabled="true">Bold</Toggle>`,
			components: { Toggle },
		});
		expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
	});

	it('exposes the group container with its orientation', () => {
		// ToggleGroupRoot renders role="group" (not role="toolbar") per WAI-ARIA
		// group pattern; the orientation attribute is still exposed for AT.
		render({
			template: `
				<ToggleGroupRoot type="single" aria-label="Text alignment" orientation="vertical">
					<Toggle value="left">Left</Toggle>
					<Toggle value="center">Center</Toggle>
				</ToggleGroupRoot>
			`,
			components: { ToggleGroupRoot, Toggle },
		});
		const group = expectExposedAs('group', 'Text alignment');
		expect(group).toHaveAttribute('aria-orientation', 'vertical');
	});

	it('exposes single-select pressed state, moving it to the newly pressed item', async () => {
		const user = userEvent.setup();
		render({
			template: `
				<ToggleGroupRoot type="single" aria-label="Text alignment">
					<Toggle value="left">Left</Toggle>
					<Toggle value="center">Center</Toggle>
				</ToggleGroupRoot>
			`,
			components: { ToggleGroupRoot, Toggle },
		});
		await user.click(screen.getByRole('button', { name: 'Left' }));
		expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'false');

		await user.click(screen.getByRole('button', { name: 'Center' }));
		expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('aria-pressed', 'false');
		expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('aria-pressed', 'true');
	});

	it('exposes multiple-select pressed state on several items at once', async () => {
		const user = userEvent.setup();
		render({
			template: `
				<ToggleGroupRoot type="multiple" aria-label="Formatting">
					<Toggle value="bold">Bold</Toggle>
					<Toggle value="italic">Italic</Toggle>
				</ToggleGroupRoot>
			`,
			components: { ToggleGroupRoot, Toggle },
		});
		await user.click(screen.getByRole('button', { name: 'Bold' }));
		await user.click(screen.getByRole('button', { name: 'Italic' }));
		expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
	});
});
