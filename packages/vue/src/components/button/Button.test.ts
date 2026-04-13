import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { h } from 'vue';
import { Button } from '.';

describe('Button', () => {
	it('renders a <button> element by default', () => {
		render(Button, { slots: { default: () => 'Click me' } });
		expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
	});

	it('has type="button" by default', () => {
		render(Button, { slots: { default: () => 'Click me' } });
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});

	it('forwards a custom type attribute', () => {
		render(Button, { props: { type: 'submit' }, slots: { default: () => 'Submit' } });
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
	});

	it('applies disabled attribute and data-disabled when disabled=true', () => {
		render(Button, { props: { disabled: true }, slots: { default: () => 'Disabled' } });
		const btn = screen.getByRole('button');
		expect(btn).toBeDisabled();
		expect(btn).toHaveAttribute('data-disabled', '');
	});

	it('applies data-autofocus when autoFocus=true', () => {
		render(Button, { props: { autoFocus: true }, slots: { default: () => 'AutoFocus' } });
		expect(screen.getByRole('button')).toHaveAttribute('data-autofocus', '');
	});

	it('does not apply data-autofocus when autoFocus is not set', () => {
		render(Button, { slots: { default: () => 'Normal' } });
		expect(screen.getByRole('button')).not.toHaveAttribute('data-autofocus');
	});

	it('renders child element when asChild=true with an <a>', () => {
		render(Button, {
			props: { asChild: true },
			slots: { default: () => h('a', { href: '/about' }, 'About') },
		});
		const link = screen.getByRole('link', { name: 'About' });
		expect(link).toBeInTheDocument();
		expect(link.tagName).toBe('A');
		expect(screen.queryByRole('button')).toBeNull();
	});

	it('fires onClick when clicked', async () => {
		const handleClick = vi.fn();
		render(Button, { attrs: { onClick: handleClick }, slots: { default: () => 'Click' } });
		await userEvent.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('does not fire onClick when disabled', async () => {
		const handleClick = vi.fn();
		render(Button, {
			props: { disabled: true },
			attrs: { onClick: handleClick },
			slots: { default: () => 'Disabled' },
		});
		await userEvent.click(screen.getByRole('button'));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('shows data-hover on mouse enter and removes on mouse leave', async () => {
		render(Button, { slots: { default: () => 'Hover me' } });
		const btn = screen.getByRole('button');
		await userEvent.hover(btn);
		expect(btn).toHaveAttribute('data-hover', '');
		await userEvent.unhover(btn);
		expect(btn).not.toHaveAttribute('data-hover');
	});
});
