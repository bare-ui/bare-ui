import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationMenu } from './NavigationMenu';

function renderNM() {
	return render(
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item value='products'>
					<NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<NavigationMenu.Link href='#a' active>A</NavigationMenu.Link>
						<NavigationMenu.Link href='#b'>B</NavigationMenu.Link>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item value='solutions'>
					<NavigationMenu.Trigger>Solutions</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<NavigationMenu.Link href='#c'>C</NavigationMenu.Link>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href='#blog'>Blog</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>,
	);
}

describe('NavigationMenu', () => {
	it('renders a navigation landmark with default aria-label', () => {
		renderNM();
		expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
	});

	it('opens a menu on trigger click', async () => {
		renderNM();
		await userEvent.click(screen.getByRole('button', { name: 'Products' }));
		expect(screen.getByRole('menu')).toBeInTheDocument();
		expect(screen.getByText('A')).toBeInTheDocument();
	});

	it('clicking the same trigger again closes', async () => {
		renderNM();
		const trigger = screen.getByRole('button', { name: 'Products' });
		await userEvent.click(trigger);
		expect(screen.getByRole('menu')).toBeInTheDocument();
		await userEvent.click(trigger);
		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('Link active prop sets aria-current=page', () => {
		render(
			<NavigationMenu.Root>
				<NavigationMenu.List>
					<NavigationMenu.Item>
						<NavigationMenu.Link href='/' active>Home</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>,
		);
		expect(screen.getByText('Home')).toHaveAttribute('aria-current', 'page');
	});
});
