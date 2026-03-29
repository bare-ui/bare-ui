import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
	it('renders a <button> element by default', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
	});

	it('has type="button" by default', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
	});

	it('forwards a custom type attribute', () => {
		render(<Button type='submit'>Submit</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
	});

	it('applies disabled attribute and data-disabled when disabled=true', () => {
		render(<Button disabled>Disabled</Button>);
		const btn = screen.getByRole('button');
		expect(btn).toBeDisabled();
		expect(btn).toHaveAttribute('data-disabled', '');
	});

	it('applies data-autofocus when autoFocus=true', () => {
		render(<Button autoFocus>AutoFocus</Button>);
		expect(screen.getByRole('button')).toHaveAttribute('data-autofocus', '');
	});

	it('does not apply data-autofocus when autoFocus is not set', () => {
		render(<Button>Normal</Button>);
		expect(screen.getByRole('button')).not.toHaveAttribute('data-autofocus');
	});

	it('renders child element when asChild=true with an <a>', () => {
		render(
			<Button asChild>
				<a href='/about'>About</a>
			</Button>,
		);
		const link = screen.getByRole('link', { name: 'About' });
		expect(link).toBeInTheDocument();
		expect(link.tagName).toBe('A');
		expect(screen.queryByRole('button')).toBeNull();
	});

	it('merges data attributes onto the child element with asChild', () => {
		render(
			<Button
				asChild
				disabled>
				<a href='/about'>About</a>
			</Button>,
		);
		const link = screen.getByRole('link', { name: 'About' });
		expect(link).toHaveAttribute('data-disabled', '');
	});

	it('fires onClick when clicked', async () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Click</Button>);
		await userEvent.click(screen.getByRole('button'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('does not fire onClick when disabled', async () => {
		const handleClick = vi.fn();
		render(
			<Button
				disabled
				onClick={handleClick}>
				Disabled
			</Button>,
		);
		await userEvent.click(screen.getByRole('button'));
		expect(handleClick).not.toHaveBeenCalled();
	});

	it('shows data-hover on mouse enter and removes on mouse leave', async () => {
		render(<Button>Hover me</Button>);
		const btn = screen.getByRole('button');
		await userEvent.hover(btn);
		expect(btn).toHaveAttribute('data-hover', '');
		await userEvent.unhover(btn);
		expect(btn).not.toHaveAttribute('data-hover');
	});

	it('shows data-active on Space keydown', async () => {
		render(<Button>Press</Button>);
		const btn = screen.getByRole('button');
		btn.focus();
		await userEvent.keyboard('[Space>]');
		expect(btn).toHaveAttribute('data-active', '');
		// release — pointer events from the native button click clear active state
		await userEvent.keyboard('[/Space]');
	});

	it('shows data-active on Enter keydown', async () => {
		render(<Button>Press</Button>);
		const btn = screen.getByRole('button');
		btn.focus();
		await userEvent.keyboard('[Enter>]');
		expect(btn).toHaveAttribute('data-active', '');
		await userEvent.keyboard('[/Enter]');
	});

	it('Space key fires click on button', async () => {
		const handleClick = vi.fn();
		render(<Button onClick={handleClick}>Press</Button>);
		const btn = screen.getByRole('button');
		btn.focus();
		await userEvent.keyboard(' ');
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it('data-active clears on blur', async () => {
		render(<Button>Press</Button>);
		const btn = screen.getByRole('button');
		btn.focus();
		await userEvent.keyboard('[Space>]');
		expect(btn).toHaveAttribute('data-active', '');
		await act(async () => {
			btn.blur();
		});
		expect(btn).not.toHaveAttribute('data-active');
	});
});
