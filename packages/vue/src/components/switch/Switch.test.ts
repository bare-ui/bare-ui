import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Switch } from '.';

describe('Switch', () => {
	it('renders with role="switch"', () => {
		render({ setup: () => () => h(Switch.Root, null, () => h(Switch.Thumb)) });
		expect(screen.getByRole('switch')).toBeInTheDocument();
	});

	it('has aria-checked=false by default', () => {
		render({ setup: () => () => h(Switch.Root, null, () => h(Switch.Thumb)) });
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
	});

	it('toggles data-checked and aria-checked on click', async () => {
		render({ setup: () => () => h(Switch.Root, null, () => h(Switch.Thumb)) });
		const btn = screen.getByRole('switch');
		await userEvent.click(btn);
		expect(btn).toHaveAttribute('aria-checked', 'true');
		expect(btn).toHaveAttribute('data-checked', '');
		await userEvent.click(btn);
		expect(btn).toHaveAttribute('aria-checked', 'false');
		expect(btn).not.toHaveAttribute('data-checked');
	});

	it('defaultChecked sets initial state', () => {
		render({ setup: () => () => h(Switch.Root, { defaultChecked: true }, () => h(Switch.Thumb)) });
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
	});

	it('onChange fires with new value', async () => {
		const handleChange = vi.fn();
		render({ setup: () => () => h(Switch.Root, { onChange: handleChange }, () => h(Switch.Thumb)) });
		await userEvent.click(screen.getByRole('switch'));
		expect(handleChange).toHaveBeenCalledWith(true);
	});

	it('disabled prevents toggle', async () => {
		render({ setup: () => () => h(Switch.Root, { disabled: true }, () => h(Switch.Thumb)) });
		const btn = screen.getByRole('switch');
		await userEvent.click(btn);
		expect(btn).toHaveAttribute('aria-checked', 'false');
	});

	it('Thumb reflects checked/disabled data attributes', () => {
		const { container } = render({
			setup: () => () => h(Switch.Root, { defaultChecked: true, disabled: true }, () => h(Switch.Thumb)),
		});
		const thumb = container.querySelector('span');
		expect(thumb).toHaveAttribute('data-checked', '');
		expect(thumb).toHaveAttribute('data-disabled', '');
	});
});
