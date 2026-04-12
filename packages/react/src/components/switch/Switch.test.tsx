import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './Switch';

function renderSwitch(props: React.ComponentProps<typeof Switch.Root> = {}) {
	return render(
		<Switch.Root {...props}>
			<Switch.Thumb data-testid='thumb' />
		</Switch.Root>,
	);
}

describe('Switch', () => {
	it('renders a button with role="switch" and aria-checked=false by default', () => {
		renderSwitch();
		const sw = screen.getByRole('switch');
		expect(sw).toBeInTheDocument();
		expect(sw).toHaveAttribute('aria-checked', 'false');
	});

	it('does not have data-checked when unchecked', () => {
		renderSwitch();
		expect(screen.getByRole('switch')).not.toHaveAttribute('data-checked');
	});

	it('toggles aria-checked and data-checked on click (uncontrolled)', async () => {
		renderSwitch();
		const sw = screen.getByRole('switch');
		await userEvent.click(sw);
		expect(sw).toHaveAttribute('aria-checked', 'true');
		expect(sw).toHaveAttribute('data-checked', '');
		await userEvent.click(sw);
		expect(sw).toHaveAttribute('aria-checked', 'false');
		expect(sw).not.toHaveAttribute('data-checked');
	});

	it('uncontrolled: starts with defaultChecked=true', () => {
		renderSwitch({ defaultChecked: true });
		const sw = screen.getByRole('switch');
		expect(sw).toHaveAttribute('aria-checked', 'true');
		expect(sw).toHaveAttribute('data-checked', '');
	});

	it('controlled: reflects checked prop', () => {
		renderSwitch({ checked: true });
		expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
	});

	it('controlled: clicking calls onChange but does not change if consumer does not update', async () => {
		const handleChange = vi.fn();
		renderSwitch({ checked: false, onChange: handleChange });
		const sw = screen.getByRole('switch');
		await userEvent.click(sw);
		expect(handleChange).toHaveBeenCalledWith(true);
		// Still false because consumer didn't update the prop
		expect(sw).toHaveAttribute('aria-checked', 'false');
	});

	it('disabled: clicking does nothing', async () => {
		const handleChange = vi.fn();
		renderSwitch({ disabled: true, onChange: handleChange });
		await userEvent.click(screen.getByRole('switch'));
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('disabled: switch is native-disabled', () => {
		renderSwitch({ disabled: true });
		expect(screen.getByRole('switch')).toBeDisabled();
	});

	it('Thumb gets data-checked when checked', async () => {
		renderSwitch();
		const thumb = screen.getByTestId('thumb');
		expect(thumb).not.toHaveAttribute('data-checked');
		await userEvent.click(screen.getByRole('switch'));
		expect(thumb).toHaveAttribute('data-checked', '');
	});

	it('Thumb gets data-disabled when disabled', () => {
		renderSwitch({ disabled: true });
		expect(screen.getByTestId('thumb')).toHaveAttribute('data-disabled', '');
	});
});
